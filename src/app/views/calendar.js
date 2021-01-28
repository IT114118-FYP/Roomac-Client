import React from 'react';
import { Component } from "react";
import { withTranslation } from 'react-i18next';
import { axiosInstance } from '../api/axiosInstance';
import { Spin } from 'antd';
import { getTranslatedString } from '../i18n/func';

import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

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
    const start = arg.view.activeStart.toISOString().slice(0, 10)
    const end = arg.view.activeEnd.toISOString().slice(0, 10)
    this.setState({ events: [], loading: true })

    axiosInstance
      .get(['/api/users', this.props.user.id, `bookings?start=${start}&end=${end}`].join("/"))
      .then((bookings) => {
        let events = []
        for (let i in bookings.data) {
          let booking = bookings.data[i];
          events.push({
            title: getTranslatedString(booking.resource, 'title'),
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
            plugins={[timeGridPlugin]}
            initialView="timeGridWeek"
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
