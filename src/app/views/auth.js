import { Component } from "react";
import { withTranslation } from 'react-i18next';
import { Form, Input, Button, Row, Col, Card, Spin, notification, Select } from 'antd';
import { MailOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { axiosInstance } from '../api/axiosInstance';
import { languages, languageOptions } from '../i18n/func';
import { openNotification } from '../components/notification';
import RoomacIcon from "../assets/roomac.png";

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
    return (
      <div style={{minHeight: '100vh', backgroundColor: '#001529'}}>
        <Select defaultValue={languages[this.props.i18n.language]} style={{position: "fixed", top: 15, right: 15, width: 100}} onChange={this.handleLanguageChange.bind(this)}>
          {languageOptions}
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
