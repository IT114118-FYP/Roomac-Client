import React from 'react';
import { Component } from "react";
import { withTranslation } from 'react-i18next';
import { axiosInstance } from '../api/axiosInstance';
import { Spin } from 'antd';
import { getTranslatedString } from '../i18n/func';
import moment from 'moment';

import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';

class CalendarView extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      bookings: [],
      events: [],
      slotDuration: '00:30:00',
      slotMinTime: '00:00:00',
      slotMaxTime: '24:00:00',
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onDatesSetChange(arg) {
    const start = moment(arg.view.activeStart).format("YYYY-MM-DD");
    const end = moment(arg.view.activeEnd).format("YYYY-MM-DD");

    this.setState({ events: [], loading: true })

    axiosInstance
      .get(['/api/users', this.props.user.id, `bookings?start=${start}&end=${end}`].join("/"))
      .then((bookings) => {
        let events = []
        for (let i in bookings.data) {
          let booking = bookings.data[i];
          events.push({
            title: booking.resource.number + ' • ' + getTranslatedString(booking.resource, 'title'),
            start: booking.start_time,
            end: booking.end_time,
            color: 'blue',
          })
        }
        
        if (this._isMounted) {
          this.setState({
            bookings: bookings.data,
            events: events,
            loading: false,
          })
        }
      })
      .catch((e) => console.log(e));
  }

  render() {
    return (
      <>
        <h1>{this.props.t('myCalendar')} {!this.state.loading && <>({this.state.bookings.length} {this.props.t('results')})</>}</h1>
        <Spin spinning={this.state.loading}>
          <FullCalendar
            locale={this.props.i18n.language}
            plugins={[timeGridPlugin, dayGridPlugin]}
            initialView="dayGridMonth"
            allDaySlot={false}
            slotDuration={this.state.slotDuration}
            slotMinTime={this.state.slotMinTime}
            slotMaxTime={this.state.slotMaxTime}
            nowIndicator={true}
            contentHeight='auto'
            events={this.state.events}    
            datesSet={this.onDatesSetChange.bind(this)}
          />
        </Spin>
      </>
    );
  }
}

export default withTranslation()(CalendarView)
