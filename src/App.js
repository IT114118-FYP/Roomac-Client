import 'antd/dist/antd.css';
import './App.css';

import { React, Component } from "react";
import { axiosInstance } from './app/api/axiosInstance';
import { BrowserRouter, HashRouter, Redirect, Switch, Route } from "react-router-dom";
import { Row, Col, Spin } from 'antd';
import KommunicateChat from './chat';
import RoomacIcon from "./app/assets/roomac.png";
import isElectron from 'is-electron';

import AuthView from './app/views/auth';
import DefaultView from './app/views/default';
import ResourceView from './app/views/resource';
import HomeView from './app/views/home';
import CalendarView from './app/views/calendar';
import BookingsView from './app/views/bookings';
import SettingsView from './app/views/settings';

const Router = isElectron() ? HashRouter : BrowserRouter;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      categories: [],
      isLogin: false,
      loading: true,
      gotoDefaultView: false,
    };
  }

  componentDidMount() {
    if (localStorage.getItem('authToken') == null) {
			this.setState({ loading: false });
    } else {
      Promise.all([
        axiosInstance.get('/api/users/me'),
        axiosInstance.get('/api/categories'),
      ])
        .then((data) => {
          this.setState({
            user: data[0].data,
            categories: data[1].data,
            isLogin: true,
            loading: false,
          });
        })
        .catch(() => this.setState({ loading: false }));
    }
  }

  updateUser() {
    axiosInstance
      .get('/api/users/me')
      .then((user) => this.setState({user: user.data}))
      .catch((error) => {
        console.log(error.response);
      });
  }

  handleLogin(user) {
    axiosInstance
      .get('/api/categories')
      .then(categories => {
        this.setState({ user: user, isLogin: true, gotoDefaultView: true, categories: categories.data })
        console.log('-> Login')
      })
      .catch(() => {});
  }

  handleLogout() {
    this.setState({ isLogin: false });
    console.log('-> Logout')
  }

  render() {
    if (this.state.loading) {
      return (
        <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh', backgroundColor: '#001529' }}>
          <Col>
            <div className="logo" style={{ display: 'flex', justifyContent: 'center', marginBottom: 15 }}>
              <div>
                <img src={RoomacIcon} width="40" height="40" style={{ marginRight: 15, marginBottom: 15 }} alt="favicon" />
                <i style={{ color: 'white', fontSize: 36 }}>roomac</i>
              </div>
            </div>
            <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginBottom: 15 }}/>
          </Col>
        </Row>
      )
    }

    const categoryRoutes = this.state.categories.map((c) => c = 
      <Route exact key={c.id} path={'/categories/' + c.id}>
        <ResourceView category={c} />
      </Route>
    );

    return (
      <Router>
        { !this.state.isLogin ? <Redirect to="/login" /> : this.state.gotoDefaultView && <Redirect to='/' /> }
        <Switch>
          <Route path="/login">
            <AuthView onLoginSuccess={this.handleLogin.bind(this)}/>
          </Route>
          <Route path="/">
            <DefaultView user={this.state.user} categories={this.state.categories} onLogout={this.handleLogout.bind(this)}>
              <Switch>
                <Route exact path="/bookings">
                  <BookingsView user={this.state.user} />
                </Route>
                <Route exact path="/calendar">
                  <CalendarView user={this.state.user} />
                </Route>
                <Route exact path="/settings">
                  <SettingsView user={this.state.user} updateUser={this.updateUser.bind(this)}/>
                </Route>
                {categoryRoutes}
                <Route exact path="/">
                  <HomeView />
                </Route>
              </Switch>
            </DefaultView>
          </Route>
        </Switch>
        <KommunicateChat />
      </Router>
    )
  };
}

export default App;
