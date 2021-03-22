import React from 'react';
import { Component } from "react";
import { withTranslation } from 'react-i18next';
import { axiosInstance } from '../api/axiosInstance';
import { Spin, Table, Space, Modal, Button } from 'antd';
import moment from 'moment';
import QRCode from 'qrcode.react';

import { getTranslatedString } from '../i18n/func';

class BookingsView extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      bookings: [],
      modalVisible: false,
      code: null,
      codeLoading: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;

    axiosInstance
      .get('/api/users/me/bookings')
      .then((bookings) => {
        if (this._isMounted) {
          this.setState({
            bookings: bookings.data,
            loading: false,
          })
        }
      })
      .catch((e) => console.log(e));
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchCheckInQRCode(resourceId) {
    if (this._isMounted) this.setState({ codeLoading: true });

    axiosInstance
      .get(`/api/resourcebookings/${resourceId}/code`)
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            code: response.data.code,
            codeLoading: false,
            modalVisible: true,
          })
        }
      })
      .catch((e) => console.log(e));
  }

  cancelModal() {
    if (this._isMounted) {
      this.setState({
        code: null,
        modalVisible: false,
      })
    }
  }

  render() {
    const columns = [
      {
        title: this.props.t('referenceNumber'),
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: this.props.t('resource'),
        dataIndex: 'resource_name',
        key: 'resource_name',
      },
      {
        title: this.props.t('startTime'),
        dataIndex: 'start_time',
        key: 'start_time',
        render: (start_time) => (
          moment(start_time).format('MM/DD/YYYY HH:mm:ss')
        ),
      },
      {
        title: this.props.t('endTime'),
        dataIndex: 'end_time',
        key: 'end_time',
        render: (end_time) => (
          moment(end_time).format('MM/DD/YYYY HH:mm:ss')
        ),
      },
      {
        title: this.props.t('qrcode'),
        dataIndex: 'resource_id',
        key: 'resource_id',
        render: (resource_id) => (
          <Space size="middle">
            <Button type="primary" onClick={() => this.fetchCheckInQRCode(resource_id)} loading={this.state.codeLoading}>
              {this.props.t('displayqrcode')}
            </Button>
          </Space>
        ),
      },
    ];

    const parseBookings = () => {
      let bookings = [];

      for (const i in this.state.bookings) {
        let title = getTranslatedString(this.state.bookings[i].resource, 'title');
        let resourceName = (title && title !== '') ? title + ' • ' : '';
        resourceName += this.state.bookings[i].resource.number;

        bookings.push({
          key: i,
          id: this.state.bookings[i].id,
          resource_id: this.state.bookings[i].resource.id,
          number: this.state.bookings[i].number,
          resource_name: resourceName,
          start_time: this.state.bookings[i].start_time,
          end_time: this.state.bookings[i].end_time,
        })
      }

      return bookings
    }

    return (
      <>
        <h1>{this.props.t('myBookings')} {!this.state.loading && <>({this.state.bookings.length} {this.props.t('results')})</>}</h1>
        <Spin spinning={this.state.loading}>
          <Table columns={columns} dataSource={parseBookings()} />
        </Spin>

        {this.state.code && (
          <Modal
              title={this.props.t('qrcode')}
              centered
              visible={this.state.modalVisible}
              footer={null}
              onCancel={() => this.cancelModal()}
            >

            <div className="displayQRCode">
              <QRCode 
                renderAs="svg" 
                value={this.state.code} 
                imageSettings={{
                  src: 'http://localhost:3000/roomac.png',
                  height: 12,
                  width: 12
                }}
              />
            </div>
          </Modal>
        )}
      </>
    );
  }
}

export default withTranslation()(BookingsView)
