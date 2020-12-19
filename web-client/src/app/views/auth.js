import { Component } from "react";
import { Form, Input, Button, Row, Col, Card, Spin, notification } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { axiosInstance } from '../api/axiosInstance';

const openNotificationWithIcon = () => {
  notification['error']({
    message: 'Login Failed',
    description: 'Your login details were incorrect. Please try again.',
    duration: 0,
  });
};

class AuthView extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  
  // If user is already logged in already but still on '/login'
  componentDidMount() {
    this._isMounted = true;
    if (localStorage.getItem("authToken") == null) {
			this.setState({ loading: false });
    } else {
      axiosInstance
        .get("/api/users/me")
        .then((response) => this.props.onLoginSuccess(response.data))
        .catch(() => this.setState({ loading: false }));
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onFinish = values => {
    this._isMounted = true;
    this.setState({ loading: true });

    axiosInstance
      .post("/api/login", {
        email: values.email,
        password: values.password,
        device_name: "client pc",
      })
      .then((token) => {
        // Store authToken
        localStorage.setItem("authToken", token.data);

        // Remove all notification. Example: Fail to login notification
        notification.destroy();

        // Get user data and return to parent
        axiosInstance
          .get("/api/users/me")
          .then((user) => this.props.onLoginSuccess(user.data))
          .catch(() => {});
      })
      .catch((error) => {
        console.log("-> Login error: " + error);

        // Set loading spin on login card
        this.setState({ loading: false });

        // Open fail to login notification
        openNotificationWithIcon();       
      });
  }

  render() {
    return (
      <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh', backgroundColor: '#001529'}}>
        <Col>
          <div className="logo" style={{display: 'flex', justifyContent: 'center', marginBottom: 15}}>
            <div>
              <img src="/favicon.ico" width="40" height="40" style={{marginRight: 15, marginBottom: 15}} alt="favicon" />
              <i style={{color: 'white', fontSize: 36}}>roomac</i>
            </div>
          </div>

          <Spin spinning={this.state.loading}>
            <Card>
              <Form
                name="login"
                className="login-form"
                initialValues={{
                  remember: true,
                }}
                onFinish={this.onFinish}
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your email/id',
                    },
                  ]}
                >
                  <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email/ID" />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password',
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Item>

                <Form.Item style={{marginBottom: 0}}>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Spin>
        </Col>
      </Row>
    );
  }
}

export default AuthView
