import { React } from "react";
import { Component } from "react";
import { withTranslation } from 'react-i18next';
import { Layout, Menu, Modal, Avatar } from 'antd';

import { HomeOutlined, CaretRightOutlined, LogoutOutlined, SettingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link, withRouter } from "react-router-dom";
import { axiosInstance } from '../api/axiosInstance';
import { AiOutlineCalendar } from 'react-icons/ai';
import { RiFileListLine } from 'react-icons/ri';

import RoomacIcon from "../assets/roomac.png";
import isElectron from 'is-electron';

const { Header, Content, Footer, Sider } = Layout;
const { confirm } = Modal;

class DefaultView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [isElectron() ? window.location.hash.substring(1) : window.location.pathname],
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      if (isElectron()) {
        if (window.location.hash.substring(1) !== this.state.selectedKeys[0]) {
          this.setState({ selectedKeys: [window.location.hash.substring(1)] })
        }
      } else {
        if (window.location.pathname !== this.state.selectedKeys[0]) {
          this.setState({ selectedKeys: [window.location.pathname] })
        }
      }
    }
  }

  showPromiseConfirm = () => {
    const logout = () => { 
      localStorage.removeItem('authToken');
      this.props.onLogout();
    }
    confirm({
      title: this.props.t('logoutConfirmTitle'),
      okText: this.props.t('ok'),
      cancelText: this.props.t('cancel'),
      icon: <ExclamationCircleOutlined />,
      //content: 'Some descriptions',
      onOk() {
        axiosInstance.post("/api/logout").then(logout).catch(logout)
      },
      onCancel() {},
    });
  }

  onSelect({ item, key, keyPath, selectedKeys, domEvent }) {
    if (selectedKeys[0] !== "/logout") {
      this.setState({ selectedKeys: selectedKeys })
    }
  }

  setSelectedKeys(selectedKeys) {
    this.setState({ selectedKeys: selectedKeys })
  }

  render() {
    const categories = this.props.categories.map((c) => {
      let title = c['title_' + this.props.i18n.language];
      title = title && title.length > 0 ? title : c.title_en;

      return (
        <Menu.Item key={'/categories-' + c.id} icon={<CaretRightOutlined />}>
          <Link to={'/categories-' + c.id}>{title}</Link>
        </Menu.Item>
      )
    });

    return (
      <Layout style={{ minHeight:"100vh" }}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={broken => {
            //console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            //console.log(collapsed, type);
          }}>
          <div className="logo" style={{display: 'flex'}}>
            <img src={RoomacIcon} width="30" height="30" style={{margin: 15}} alt="favicon" />
            <i style={{color: 'white', fontSize: 24, alignSelf: 'center', paddingBottom: 5}}>roomac</i>
          </div>
          <Menu theme="dark" mode="inline" selectedKeys={this.state.selectedKeys} onSelect={this.onSelect.bind(this)}>
            <Menu.Item key="/" icon={<HomeOutlined />}>
              <Link to="/">{(this.props.t('home'))}</Link>
            </Menu.Item>
            <Menu.Item key="/bookings" icon={<RiFileListLine />}>
              <Link to="/bookings">{(this.props.t('myBookings'))}</Link>
            </Menu.Item>
            <Menu.Item key="/calendar" icon={<AiOutlineCalendar />}>
              <Link to="/calendar">{(this.props.t('myCalendar'))}</Link>
            </Menu.Item>
            <Menu.ItemGroup key="g1" title={(this.props.t('categories'))}>
              {categories}
            </Menu.ItemGroup>
            <Menu.ItemGroup key="g2" title={(this.props.t('account'))}>
              <Menu.Item key="/settings" icon={<SettingOutlined />}>
                <Link to="/settings">{(this.props.t('settings'))}</Link>
              </Menu.Item>
              <Menu.Item key="/logout" icon={<LogoutOutlined />} onClick={this.showPromiseConfirm} danger>
                {(this.props.t('logout'))}
              </Menu.Item>
            </Menu.ItemGroup>
          </Menu>
        </Sider>
        <Layout>
          <Header className="site-layout-sub-header-background" style={{padding: 15, display: 'flex', justifyContent: 'flex-end'}}>
            <div style={{alignSelf: 'center'}}>
              {(this.props.t('welcome'))} {this.props.user.first_name} {this.props.user.last_name} 
            </div>

            <Avatar src={this.props.user.image_url} style={{marginLeft: 15}} />
          </Header>
          <Content style={{margin: '24px 16px 0'}}>
            <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{textAlign: 'center'}}>roomac ©2020</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(withTranslation()(DefaultView))
