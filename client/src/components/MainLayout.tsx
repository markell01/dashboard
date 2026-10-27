import {
  Breadcrumb,
  Button,
  Layout,
  Menu,
  theme,
  Typography,
  type MenuProps,
} from "antd";
import { useState } from "react";
import {
  FaBars,
  FaBookOpen,
  FaInfoCircle,
  FaLayerGroup,
  FaProjectDiagram,
} from "react-icons/fa";
import { Outlet, useLocation, useNavigate } from "react-router";

const { Sider, Header, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "/",
    label: "Проекты",
    icon: <FaProjectDiagram />,
  },
  {
    key: "/instructions",
    label: "Инструкции",
    icon: <FaInfoCircle />,
  },
  {
    key: "/about",
    label: "О проекте",
    icon: <FaBookOpen />,
  },
];

const MainLayout = () => {
  const {
    token: {},
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const pageTitles: Record<string, string> = {
    "/": "Проекты и задачи",
    "/instructions": "Инструкции",
    "/about": "О проекте",
  };

  const currentPage = pageTitles[location.pathname] ?? "Dashboard";

  return (
    <Layout className="app-shell">
      <Sider
        className="app-sider"
        width={248}
        collapsedWidth={0}
        collapsed={collapsed}
        trigger={null}
        breakpoint="lg"
        onBreakpoint={setCollapsed}
      >
        <div className="brand">
          <div className="brand-mark">
            <FaLayerGroup />
          </div>
          <div className="brand-copy">
            <Typography.Text strong>Project Flow</Typography.Text>
            <Typography.Text type="secondary">Control center</Typography.Text>
          </div>
        </div>
        <div className="menu-caption">Навигация</div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => {
            navigate(key);
            if (window.innerWidth < 992) {
              setCollapsed(true);
            }
          }}
          items={items}
        />
        <div className="sider-footer">
          <span className="status-dot" />
          PostgreSQL + REST API
        </div>
      </Sider>
      <Layout className="main-layout">
        <Header className="app-header">
          <div className="header-left">
            <Button
              className="header-menu-button"
              type="text"
              aria-label={collapsed ? "Открыть меню" : "Свернуть меню"}
              icon={<FaBars />}
              onClick={() => setCollapsed((value) => !value)}
            />
            <div>
              <Breadcrumb
                items={[{ title: "Dashboard" }, { title: currentPage }]}
              />
              <Typography.Title level={4}>{currentPage}</Typography.Title>
            </div>
          </div>
        </Header>
        <Content className="app-content">
          <div className="content-wrap">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
