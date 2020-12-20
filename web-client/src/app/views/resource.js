import React from 'react';
import { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { axiosInstance } from '../api/axiosInstance';
import { PlusCircleOutlined, MinusOutlined } from '@ant-design/icons';
import { List, Skeleton, Empty, Button } from 'antd';

import BookingStepsView from './bookingSteps';

const getTitle = (item) => {
  return (
    <>
      {item.title_en}
      {item.title_en === '' ? '' : '/' + item.title_hk} 
      {item.title_hk === '' ? '' : '/' + item.title_cn} 
      {item.title_en === '' && item.title_hk === '' && item.title_cn === '' ? '' : <MinusOutlined style={{marginLeft: 5, marginRight: 5}} />}
      {item.number}
    </>
  )
}

class ResourceView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      resources: [],
      resource: null,
    };
  }

  componentDidMount() {
    // Load resources
    axiosInstance
      .get(this.props.apiUrl)
      .then((resources) => {
        this.setState({ loading: false, resources: resources.data })
        console.log('-> Resources Loaded - ', this.props.catagoryTitle, this.state.resources);
      })
      .catch(() => this.setState({ loading: false }));
  }

  onCreateBookingButtonClick(resource) {
    this.setState({ resource: resource })
  }

  unsetResource() {
    this.setState({ resource: null })
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <h1>{this.props.catagoryTitle}</h1>
          <Skeleton active />
        </div>
      )
    }

    if (this.state.resource) {
      return (
        <Router>
          <Switch>
            <Route exact path="/venues">
              <BookingStepsView catagoryTitle={this.props.catagoryTitle} apiUrl={this.props.apiUrl} resource={this.state.resource} unsetResource={this.unsetResource.bind(this)}/>
            </Route>
          </Switch>
        </Router>
      )
    }

    // https://ant.design/components/list/
    return (
      <Router>
        <Switch>
          <Route exact path="/venues">
            <h1>{this.props.catagoryTitle} ({this.state.resources.length} results)</h1>

            { this.state.resources.length === 0 ? <Empty style={{marginTop: 15}} /> :
              <List
                itemLayout="vertical"
                size="default"
                pagination={{
                  onChange: page => {
                    console.log(page);
                  },
                  pageSize: 5,
                  position: 'top',
                }}
                dataSource={this.state.resources}
                footer={''}
                renderItem={item => (
                  <List.Item
                    key={item.id}
                    actions={[<Button type="primary" icon={<PlusCircleOutlined />} onClick={this.onCreateBookingButtonClick.bind(this, item)}>Create Booking</Button>]}
                    extra={item.image_url && <img width={170} alt="logo" src={item.image_url} />}
                  >
                    <List.Item.Meta
                      title={getTitle(item)}
                      description={item.branch_id}
                    />
                  </List.Item>
                )}
              />
            }
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default ResourceView
