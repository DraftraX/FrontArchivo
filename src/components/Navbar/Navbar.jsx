import { Menu, Dropdown, Layout, message } from "antd";
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/ApiRuta";
import { navigation } from "./Data";

const { Header } = Layout;

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = true;

  const handleNavigation = (href, message) => {
    localStorage.setItem("navMessage", message);
    navigate(href);
    if (href === "/resoluciones") {
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(API_URL + "/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        // Clear all localStorage data
        localStorage.clear();
        message.success("¡Sesión cerrada con éxito!");
        navigate("/login");
      } else {
        message.error("¡Error al cerrar la sesión!");
        console.error("Error al cerrar la sesión");
      }
    } catch (error) {
      message.error("¡Error al cerrar la sesión!");
      console.error("Error al cerrar la sesión:", error);
    }
  };

  const menuItems = (children) =>
    children.map((child) => ({
      key: child.name,
      label: (
        <span
          onClick={() => handleNavigation(child.href, child.message)}
          className="flex items-center "
        >
          {child.icon && <span className="mr-2 ">{child.icon}</span>}
          {child.name}
        </span>
      ),
    }));

  const navigationItems = navigation.map((item) =>
    item.children
      ? {
          key: item.name,
          label: (
            <span className="flex items-center">
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.name}
            </span>
          ),
          children: menuItems(item.children),
        }
      : {
          key: item.name,
          label: (
            <a
              onClick={() => handleNavigation(item.href)}
              className="flex items-center"
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.name}
            </a>
          ),
        }
  );

  const userMenuItems = [
    {
      key: "perfil",
      label: (
        <a href="/perfil" className="flex items-center">
          <UserOutlined className="mr-2" />
          Tu perfil
        </a>
      ),
    },
    {
      key: "reportes",
      label: (
        <a href="/reportes" className="flex items-center">
          <UserOutlined className="mr-2" />
          Reportes
        </a>
      ),
    },
    {
      key: "logout",
      label: (
        <a onClick={handleLogout} className="flex items-center">
          <ArrowLeftOutlined className="mr-2" />
          Cerrar sesión
        </a>
      ),
    },
  ];

  return (
    <Layout>
      <Header className="flex justify-between items-center bg-green-500 p-4">
        <div className="logo">
          <Link to="/paginaprincipal">
            <img src="https://univerperu.com/wp-content/uploads/2023/07/Universidad-Nacional-de-San-Martin-UNSM.png" alt="Your Company" className="h-16" />
          </Link>
        </div>
        <Menu
          mode="horizontal"
          theme="dark"
          className="bg-green-500 text-white"
          items={navigationItems}
        />
        {isAuthenticated && (
          <Dropdown
            overlay={
              <Menu items={userMenuItems} className="bg-white text-black" />
            }
            trigger={["click"]}
          >
            <span
              onClick={(e) => e.preventDefault()}
              className="flex items-center"
            >
              <UserOutlined className="text-white text-2xl" />
            </span>
          </Dropdown>
        )}
      </Header>
    </Layout>
  );
}
