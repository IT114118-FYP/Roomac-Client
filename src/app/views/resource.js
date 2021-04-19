import React from 'react';
import { Component } from "react";
import { withTranslation } from 'react-i18next';
import { axiosInstance } from '../api/axiosInstance';
import { PlusCircleOutlined, MinusOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, List, Skeleton, Empty, Button, Space } from 'antd';
import { getTranslatedString, getCurrentLanguage } from '../i18n/func';
import { MdPeople } from 'react-icons/md';
import { IoTime, IoLocationSharp } from 'react-icons/io5';
import { getDistance } from 'geolib';
import algoliasearch from 'algoliasearch/lite';
import { connectStateResults, connectSearchBox, InstantSearch, Highlight, Configure } from 'react-instantsearch-dom';
import * as axios from "axios";

import BookingStepsView from './createBooking';

const searchClient = algoliasearch(
  'HHSMHILUC5',
  'eb44f910d1d0b165dc5a8fadfdd59523'
);

const getDistanceString = (start, end) => {
  if (start.lat === null && start.lng === null) {
    return ' - ';
  }

  let temp = true;
  if (temp) return ' - ';

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
      branches: [],
      tos: [],
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
    
    /*
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
    */
    
    // Load resources
    /*axiosInstance
      .get('api/categories/' + this.props.category.id)
      .then((resources) => {
        if (this._isMounted) this.setState({ loading: false, resources: resources.data })
      })
      .catch(() => { if (this._isMounted) this.setState({ loading: false }) });*/

    axios
      .all([
        axiosInstance.get('api/branches'),
        axiosInstance.get('api/tos'),
      ])
      .then(axios.spread((branches, tos) => {
        if (this._isMounted) this.setState({
          loading: false,
          branches: branches.data,
          tos: tos.data,
        })
      }))
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
      // Bind tos
      var resource = this.state.resource;

      for (let i in this.state.tos) {
        if (this.state.tos[i].id === resource.tos_id) {
          resource['tos'] = this.state.tos[i];
        }
      }

      return (
        <BookingStepsView key={this.props.category.id} category={this.props.category} resource={resource} step={this.state.step} unsetResource={this.unsetResource.bind(this)} setSelectedKeys={this.props.setSelectedKeys} />
      )
    }

    // https://www.algolia.com/doc/api-reference/widgets/state-results/react/?client=component
    const StateResults = ({ searchResults }) => {
      const hasResults = searchResults && searchResults.nbHits !== 0;
      const nbHits = searchResults && searchResults.nbHits;

      if (!hasResults) {
        return <></>;
      }

      const header = nbHits + ' ' + this.props.t('results');

      return (
        <>
          {header}

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
            dataSource={searchResults?.hits ?? []}
            footer={''}
            renderItem={item => {
              var branch = null;
              for (let i in this.state.branches) {
                if (this.state.branches[i].id === item.branch_id) {
                  branch = this.state.branches[i];
                }
              }

              if (branch == null) {
                return <></>;
              }

              return (
                <List.Item
                  key={item.id}
                  actions={[<Button type="primary" icon={<PlusCircleOutlined />} onClick={this.onCreateBookingButtonClick.bind(this, item, 1)}>{this.props.t('createBooking')}</Button>]}
                  extra={item.image_url && <img width={200} alt="logo" src={item.image_url} />}
                >
                  <List.Item.Meta
                    title={
                      <a onClick={this.onCreateBookingButtonClick.bind(this, item, 0)}>
                        <Highlight hit={item} attribute="number" tagName="mark" />
                        {item['title_en'] && <MinusOutlined style={{marginLeft: 5, marginRight: 5}} />}
                        <Highlight hit={item} attribute={"title_" + getCurrentLanguage()} tagName="mark" />
                      </a>
                    }
                    description={(
                      <>
                        <div>
                          <Space>
                            <IoLocationSharp style={{marginBottom: -2}} />
                            <span>
                              {getTranslatedString(branch, 'title')} • {getDistanceString({ lat: this.state.lat, lng: this.state.lng}, {lat: branch.lat, lng: branch.lng })} {(this.props.t('km'))}
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
              )
            }
          }
          />
        </>
      );
    };

    const CustomStateResults = connectStateResults(StateResults);

    const RoomacSearchBox = connectSearchBox(({currentRefinement, refine}) => {
      return (
        <Input size="large" placeholder="Search" prefix={<SearchOutlined />} value={currentRefinement} onChange={(e) => {refine(e.target.value)}} />
      );
    });

    // https://ant.design/components/list/
    return (
      <>
        <h1>{title}</h1>

        { this.state.branches.length === 0 ? <Empty style={{marginTop: 15}} /> : 
          <>
            <InstantSearch
              indexName="resources"
              searchClient={searchClient}
              onSearchStateChange={(e) => console.log(e)}
            >
              <RoomacSearchBox />
              <Configure filters={"category_id=" + this.props.category.id} />
              <CustomStateResults />
            </InstantSearch>
          </>
        } 
      </>
    );
  }
}

export default withTranslation()(ResourceView)
