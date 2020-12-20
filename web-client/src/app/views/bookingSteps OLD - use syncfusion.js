import { React, Component } from "react";
import { axiosInstance } from '../api/axiosInstance';
import { BrowserRouter as Router, Redirect, Switch, Route, Prompt, withRouter } from "react-router-dom";
import { Row, Col, Spin } from 'antd';
import { Steps, Popover } from 'antd';
import {
	ScheduleComponent,
	Day,
	Week,
	WorkWeek,
	Month,
	Agenda,
	MonthAgenda,
	TimelineViews,
	Inject,
	ViewsDirective,
	ViewDirective,
	TimelineMonth,
	setTime,
} from "@syncfusion/ej2-react-schedule";

const { Step } = Steps;

function changeTimezone(date, ianatz) {
  var invdate = new Date(date.toLocaleString('en-US', { timeZone: ianatz }));
  return new Date(date.getTime() - invdate.getTime());
}

class BookingStepsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: ["Select resource", "Select time", "Terms & Conditions", "Verify booking", "Booking confirmation"],
      current: 1,
      resource: [],
      bookings: [],
      startHour: '',
      endHour: '',
      loading: true,
    };
  }

  componentDidMount() {
    // Load resource
    axiosInstance
      .get([this.props.apiUrl, this.props.selectedId].join("/"))
      .then((resource) => {
        this.setState({ resource: resource.data })
        console.log('-> Resource Loaded - ', this.state.resource);
      })
      .catch(() => this.setState({ success: false }));

    // Load resource bookings
    axiosInstance
      .get([this.props.apiUrl, this.props.selectedId, 'bookings'].join("/"))
      .then((bookings) => {
        this.setState({
          bookings: bookings.data.bookings.allow_times.map(booking => booking = {
            Id: booking.id,
            Subject: "Event",
            StartTime: new Date(booking.start_time),
            EndTime: new Date(booking.end_time),
          }),
          loading: false,
          startHour: bookings.data.opening_time.slice(0, -3),
          endHour: bookings.data.closing_time.slice(0, -3),
        })

        console.log('-> Resource Bookings Loaded - ', this.state.bookings);
      })
      .catch((e) => console.log(e));
  }

  render() {
    const steps = this.state.steps.map((step) => step = <Step title={step} />);

    return (
      <>
        <Prompt when={true} message='You have unsaved changes, are you sure you want to leave?' />
        <Steps current={this.state.current} size="small" style={{marginBottom: 15}}>{steps}</Steps>

        <Spin spinning={this.state.loading}>
          <ScheduleComponent
            readonly
            height="600px"
            eventSettings={{
              dataSource: this.state.bookings,
              enableIndicator: true,
              enableTooltip: true,
              // enableMaxHeight: true,
              // ignoreWhitespace: true,
            }}
            timeScale={{ enable: true, interval: this.state.bookings.interval }}
            timezone={this.state.bookings.timezone}
          >
            <ViewsDirective>
              <ViewDirective option="Week" startHour={this.state.startHour} endHour={this.state.endHour} isSelected={true} />
            </ViewsDirective>
            <Inject services={[Week]} />
          </ScheduleComponent>
        </Spin>
      </>
    )
  }
}

export default withRouter(BookingStepsView)
