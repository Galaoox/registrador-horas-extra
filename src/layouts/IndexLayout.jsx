import { Layout, Menu, Breadcrumb } from "antd";
import { createElement } from "react";
import { Link, Outlet } from "react-router-dom";
import { routes } from "../config/routes";
import './IndexLayout.css';

const { Header, Content, Footer } = Layout;


const IndexLayout = () => {
  return (
    <Layout className="layout">

    <Content style={{ padding: "0 1rem" }}>
      <div className="site-layout-content">
          <Outlet />
      </div>
    </Content>
    <Footer style={{ textAlign: "center" }}>
      Fet
    </Footer>
  </Layout>
  )
}

export default IndexLayout