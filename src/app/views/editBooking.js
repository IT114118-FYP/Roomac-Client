import { React, Component } from "react";
import { withTranslation } from 'react-i18next';
import { axiosInstance } from '../api/axiosInstance';
import { Alert, Button, Steps, Spin, Space, Divider, Result, Checkbox } from 'antd';
import { MinusOutlined, RightOutlined } from '@ant-design/icons';
import { getTranslatedString } from '../i18n/func';
import ReactMarkdown from 'react-markdown';

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
      for (let j in times) {
        if (!times[j].available) {
        events.push({
            title: 'Unavaliable',
            start: date + 'T' + times[j].start_time,
            end: date + 'T' + times[j].end_time,
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
  console.log(time)
  var tzoffset = (new Date()).getTimezoneOffset() * 60000;
  return (new Date(time - tzoffset)).toISOString().slice(0, -8).replace('T', ' ');
}

class EditBookingView extends Component {
    _isMounted = false;
  
    constructor(props) {
      super(props);
      this.state = {
        steps: ["selectResource", "selectTime", "tos", "verifyBooking", "bookingConfirmation"],
        current: 1,
        bookings: [],
        events: [],
        slotDuration: '00:30:00',
        slotMinTime: '00:00:00',
        slotMaxTime: '24:00:00',
        loading: true,
        nextText: 'next',
        tosChecked: false,
        nextDisabled: true,
        selectedStart: new Date(props.booking.start_time),
        selectedEnd: new Date(props.booking.end_time),
        editSuccess: false,
        tos: [],
      };
    }
  
    componentDidMount() {
      this._isMounted = true;

      // Load tos
      axiosInstance
        .get('/api/tos')
        .then((response) => {
          if (this._isMounted) {
            this.setState({
              tos: response.data,
              loading: false,
            })
          }
        })
        .catch((e) => console.log(e));
    }
  
    componentWillUnmount() {
      this._isMounted = false;
    }
  
    backToSelectTime() {
      if (this._isMounted) this.setState({
        current: 1,
      })
    }
  
    onBackClick() {
      if (this.state.current > 1) {
        const back = this.state.current - 1
        if (this._isMounted) this.setState({
          current: back,
          nextDisabled: this.shouldNextDisable(back),
          nextText: 'next',
        })
      } else {
        this.props.unsetSelectedEdit()
      }
    }
  
    onNextClick() {
      if (this.state.steps[this.state.current] === "verifyBooking") {
        if (this._isMounted) this.setState({ loading: true })
  
        // Update Booking Confirmation...
        axiosInstance
          .put(['/api/resourcebookings', this.props.booking.id].join("/"), {
            date: getLocalISOString(this.state.selectedStart).slice(0, -6),
            start: getLocalISOString(this.state.selectedStart).substring(11) + ':00',
            end: getLocalISOString(this.state.selectedEnd).substring(11) + ':00',
          })
          // Success...
          .then((response) => {
            if (this._isMounted) this.setState({
              current: this.state.current + 1,
              editSuccess: true,
              loading: false
            })
          })
          // Error...
          .catch((e) => {
            if (this._isMounted) this.setState({
              current: this.state.current + 1,
              selectedStart: new Date(this.props.booking.start_time),
              selectedEnd: new Date(this.props.booking.end_time),
              editSuccess: false,
              loading: false
            })
          })
  
        return
      }
  
      if (this.state.current < this.state.steps.length - 1) {
        const next = this.state.current + 1
        const nextText = this.state.steps[next] === "verifyBooking" ? 'submit' : 'next'
  
        if (this._isMounted) this.setState({
          current: next,
          nextDisabled: this.shouldNextDisable(next),
          nextText: nextText,
          tosChecked: false
        })
      }
    }
  
    shouldNextDisable(step) {
      switch (this.state.steps[step]) {
        case "selectResource":
          return false
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
      if (this._isMounted) this.setState({ events: [], loading: true })
  
      axiosInstance
        .get(['/api/resources', this.props.booking.resource.id, `bookings?start=${start}&end=${end}&except=${this.props.booking.id}`].join("/"))
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
  
          if (this._isMounted) this.setState({
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
      if (this._isMounted) this.setState({ tosChecked: e.target.checked, nextDisabled: !e.target.checked })
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

      if (this._isMounted) this.setState({
        selectedStart: selectInfo.start,
        selectedEnd: selectInfo.end,
        events: events,
        nextDisabled: (
          selectInfo.start.getTime() === new Date(this.props.booking.start_time).getTime() 
          && selectInfo.end.getTime() === new Date(this.props.booking.end_time).getTime()
        ),
      })
    }
  
    selectAllow(selectInfo) {
      if (selectInfo.start.getDate() !== selectInfo.end.getDate() && selectInfo.start.getHours() < selectInfo.end.getHours()) { return false }
      return this.isSelectValid(getEvents(this.state.bookings.allow_times), selectInfo.start, selectInfo.end)
    }

    isSelectValid = (events, startTime, endTime) => {
      if ((startTime.getTime() + this.state.bookings.interval * 60000) <= new Date().getTime()) {
        return false;
      }
    
      for (let i in events) {
        if ((new Date(events[i].start).getTime() >= startTime.getTime() && new Date(events[i].end).getTime() <= endTime.getTime())
         || (new Date(events[i].start).getTime() <= startTime.getTime() && new Date(events[i].end).getTime() >= endTime.getTime())) {
          return false;
        }
      }
      return true;
    }
  
    render() {
      const steps = this.state.steps.map((step, i) => step = <Step key={i} title={this.props.t(step)} />);
      const alertMessage = (
        <>
          <span style={{marginRight: 5}}>{this.props.t('selectedDateTime')}</span>
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
          case "selectResource":
            return <></>
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
                    initialDate={this.state.selectedStart}
                  />
                </Spin>
              </>
            )
          case "tos":
            var tos;

            for (const i in this.state.tos) {
              tos = this.state.tos[i];
              if (tos.id === this.props.booking.resource.tos_id) {
                break;
              }
            }

            return (
              <>
                <h2>{this.props.t('tos')}</h2>
                <ReactMarkdown renderers={{link: props => <a href={props.href} target="_blank" rel="noreferrer">{props.children}</a>}}>
                  {getTranslatedString(tos, 'tos')}
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
            if (this.state.editSuccess) {
              // Success...
              return (
                <Result
                  status="success"
                  title={this.props.t('bookingSuccess')}
                  subTitle={<>{getItemTitle(this.props.booking.resource)} <br /> {this.props.t('bookingReference')}: {this.props.booking.number}</>}
                  extra={[
                    <Button type="primary" key="console" onClick={() => this.props.unsetSelectedEdit()}>{this.props.t('back')}</Button>,
                  ]}
                />
              )
            } else {
              // Error...
              return (
                <Result
                  status="error"
                  title={this.props.t('bookingFailed')}
                  subTitle={this.props.t('bookingFailedMessage')}
                  extra={[
                    <Button type="primary" key="backToSelectTime" onClick={this.backToSelectTime.bind(this)}>{(this.props.t('reselectTime'))}</Button>,
                  ]}
                />
              )
            }
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
  
      // <Prompt when={true} message='You have unsaved changes, are you sure you want to leave?' />
  
      return (
        <>
          <h1>{getItemTitle(this.props.booking.resource)} <RightOutlined style={{marginLeft: 5, marginRight: 5, marginBottom: 15}} /> {this.props.booking.number}</h1>
          <Steps current={this.state.current} size="small" style={{marginBottom: 15}}>{steps}</Steps>
          {backNextButtons()}
          <Divider />
          {stepBodys()}
        </>
      )
    }
  }
  
  export default withTranslation()(EditBookingView)