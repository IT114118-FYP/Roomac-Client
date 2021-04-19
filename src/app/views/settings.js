import React from 'react';
import { Component } from "react";
import { withTranslation } from 'react-i18next';
import { axiosInstance } from '../api/axiosInstance';
import { Input, Form, Modal, Select, Avatar as AntAvatar, Button, Descriptions, Divider } from 'antd';
import { languages, languageOptions } from '../i18n/func';
import { openNotification } from '../components/notification';
import Avatar from 'react-avatar-edit';

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
      
  while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, {type:mime});
}

class SettingsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      avatar: null,
      changeAvatarModalVisible: false,
    };
  }

  handleLanguageChange(value) {
    this.props.i18n.changeLanguage(value);
  }

  setChangeAvatarModalVisible(changeAvatarModalVisible) {
    this.setState({ avatar: null, changeAvatarModalVisible });
  }

  changeAvatarModalOnOk() {
    this.setState({ loading: true });

    // Upload avatar
    let formData = new FormData();
    formData.set('image', dataURLtoFile(this.state.avatar, "image.png"));

    axiosInstance
      .post('/api/users/me/avatar', formData)
      .then(() => {
        this.setState({ loading: false, changeAvatarModalVisible: false });
        this.props.updateUser();
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  onClose() {
    this.setState({avatar: null})
  }
  
  onCrop(avatar) {
    this.setState({avatar})
  }

  onFinish = (values) => {
    this.setState({ loading: true });

    // Update password
    axiosInstance
      .post('/api/users/me/password', values)
      .then(() => {
        this.setState({ loading: false });
        openNotification('success', this.props.t('changePasswordSuccess'), this.props.t('changePasswordSuccessMessage'), 15, 'topRight');
      })
      .catch((error) => {
        this.setState({ loading: false });

        if (error.response.status === 402) {
          openNotification('error', this.props.t('defaultError'), this.props.t('oldPasswordDismatchMessage'), 15, 'topRight');
        } else {
          openNotification('error', this.props.t('defaultError'), this.props.t('defaultErrorMessage'), 15, 'topRight');
        }
      });
  };

  render() {
    let props = this.props;

    return (
      <>
        <h1 style={{marginBottom: 10}}>{this.props.t('settings')}</h1>

        <Descriptions title={this.props.t('language')}>
          <Descriptions.Item>
            <Select defaultValue={languages[this.props.i18n.language]} style={{width: 150}} onChange={this.handleLanguageChange.bind(this)}>
              {languageOptions}
            </Select>
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Descriptions title={this.props.t('avatar')}>
          <Descriptions.Item>
            <AntAvatar shape="circle" src={this.props.user.image_url} size={128} />
          </Descriptions.Item>
        </Descriptions>
        <Button type="primary" size={50} onClick={() => this.setChangeAvatarModalVisible(true)}>
          {this.props.t('changeAvatar')}
        </Button>
        <Modal
          title={this.props.t('changeAvatar')}
          centered
          visible={this.state.changeAvatarModalVisible}
          okText={this.props.t('ok')}
          cancelText={this.props.t('cancel')}
          confirmLoading={this.state.loading}
          onOk={() => this.changeAvatarModalOnOk()}
          onCancel={() => this.setChangeAvatarModalVisible(false)}
        >
          <Avatar
            width={'auto'}
            height={300}
            onCrop={this.onCrop.bind(this)}
            onClose={this.onClose.bind(this)}
            label={this.props.t('chooseImage')}
            exportAsSquare={true}
          />
        </Modal>

        <Divider />

        <Descriptions title={this.props.t('password')} />
        <Form layout={'vertical'} wrapperCol={{span: 10}} onFinish={this.onFinish.bind(this)}>
          <Form.Item 
            name="old_password"
            label={this.props.t('currentPassword')}
            rules={[
              {
                required: true,
                message: this.props.t('passwordBlank'),
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="new_password"
            label={this.props.t('newPassword')}
            hasFeedback
            rules={[
              {
                required: true,
                message: this.props.t('passwordBlank'),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue('old_password') === value) {
                    return Promise.reject(props.t('oldNewPasswordSame'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label={this.props.t('confirmNewPassword')}
            hasFeedback
            rules={[
              {
                required: true,
                message: this.props.t('confirmPasswordBlank'),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(props.t('passwordNotMatch')));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {this.props.t('changePassword')}
            </Button>
          </Form.Item>
        </Form>
      </>
    )
  }
}

export default withTranslation()(SettingsView)
