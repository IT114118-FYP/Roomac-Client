import 'antd/dist/antd.css';
import './App.css';

import { React, Component } from "react";
import { axiosInstance } from './app/api/axiosInstance';
import DefaultLayout from './app/pages/layout/default';
import AuthLayout from './app/pages/layout/auth';
import { Redirect } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Row, Col, Spin } from 'antd';

class App extends Component {
  state = {
    loading: true,
    isLogin: false,
  };
  
  componentDidMount() {
    if (localStorage.getItem("authToken") == null) {
			this.setState({ loading: false });
    } else {
      axiosInstance
        .get("/api/users/me")
        .then(() => {
          this.setState({ 
            isLogin: true,
            loading: false,
          });
        })
        .catch(() => {
          this.setState({ loading: false });
        });
    }
  }

  render() {
    return (
      this.state.loading ? 
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
      : 
      <Router>
        { this.state.isLogin ? <Redirect to="/" /> : <Redirect to="/login" /> }
        <Switch>
          <Route path="/login">
            <AuthLayout />
          </Route>
          <Route path="/">
            <DefaultLayout>
              <Switch>
                <Route path="/" exact>
                  <Home />
                </Route>
                <Route path="/category" exact>
                  <Category />
                </Route>
              </Switch>
            </DefaultLayout>

          </Route>
        </Switch>
      </Router>
    )  
  };
}

function Home() {
  return <h2>Home</h2>;
}

function Category() {
  return <h2>Category</h2>;
}

export default App;
