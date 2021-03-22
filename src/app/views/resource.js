import React from 'react';
import { Component } from "react";
import { withTranslation } from 'react-i18next';
import { axiosInstance } from '../api/axiosInstance';
import { PlusCircleOutlined, MinusOutlined } from '@ant-design/icons';
import { List, Skeleton, Empty, Button, Space } from 'antd';
import { getTranslatedString } from '../i18n/func';
import { MdPeople } from 'react-icons/md';
import { IoTime, IoLocationSharp } from 'react-icons/io5';
import { getDistance } from 'geolib';

import BookingStepsView from './createBooking';

const getItemTitle = (item) => {
  const translated = getTranslatedString(item, 'title')
  return (
    <>
      {item.number}
      {!translated || translated === '' ? '' : <MinusOutlined style={{marginLeft: 5, marginRight: 5}} />}
      {translated}
    </>
  )
}

const getDistanceString = (start, end) => {
  if (start.lat === null && start.lng === null) {
    return ' - ';
  }

  return (getDistance(
    { latitude: start.lat, longitude: start.lng },
    { latitude: end.lat, longitude: end.lng }) / 1000).toPrecision(3);
}

class ResourceView extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      resources: [],
      resource: null,
      step: 0,
      lat: null,
      lon: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    
    /* Use this if it has navigator.geolocation permission
    navigator.geolocation.getCurrentPosition(function(position) {
        localStorage.setItem('geo', [position.coords.latitude, position.coords.longitude, Date.now()].join(';'));
        if (this._isMounted) this.setState({ lat: position.coords.latitude, lng: position.coords.longitude });
      }.bind(this),
      function(error) {
        if (error.code === error.PERMISSION_DENIED) {
          if (localStorage.getItem('geo') === null || localStorage.getItem('geo').split(';')[2] + 3600 < Date.now()) {
            fetch('http://ip-api.com/json/')
              .then(response => response.json())
              .then(data => {
                localStorage.setItem('geo', [data.lat, data.lon, Date.now()].join(';'));
                if (this._isMounted) this.setState({ lat: data.lat, lng: data.lon });
              });
          } else if (this._isMounted) {
            let geo = localStorage.getItem('geo').split(';');
            this.setState({ lat: geo[0], lng: geo[1] });
          }
        }
      }.bind(this));*/
    
    if (localStorage.getItem('geo') === null
    || localStorage.getItem('geo').split(';').length !== 3
    || localStorage.getItem('geo').split(';')[2] + 3600 < Date.now()) {
      fetch('http://ip-api.com/json/')
        .then(response => response.json())
        .then(data => {
          localStorage.setItem('geo', [data.lat, data.lon, Date.now()].join(';'));
          if (this._isMounted) this.setState({ lat: data.lat, lng: data.lon });
        });
    } else if (this._isMounted) {
      let geo = localStorage.getItem('geo').split(';');
      this.setState({ lat: geo[0], lng: geo[1] });
    }
    
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

  onCreateBookingButtonClick(resource, step) {
    this.setState({ resource: resource, step: step })
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
        <BookingStepsView key={this.props.category.id} category={this.props.category} resource={this.state.resource} step={this.state.step} unsetResource={this.unsetResource.bind(this)} setSelectedKeys={this.props.setSelectedKeys} />
      )
    }

    // https://ant.design/components/list/
    return (
      <>
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
                actions={[<Button type="primary" icon={<PlusCircleOutlined />} onClick={this.onCreateBookingButtonClick.bind(this, item, 1)}>{this.props.t('createBooking')}</Button>]}
                extra={item.image_url && <img width={200} alt="logo" src={item.image_url} />}
              >
                <List.Item.Meta
                  title={<a onClick={this.onCreateBookingButtonClick.bind(this, item, 0)}>{getItemTitle(item)}</a>}
                  description={(
                    <>
                      <div>
                        <Space>
                          <IoLocationSharp style={{marginBottom: -2}} />
                          <span>
                            {getTranslatedString(item.branch, 'title')} • {getDistanceString({ lat: this.state.lat, lng: this.state.lng}, {lat: item.branch.lat, lng: item.branch.lng })} {(this.props.t('km'))}
                          </span>
                        </Space>
                      </div>
                      <div>
                        <Space>
                          <IoTime style={{marginBottom: -2}} />
                          <span>
                            {item.opening_time.substring(0, 5)} - {item.closing_time.substring(0, 5)}
                          </span>
                        </Space>
                      </div>
                      <div>
                        <Space>
                          <MdPeople style={{marginBottom: -2}} />
                          <span>
                            {item.min_user} - {item.max_user}
                          </span>
                        </Space>
                      </div>
                    </>
                  )}
                />
              </List.Item>
            )}
          />
        }
      </>
    );
  }
}

export default withTranslation()(ResourceView)
