import { React, Component } from "react";
import { axiosInstance } from '../api/axiosInstance';
import { BrowserRouter as Prompt } from "react-router-dom";
import { Button, Steps, Spin, Space, Divider, Result, Checkbox } from 'antd';
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

class BookingStepsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: ["Select resource", "Select time", "Terms & Conditions", "Verify booking", "Booking confirmation"],
      current: 1,
      bookings: [],
      slotMinTime: '00:00:00',
      slotMaxTime: '24:00:00',
      loading: true,
      tosChecked: false,
      nextDisabled: false,
    };
  }

  componentDidMount() {
    // Load resource bookings
    axiosInstance
      .get(['/api/resources', this.props.resource.id, 'bookings'].join("/"))
      .then((bookings) => {
        this.setState({
          bookings: bookings.data,
          loading: false,
          slotDuration: '00:' + bookings.data.interval + ':00', // TODO: fix this shit
          slotMinTime: bookings.data.opening_time,
          slotMaxTime: bookings.data.closing_time,
        })
        console.log('-> Resource Bookings Loaded - ', this.state.bookings);
      })
      .catch((e) => console.log(e));
  }

  onBackClick() {
    if (this.state.current > 1) {
      this.setState({ current: this.state.current - 1, nextDisabled: false })
    } else {
     this.props.unsetResource()
    }
  }

  // TODO: Unfinish
  onNextClick() {
    if (this.state.current < this.state.steps.length - 1) {
      this.setState({ current: this.state.current + 1 })
    }
  }

  onTosCheckboxChange(e) {
    this.setState({ tosChecked: e.target.checked, nextDisabled: false });
  }

  onSelect(selectionInfo) {
    //console.log(selectionInfo)
  }

  selectAllow(selectInfo) {
    console.log(selectInfo)
    return true
  }

  render() {
    const steps = this.state.steps.map((step) => step = <Step title={step} />);
  
    // https://fullcalendar.io/docs/timegrid-view
    // https://fullcalendar.io/docs/slotDuration
    // https://fullcalendar.io/docs/selectable

    const stepBodys = () => {
      switch (this.state.current) {
        case 1:
          return (
            <Spin spinning={this.state.loading}>
              <FullCalendar
                plugins={[ interactionPlugin, timeGridPlugin ]}
                initialView="timeGridWeek"
                selectable={true}
                selectAllow={this.selectAllow}
                allDaySlot={false}
                slotMinTime={this.state.slotMinTime}
                slotMaxTime={this.state.slotMaxTime}
                select={this.onSelect}
                nowIndicator={true}
                contentHeight='auto'
                events={[
                  { title: 'event 1', start: '2020-12-20T09:00:00', end: '2020-12-20T10:00:00', color: 'black',},
                ]}
              />
            </Spin>
          )
        case 2:
          if (!this.state.tosChecked && !this.state.nextDisabled) {
            this.setState({ nextDisabled: true });
          }

          return (
            <>
              <h2>Terms & Conditions</h2>
              <ReactMarkdown>
                {getTranslatedString(this.props.resource.tos, 'tos')}
              </ReactMarkdown>

              <Checkbox checked={this.state.tosChecked} onChange={this.onTosCheckboxChange.bind(this)}>Checkbox</Checkbox>
            </>
          )
        case 3:
          return (
            <>
            Verify booking
            </>
          )
        case 4:
          return (
            <>
              <Result
                status="success"
                title="Successfully Booked "
                //subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                extra={[
                  <Button type="primary" key="console">
                    Go Console
                  </Button>,
                  <Button key="buy">Buy Again</Button>,
                ]}
              />
            </>
          )
        default: 
          return <></>
      }
    }

    return (
      <>
        <Prompt when={true} message='You have unsaved changes, are you sure you want to leave?' />

        <h1>{this.props.catagoryTitle} <RightOutlined style={{marginLeft: 5, marginRight: 5, marginBottom: 15}} /> {getItemTitle(this.props.resource)}</h1>
        <Steps current={this.state.current} size="small" style={{marginBottom: 15}}>{steps}</Steps>

        <Space style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 15}}>
          <Button size="large" onClick={this.onBackClick.bind(this)}>Back</Button>
          <Button size="large" onClick={this.onNextClick.bind(this)} type="primary" disabled={this.state.nextDisabled}>Next</Button>
        </Space>

        <Divider />

        {stepBodys()}
      </>
    )
  }
}

export default BookingStepsView
