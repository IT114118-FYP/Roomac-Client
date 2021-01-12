import { Component } from "react";
import { withTranslation } from 'react-i18next';
import { Layout, Menu, Modal, Button, Select } from 'antd';
import { HomeOutlined, CaretRightOutlined, LogoutOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { axiosInstance } from '../api/axiosInstance';
import { languages, languageOptions } from '../i18n/func';

const { Header, Content, Footer, Sider } = Layout;
const { confirm } = Modal;

class DefaultView extends Component {
  constructor(props) {
    super(props);
    this.state = { };
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

  handleLanguageChange(value) {
    this.props.i18n.changeLanguage(value);
  }

  render() {
    const categories = this.props.categories.map((c) => {
      let title = c['title_' + this.props.i18n.language];
      title = title && title.length > 0 ? title : c.title_en;

      return (
        <Menu.Item key={'/categories/' + c.id} icon={<CaretRightOutlined />}>
          <Link to={'/categories/' + c.id}>{title}</Link>
        </Menu.Item>
      )
    });

    return (
      <Router>
        <Layout style={{ minHeight:"100vh" }}>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={broken => {
              //console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              //console.log(collapsed, type);
            }}
          >
          <div className="logo" style={{display: 'flex'}}>
            <img src="/favicon.ico" width="30" height="30" style={{margin: 15}} alt="favicon" />
            <i style={{color: 'white', fontSize: 24, alignSelf: 'center', paddingBottom: 5}}>roomac</i>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[window.location.pathname]}>
            <Menu.Item key="/" icon={<HomeOutlined />}>
              <Link to="/">{(this.props.t('home'))}</Link>
            </Menu.Item>
            <Menu.ItemGroup key="g1" title={(this.props.t('categories'))}>
              {categories}
            </Menu.ItemGroup>
          </Menu>
          </Sider>
          <Layout>
            <Header className="site-layout-sub-header-background" style={{padding: 15, display: 'flex', justifyContent: 'flex-end'}}>
              <div style={{alignSelf: 'center'}}>
                {(this.props.t('welcome'))} {this.props.user.first_name} {this.props.user.last_name} 
              </div>

              <Button type="dashed" icon={<LogoutOutlined />} style={{marginLeft: 15}} onClick={this.showPromiseConfirm}>
                {(this.props.t('logout'))}
              </Button>

              <Select defaultValue={languages[this.props.i18n.language]} style={{marginLeft: 15, width: 100}} onChange={this.handleLanguageChange.bind(this)}>
                {languageOptions}
              </Select>
            </Header>
            <Content style={{margin: '24px 16px 0'}}>
              <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                {this.props.children}
              </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>roomac ©2020 Created by LTTT</Footer>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default withTranslation()(DefaultView)
