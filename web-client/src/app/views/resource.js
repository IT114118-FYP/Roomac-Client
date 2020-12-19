import React from 'react';
import { Component } from "react";
import { axiosInstance } from '../api/axiosInstance';
import { PlusCircleOutlined, MinusOutlined } from '@ant-design/icons';
import { List, Skeleton, Empty, Button } from 'antd';

class ResourceView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      resources: [],
    };
  }

  componentDidMount() {
    this._isMounted = true;
    axiosInstance
      .get(this.props.apiUrl)
      .then((resources) => {
        this.setState({ loading: false, resources: resources.data })
        console.log('-> Resources Loaded - ', this.props.catagoryTitle, this.state.resources);
      })
      .catch(() => this.setState({ loading: false }));
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

    // https://ant.design/components/list/
    return (
      <div>
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
                actions={[<Button type="primary" icon={<PlusCircleOutlined />}>Create Booking</Button>]}
                extra={
                  <img
                    width={170}
                    alt="logo"
                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                  />
                }
              >
                <List.Item.Meta
                  title={
                  <a href='/temp'>
                    {item.title_en}
                    {item.title_en === '' ? '' : '/' + item.title_hk} 
                    {item.title_hk === '' ? '' : '/' + item.title_cn} 
                    {item.title_en === '' && item.title_hk === '' && item.title_cn === '' ? '' : <MinusOutlined style={{marginLeft: 5, marginRight: 5}} />}
                    {item.number}
                  </a>}
                  description={item.branch_id}
                />
                
              </List.Item>
            )}
          />
        }
      </div>
    );
  }
}

export default ResourceView
