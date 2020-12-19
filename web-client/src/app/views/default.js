import { Component } from "react";
import { Layout, Menu, Modal, Button } from 'antd';
import { HomeOutlined, CaretRightOutlined, LogoutOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { axiosInstance } from '../api/axiosInstance';

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
      title: 'Are you sure you want to log out?',
      icon: <ExclamationCircleOutlined />,
      //content: 'Some descriptions',
      onOk() {
        axiosInstance.post("/api/logout").then(logout).catch(logout)
      },
      onCancel() {},
    });
  }

  render() {
    return (
      <Router>
        <Layout style={{ minHeight:"100vh" }}>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={broken => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
          <div className="logo">
            <img src="/favicon.ico" width="30" height="30" style={{margin: 15}} alt="favicon" />
            <i style={{color: 'white', fontSize: 24, position: 'absolute', top: 9}}>roomac</i>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[window.location.pathname]}>
            <Menu.Item key="/" icon={<HomeOutlined />}>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.ItemGroup key="g1" title="Categories">
              <Menu.Item key="/venues" icon={<CaretRightOutlined />}><Link to="/venues">Venues</Link></Menu.Item>
            </Menu.ItemGroup>
          </Menu>
          </Sider>
          <Layout>
            <Header className="site-layout-sub-header-background" style={{paddingRight: 15, display: 'flex', justifyContent: 'right'}}>
              Welcome {this.props.user.first_name} {this.props.user.last_name} 

              <Button type="dashed" icon={<LogoutOutlined />} style={{marginTop: 15, marginLeft: 15 }} onClick={this.showPromiseConfirm}>
                Log out
              </Button>
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

export default DefaultView
