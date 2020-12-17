import { Layout, Menu, Modal } from 'antd';
import { HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Link, useHistory } from "react-router-dom";
import { axiosInstance } from '../../../api/axiosInstance';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { confirm } = Modal;

export default function DefaultLayout({ children }) {
  let history = useHistory();

  function showPromiseConfirm() {
    confirm({
      title: 'Are you sure you want to log out?',
      icon: <ExclamationCircleOutlined />,
      //content: 'Some descriptions',
      onOk() {
        axiosInstance
          .post("/api/logout")
          .then(() => {
            localStorage.removeItem("authToken");
            history.push('/login');
          })
          .catch(() => {
            localStorage.removeItem("authToken");
            history.push('/login');
          })
      },
      onCancel() {},
    });
  }

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
        <img src="/favicon.ico" width="30" height="30" style={{ margin: 15 }} alt="favicon" />
        <i style={{ color: 'white', fontSize: 24, position: 'absolute', top: 9 }}>roomac</i>
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.ItemGroup key="g1" title="Category">
          <Menu.Item key="2"><Link to="/category">Option1</Link></Menu.Item>
          <Menu.Item key="3"><Link to="/category">Option2</Link></Menu.Item>
        </Menu.ItemGroup>
      </Menu>
      <Menu theme="dark" mode="inline" selectable={false}>
        <Menu.Item icon={<LogoutOutlined />} onClick={showPromiseConfirm}>
          Log out
        </Menu.Item>
      </Menu>
      </Sider>
      <Layout>
        <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            { children }
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>roomac ©2020 Created by LTTT</Footer>
      </Layout>
    </Layout>
  </Router>
  );
}
