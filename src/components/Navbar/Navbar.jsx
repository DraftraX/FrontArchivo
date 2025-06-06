import { useEffect, useState } from "react";
import { Menu, Dropdown, Layout, message } from "antd";
import {
  UserOutlined,
  ArrowLeftOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/ApiRuta";
import { navigation } from "./Data";

const { Header } = Layout;

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = true;
  const [userCargo, setUserCargo] = useState("");

  // Obtener el cargo del usuario al cargar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");

        if (!token || !username) {
          return;
        }

        const response = await fetch(
          `${API_URL}/usuario/verusuarioporusername/${username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserCargo(data.cargoid);
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, []);

  // Función para determinar si un elemento del menú debería mostrarse según el cargo
  const shouldShowMenuItem = (item) => {
    // Si no hay restricciones definidas, se muestra a todos
    if (!item.roles) return true;
    
    // Si el usuario es ADMINISTRADOR, ve todo
    if (userCargo === "ADMINISTRADOR") return true;
    
    // Para otros roles, verificar si tienen permiso
    return item.roles.includes(userCargo);
  };

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
        navigate("/");
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
    children
      .filter(child => shouldShowMenuItem(child))
      .map((child) => ({
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

  const navigationItems = navigation
    .filter(item => shouldShowMenuItem(item))
    .map((item) =>
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

  // Definir permisos para los elementos del menú de usuario
  const userMenuItems = [
    {
      key: "perfil",
      label: (
        <a href="/perfil" className="flex items-center">
          <UserOutlined className="mr-2" />
          Tu perfil
        </a>
      ),
      roles: ["ADMINISTRADOR", "JEFE ARCHIVO", "SECRETARIA", "USUARIO"]
    },
    {
      key: "Reporte Visitantes",
      label: (
        <a
          onClick={() => handleNavigation("/reportes-visitantes", "Visitantes")}
          className="flex items-center"
        >
          <SnippetsOutlined className="mr-2" />
          Reporte Visitantes
        </a>
      ),
      roles: ["ADMINISTRADOR", "JEFE ARCHIVO"]
    },
    {
      key: "Reporte Documentos",
      label: (
        <a
          onClick={() => handleNavigation("/reportes-documentos", "Documentos")}
          className="flex items-center"
        >
          <SnippetsOutlined className="mr-2" />
          Reporte Documentos
        </a>
      ),
      roles: ["ADMINISTRADOR", "JEFE ARCHIVO"]
    },
    {
      key: "logout",
      label: (
        <a href="/" onClick={handleLogout} className="flex items-center">
          <ArrowLeftOutlined className="mr-2 " />
          Cerrar sesión
        </a>
      ),
      roles: ["ADMINISTRADOR", "JEFE ARCHIVO", "SECRETARIA", "USUARIO"]
    },
  ];

  // Filtrar los elementos del menú de usuario según el cargo
  const filteredUserMenuItems = userMenuItems.filter(item => shouldShowMenuItem(item));

  return (
    <Layout>
      <Header className="flex justify-between items-center bg-green-500 p-4">
        <div className="logo">
          <Link to="/paginaprincipal">
            <img
              src="https://unsm.edu.pe/wp-content/uploads/2022/03/escudo_unsm_2021_colores_PNG-370x426.png"
              alt="Your Company"
              className="h-16"
            />
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
              <Menu items={filteredUserMenuItems} className="bg-white text-blacks" />
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