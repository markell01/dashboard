import { Layout, Menu, theme, type MenuProps } from "antd";
import { FaBookOpen, FaInfoCircle, FaProjectDiagram } from "react-icons/fa";
import { Outlet, useLocation, useNavigate } from "react-router";

const { Sider, Content } = Layout;

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
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => navigate(key)}
            style={{ height: "100%", borderInlineEnd: 0 }}
            items={items}
          />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
