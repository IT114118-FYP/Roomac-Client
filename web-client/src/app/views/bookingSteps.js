import { React, Component } from "react";
import { withTranslation } from 'react-i18next';
import { axiosInstance } from '../api/axiosInstance';
import { BrowserRouter as Prompt } from "react-router-dom";
import { Alert, Button, Steps, Spin, Space, Divider, Result, Checkbox } from 'antd';
import { MinusOutlined, RightOutlined } from '@ant-design/icons';
import { getTranslatedString } from '../i18n/func'
import ReactMarkdown from 'react-markdown'

import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

const { Step } = Steps;

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

const getEvents = (allow_times) => {
  let events = []
  for (let i in allow_times) {
    let allow_time = allow_times[i];
    for (let date in allow_time) {
      let times = allow_time[date];
      for (let i in times) {
        if (!times[i].available) {
          events.push({
            title: 'Unavaliable',
            start: date + 'T' + times[i].start_time,
            end: date + 'T' + times[i].end_time,
            color: 'red',
          })
        }
      }
    }
  }
  return events;
}

const getLocalISOString = (time) => {
  if (time === null) { return '' }
  var tzoffset = (new Date()).getTimezoneOffset() * 60000;
  return (new Date(time - tzoffset)).toISOString().slice(0, -8).replace('T', ' ');
}

const isSelectValid = (events, startTime, endTime) => {
  for (let i in events) {
    if ((new Date(events[i].start).getTime() >= startTime.getTime() && new Date(events[i].end).getTime() <= endTime.getTime())
     || (new Date(events[i].start).getTime() <= startTime.getTime() && new Date(events[i].end).getTime() >= endTime.getTime())) {
      return false;
    }
  }
  return true;
}

class BookingStepsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: ["selectResource", "selectTime", "tos", "verifyBooking", "bookingConfirmation"],
      current: 1,
      bookings: [],
      events: [],
      slotMinTime: '00:00:00',
      slotMaxTime: '24:00:00',
      loading: true,
      nextText: 'next',
      tosChecked: false,
      nextDisabled: true,
      selectedStart: null,
      selectedEnd: null,
      bookingReference: '',
    };
  }

  onBackClick() {
    if (this.state.current > 1) {
      const back = this.state.current - 1
      this.setState({
        current: back,
        nextDisabled: this.shouldNextDisable(back),
        nextText: 'next',
      })
    } else {
     this.props.unsetResource()
    }
  }

  onNextClick() {
    if (this.state.steps[this.state.current] === "verifyBooking") {
      this.setState({ loading: true })

      // Booking Confirmation!
      axiosInstance
      .post(['/api/resources', this.props.resource.id, 'bookings'].join("/"), {
        date: getLocalISOString(this.state.selectedStart).slice(0, -6),
        start: getLocalISOString(this.state.selectedStart).substring(11) + ':00',
        end: getLocalISOString(this.state.selectedEnd).substring(11) + ':00',
      })
      .then((bookingReference) => {
        this.setState({
          current: this.state.current + 1,
          bookingReference: bookingReference.data,
          loading: false
        })
      })
      .catch((e) => {
        console.log(e)
      });

      return
    }

    if (this.state.current < this.state.steps.length - 1) {
      const next = this.state.current + 1
      const nextText = this.state.steps[next] === "verifyBooking" ? 'submit' : 'next'
      this.setState({
        current: next,
        nextDisabled: this.shouldNextDisable(next),
        nextText: nextText,
        tosChecked: false
      })
    }
  }

  shouldNextDisable(step) {
    switch (this.state.steps[step]) {
      case "selectTime":
        return this.state.selectedStart === null && this.state.selectedEnd === null
      case "tos":
        return true
      default:
        return false
    }
  }

  onDatesSetChange(arg) {
    const start = arg.view.activeStart.toISOString().slice(0, 10)
    const end = arg.view.activeEnd.toISOString().slice(0, 10)
    this.setState({ loading: true })

    axiosInstance
      .get(['/api/resources', this.props.resource.id, `bookings?start=${start}&end=${end}`].join("/"))
      .then((bookings) => {
        let events = getEvents(bookings.data.allow_times)

        if (this.state.selectedStart && this.state.selectedEnd) {
          events.push({
            title: 'Your Booking',
            start: this.state.selectedStart,
            end: this.state.selectedEnd,
            color: 'blue',
          })
        }

        this.setState({
          bookings: bookings.data,
          events: events,
          loading: false,
          slotDuration: '00:' + bookings.data.interval + ':00', // TODO: fix this shit
          slotMinTime: bookings.data.opening_time,
          slotMaxTime: bookings.data.closing_time,
        })
      })
      .catch((e) => console.log(e));
  }

  onTosCheckboxChange(e) {
    this.setState({ tosChecked: e.target.checked, nextDisabled: !e.target.checked })
  }

  // Add Your Booking Event
  onSelect(selectInfo) {
    let events = getEvents(this.state.bookings.allow_times)
    events.push({
      title: 'Your Booking',
      start: selectInfo.start,
      end: selectInfo.end,
      color: 'blue',
    })

    this.setState({
      selectedStart: selectInfo.start,
      selectedEnd: selectInfo.end,
      events: events,
      nextDisabled: false,
    })
  }

  selectAllow(selectInfo) {
    if (selectInfo.start.getDate() !== selectInfo.end.getDate()) { return false }
    return isSelectValid(getEvents(this.state.bookings.allow_times), selectInfo.start, selectInfo.end)
  }

  render() {
    const steps = this.state.steps.map((step, i) => step = <Step key={i} title={this.props.t(step)} />);
    const alertMessage = (
      <>
        <span style={{marginRight: 5}}>Date and time:</span>
        {getLocalISOString(this.state.selectedStart)}
        <MinusOutlined style={{marginLeft: 5, marginRight: 5, paddingTop: 5}} />
        {getLocalISOString(this.state.selectedEnd)}
      </>
    )
  
    // https://fullcalendar.io/docs/timegrid-view
    // https://fullcalendar.io/docs/slotDuration
    // https://fullcalendar.io/docs/selectable

    const stepBodys = () => {
      switch (this.state.steps[this.state.current]) {
        case "selectTime":
          return (
            <>
              <Alert message={alertMessage} type="info" style={{marginBottom: 15}} showIcon />
              <Spin spinning={this.state.loading}>
                <FullCalendar
                  locale={this.props.i18n.language}
                  plugins={[interactionPlugin, timeGridPlugin]}
                  initialView="timeGridWeek"
                  selectable={true}
                  select={this.onSelect.bind(this)}
                  selectAllow={this.selectAllow.bind(this)}
                  allDaySlot={false}
                  slotMinTime={this.state.slotMinTime}
                  slotMaxTime={this.state.slotMaxTime}
                  nowIndicator={true}
                  contentHeight='auto'
                  events={this.state.events}    
                  datesSet={this.onDatesSetChange.bind(this)}
                />
              </Spin>
            </>
          )
        case "tos":
          return (
            <>
              <h2>{this.props.t('tos')}</h2>
              <ReactMarkdown>
                {getTranslatedString(this.props.resource.tos, 'tos')}
              </ReactMarkdown>

              <Checkbox checked={this.state.tosChecked} onChange={this.onTosCheckboxChange.bind(this)}>{this.props.t('agreeTos')}</Checkbox>
            </>
          )
        case "verifyBooking":
          return (
            <>
              <Alert message={alertMessage} type="info" style={{marginBottom: 15}} showIcon />
              <FullCalendar
                headerToolbar={{start: 'title', center: '', end: ''}}
                locale={this.props.i18n.language}
                plugins={[timeGridPlugin]}
                initialView="timeGridWeek"
                allDaySlot={false}
                slotMinTime={this.state.slotMinTime}
                slotMaxTime={this.state.slotMaxTime}
                nowIndicator={true}
                contentHeight='auto'
                events={this.state.events}    
                datesSet={this.onDatesSetChange.bind(this)}
                initialDate={this.state.selectedStart}
              />
            </>
          )
        case "bookingConfirmation":
          return (
            <>
              <Result
                status="success"
                title={this.props.t('bookingSuccess')}
                subTitle={<>{getItemTitle(this.props.resource)} <br /> {this.props.t('bookingReference')}: {this.state.bookingReference}</>}
                extra={[
                  <Button type="primary" key="console">
                    Go to My Calender
                  </Button>,
                  <Button key="returnTo" onClick={this.props.unsetResource}>{this.props.t('returnTo')} {getTranslatedString(this.props.category, 'title')}</Button>,
                ]}
              />
            </>
          )
        default: 
          return <></>
      }
    }

    const backNextButtons = () => {
      if (this.state.steps[this.state.current] !== "bookingConfirmation") {
        return (
          <Space style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 15}}>
            <Button size="large" onClick={this.onBackClick.bind(this)} disabled={this.state.loading}>{this.props.t('back')}</Button>
            <Button size="large" onClick={this.onNextClick.bind(this)} type="primary" disabled={this.state.nextDisabled} loading={this.state.loading}>{this.props.t(this.state.nextText)}</Button>
          </Space>
        )
      }
      return null
    }

    return (
      <>
        <Prompt when={true} message='You have unsaved changes, are you sure you want to leave?' />

        <h1>{getTranslatedString(this.props.category, 'title')} <RightOutlined style={{marginLeft: 5, marginRight: 5, marginBottom: 15}} /> {getItemTitle(this.props.resource)}</h1>
        <Steps current={this.state.current} size="small" style={{marginBottom: 15}}>{steps}</Steps>
        {backNextButtons()}
        <Divider />
        {stepBodys()}
      </>
    )
  }
}

export default withTranslation()(BookingStepsView)
