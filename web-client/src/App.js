import 'antd/dist/antd.css';
import './App.css';

import { React, Component } from "react";
import { axiosInstance } from './app/api/axiosInstance';
import { BrowserRouter as Router, Redirect, Switch, Route } from "react-router-dom";
import { Row, Col, Spin } from 'antd';

import AuthView from './app/views/auth';
import DefaultView from './app/views/default';
import ResourceView from './app/views/resource';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      isLogin: false,
      loading: true,
      gotoDefaultView: false,
    };
  }

  componentDidMount() {
    if (localStorage.getItem("authToken") == null) {
			this.setState({ loading: false });
    } else {
      axiosInstance
        .get("/api/users/me")
        .then((user) => this.setState({ user: user.data, isLogin: true, loading: false }))
        .catch(() => this.setState({ loading: false }));
    }
  }

  handleLogin(user) {
    this.setState({ user: user, isLogin: true, gotoDefaultView: true });
    console.log('-> Login')
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
                <img src="/favicon.ico" width="40" height="40" style={{ marginRight: 15, marginBottom: 15 }} alt="favicon" />
                <i style={{ color: 'white', fontSize: 36 }}>roomac</i>
              </div>
            </div>
            <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginBottom: 15 }}/>
          </Col>
        </Row>
      )
    }

    return (
      <Router>
        { !this.state.isLogin ? <Redirect to="/login" /> : this.state.gotoDefaultView && <Redirect to='/' /> }
        <Switch>
          <Route path="/login">
            <AuthView onLoginSuccess={this.handleLogin.bind(this)}/>
          </Route>
          <Route path="/">
            <DefaultView user={this.state.user} onLogout={this.handleLogout.bind(this)}>
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route exact path="/venues">
                  <ResourceView catagoryTitle="Classrooms" apiUrl="/api/venues" />
                </Route>
              </Switch>
            </DefaultView>
          </Route>
        </Switch>
      </Router>
    )
  };
}

function Home() {
  return <h2>Home</h2>;
}

export default App;
