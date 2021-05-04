import React from 'react';
import { Component } from "react";
import { withTranslation } from 'react-i18next';
import { axiosInstance } from '../api/axiosInstance';
import { Spin, Table, Space, Modal, Button } from 'antd';
import { openNotification } from '../components/notification';
import moment from 'moment';
import QRCode from 'qrcode.react';

import { getTranslatedString } from '../i18n/func';

import BookingStepsView from './editBooking';

class BookingsView extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      bookings: [],
      modalVisible: false,
      modal2Visible: false,
      code: null,
      codeLoading: false,
      modal2confirmLoading: false,
      selectedDelete: null,
      selectedEdit: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;

    this.loadBookings();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadBookings() {
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
      .catch((e) => {
        console.log(e)
        openNotification('error', this.props.t('defaultError'), this.props.t('defaultErrorMessage'), 15, 'topRight');
      });
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
      .catch((e) => {
        if (this._isMounted) {
          this.setState({
            codeLoading: false,
          })
        }
        console.log(e)
        openNotification('error', this.props.t('defaultError'), this.props.t('defaultErrorMessage'), 15, 'topRight');
      });
  }

  displayDeleteConfirmModel(resourceId) {
    if (this._isMounted) this.setState({
      selectedDelete: resourceId,
      modal2Visible: true,
    });
  }

  deleteBooking() {
    if (this._isMounted) this.setState({
      modal2confirmLoading: true,
    });

    axiosInstance
      .delete(`/api/resourcebookings/${this.state.selectedDelete}`)
      .then((response) => {
        if (this._isMounted) this.setState({
          modal2confirmLoading: false,
          modal2Visible: false,
        });
        this.loadBookings();
      })
      .catch((e) => {
        if (this._isMounted) this.setState({
          modal2confirmLoading: false,
          modal2Visible: false,
        });
        
        console.log(e)
        openNotification('error', this.props.t('defaultError'), this.props.t('defaultErrorMessage'), 15, 'topRight');
      });
  }

  cancelModal() {
    if (this._isMounted) {
      this.setState({
        code: null,
        modalVisible: false,
        modal2Visible: false,
      })
    }
  }

  unsetSelectedEdit() {
    this.setState({ selectedEdit: null, loading: true })

    this.loadBookings()
  }

  render() {
    let editAndDeletableIds = []
    for (let i in this.state.bookings) {
      if (new Date(this.state.bookings[i].start_time).getTime() > new Date()) {
        editAndDeletableIds.push(this.state.bookings[i].id);
      }
    }

    let displayableIds = []
    for (let i in this.state.bookings) {
      if (new Date(this.state.bookings[i].end_time).getTime() >= new Date()) {
        displayableIds.push(this.state.bookings[i].id);
      }
    }

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
        dataIndex: 'id',
        key: 'id',
        render: (id) => (
          <Space size="middle">
            <Button type="primary" onClick={() => this.fetchCheckInQRCode(id)} loading={this.state.codeLoading} disabled={!displayableIds.includes(id)}>
              {this.props.t('displayqrcode')}
            </Button>
          </Space>
        ),
      },
      {
        title: this.props.t('manage'),
        dataIndex: 'id',
        key: 'id',
        render: (id) => (
          <Space size="middle">
            <Button type="default" onClick={() => { if (this._isMounted) this.setState({ selectedEdit: id }) }} disabled={!editAndDeletableIds.includes(id)}>
              {this.props.t('edit')}
            </Button>
            <Button type="danger" onClick={() => this.displayDeleteConfirmModel(id)} disabled={!editAndDeletableIds.includes(id)}>
              {this.props.t('delete')}
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

    if (this.state.selectedEdit) {
      var booking;

      for (const i in this.state.bookings) {
        booking = this.state.bookings[i];
        if (booking.id === this.state.selectedEdit) {
          break;
        }
      }

      return (
        <BookingStepsView booking={booking} unsetSelectedEdit={this.unsetSelectedEdit.bind(this)} />
      )
    }

    return (
      <>
        <h1>{this.props.t('myBookings')} {!this.state.loading && <>({this.state.bookings.length} {this.props.t('results')})</>}</h1>
        <Spin spinning={this.state.loading}>
          <Table columns={columns} dataSource={parseBookings()} scroll={{ x: 800 }} />
        </Spin>

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
            />
          </div>
        </Modal>

        <Modal
            title={this.props.t('bookingDelete')}
            centered
            visible={this.state.modal2Visible}
            onCancel={() => this.cancelModal()}
            confirmLoading={this.state.modal2confirmLoading}
            onOk={() => this.deleteBooking()}
          >
          {this.props.t('bookingDeleteMessage')}
        </Modal>
      </>
    );
  }
}

export default withTranslation()(BookingsView)
