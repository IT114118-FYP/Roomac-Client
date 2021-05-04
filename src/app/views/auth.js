import { Component } from "react";
import { withTranslation } from 'react-i18next';
import { Form, Input, Button, Row, Col, Card, Spin, notification, Select } from 'antd';
import { MailOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { axiosInstance, baseURLs, getBaseURL, setBaseURL } from '../api/axiosInstance';
import { languages, languageOptions } from '../i18n/func';
import { openNotification } from '../components/notification';
import RoomacIcon from "../assets/roomac.png";

const { Option } = Select;

class AuthView extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      latency: {},
    };
  }
  
  // If user is already logged in already but still on '/login'
  componentDidMount() {
    this._isMounted = true;

    var startTime = new Date();

    for (let i in baseURLs) {
      var img = new Image()
      img.onload = this.setLatency(i, startTime)
      img.src = baseURLs[i] + '/favicon.ico?ping=' + (Math.random() * 10);
    }

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

  setLatency(i, startTime) {
    var ping = (new Date()).getTime() - startTime.getTime()
    console.log(baseURLs[i], 'Latency:', ping)

    let latency = this.state.latency
    latency[i] = ping

    this.setState({ latency: latency })
  }

  handleLanguageChange(value) {
    this.props.i18n.changeLanguage(value);
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
        if (error.response.status === 402) {
          openNotification('warning', this.props.t('accountBanned'), this.props.t('accountBannedMessage') + error.response.data);
        } else {
          openNotification('error', this.props.t('loginFailed'), this.props.t('loginFailedMessage'));
        }
      });
  }

  render() {
    let baseURLOptions = [];
    for (let key in baseURLs) {
        baseURLOptions.push(<Option key={key} value={key}>{baseURLs[key]}</Option>);
    }

    return (
      <div style={{minHeight: '100vh', backgroundColor: '#001529'}}>
        <Select defaultValue={languages[this.props.i18n.language]} style={{position: "fixed", top: 15, right: 15, width: 100}} onChange={this.handleLanguageChange.bind(this)} disabled={this.state.loading}>
          {languageOptions}
        </Select>

        <Select defaultValue={getBaseURL()} style={{position: "fixed", left: 15, bottom: 15, width: 300}} onChange={(value) => setBaseURL(value)} disabled={this.state.loading} style={{display: 'none'}}>
          {baseURLOptions}
        </Select>

        <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
          <Col>   
            <div className="logo" style={{display: 'flex', justifyContent: 'center', marginBottom: 15}}>
              <div>
                <img src={RoomacIcon} width="40" height="40" style={{marginRight: 15, marginBottom: 15}} alt="favicon" />
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
                        message: this.props.t('emailOrIdBlank'),
                      },
                    ]}
                  >
                    <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder={this.props.t('emailOrId')} />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: this.props.t('passwordBlank'),
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder={this.props.t('password')}
                    />
                  </Form.Item>

                  <Form.Item style={{marginBottom: 0}}>
                    <Button type="primary" icon={<LoginOutlined />} htmlType="submit" className="login-form-button">
                      {(this.props.t('login'))}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Spin>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withTranslation()(AuthView)
