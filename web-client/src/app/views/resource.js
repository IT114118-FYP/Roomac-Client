import React from 'react';
import { Component } from "react";
import { withTranslation } from 'react-i18next';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { axiosInstance } from '../api/axiosInstance';
import { PlusCircleOutlined, MinusOutlined } from '@ant-design/icons';
import { List, Skeleton, Empty, Button, Space } from 'antd';
import { getTranslatedString } from '../i18n/func';
import { GrLocation } from 'react-icons/gr';

import BookingStepsView from './bookingSteps';

const getItemTitle = (item) => {
  const translated = getTranslatedString(item, 'title')
  return (
    <>
      {translated}
      {!translated || translated === '' ? '' : <MinusOutlined style={{marginLeft: 5, marginRight: 5}} />}
      {item.number}
    </>
  )
}

class ResourceView extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      resources: [],
      resource: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    // Load resources
    axiosInstance
      .get('api/categories/' + this.props.category.id)
      .then((resources) => {
        if (this._isMounted) this.setState({ loading: false, resources: resources.data })
      })
      .catch(() => { if (this._isMounted) this.setState({ loading: false }) });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onCreateBookingButtonClick(resource) {
    this.setState({ resource: resource })
  }

  unsetResource() {
    this.setState({ resource: null })
  }

  render() {
    let title = this.props.category['title_' + this.props.i18n.language];
    title = title && title.length > 0 ? title : this.props.category.title_en;

    if (this.state.loading) {
      return (
        <div>
          <h1>{title}</h1>
          <Skeleton active />
        </div>
      )
    }

    if (this.state.resource) {
      return (
        <Router>
          <Switch>
            <Route exact key={this.props.category.id} path={'/categories/' + this.props.category.id}>
              <BookingStepsView category={this.props.category} resource={this.state.resource} unsetResource={this.unsetResource.bind(this)}/>
            </Route>
          </Switch>
        </Router>
      )
    }

    // https://ant.design/components/list/
    return (
      <Router>
        <Switch>
          <Route exact path={'/categories/' + this.props.category.id}>
            <h1>{title} ({this.state.resources.length} {(this.props.t('results'))})</h1>

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
                    actions={[<Button type="primary" icon={<PlusCircleOutlined />} onClick={this.onCreateBookingButtonClick.bind(this, item)}>{this.props.t('createBooking')}</Button>]}
                    extra={item.image_url && <img width={170} alt="logo" src={item.image_url} />}
                  >
                    <List.Item.Meta
                      title={getItemTitle(item)}
                      description={(
                        <Space>
                          <GrLocation style={{marginBottom: -2}} />
                          <span>{getTranslatedString(item.branch, 'title')}</span>
                        </Space>
                      )}
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

export default withTranslation()(ResourceView)
