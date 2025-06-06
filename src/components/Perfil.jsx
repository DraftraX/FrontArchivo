import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, message } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined,
  PlusOutlined,
  SettingOutlined,
  FileAddOutlined,
  UserAddOutlined,
  LockOutlined,
  TeamOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

import { API_URL } from "../utils/ApiRuta";

const Perfil = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    id: "",
    name: "",
    lastname: "",
    address: "",
    phone: "",
    fotoPerfil: "",
    cargoid: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");

        if (!token || !username) {
          message.error(
            "No se encontró un token de autenticación o nombre de usuario"
          );
          navigate("/");
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
          setUserData(data);
        } else {
          message.error("Error al obtener los datos del usuario");
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        message.error("Error de conexión");
      }
    };

    fetchUserData();
  }, [navigate]);

  // Función para determinar qué opciones mostrar según el cargo
  const getPermittedOptions = () => {
    const options = [
      {
        label: "Agregar Resoluciones",
        icon: <FileAddOutlined />,
        onClick: () => navigate("/createresolucion"),
        roles: ["ADMINISTRADOR", "JEFE ARCHIVO", "SECRETARIA"],
      },
      {
        label: "Agregar Grados y Títulos",
        icon: <IdcardOutlined />,
        onClick: () => navigate("/creategrado"),
        roles: ["ADMINISTRADOR", "JEFE ARCHIVO", "SECRETARIA"],
      },
      {
        label: "Agregar Maestría y Doctorado",
        icon: <SolutionOutlined />,
        onClick: () => navigate("/createposgrado"),
        roles: ["ADMINISTRADOR", "JEFE ARCHIVO", "SECRETARIA"],
      },
      {
        label: "Registrar Visita",
        icon: <PlusOutlined />,
        onClick: () => navigate("/visita"),
        roles: ["ADMINISTRADOR", "JEFE ARCHIVO", "SECRETARIA"],
      },
      {
        label: "Crear Usuario",
        icon: <UserAddOutlined />,
        onClick: () => navigate("/create"),
        roles: ["ADMINISTRADOR", "JEFE ARCHIVO"],
      },
      {
        label: "Actualizar Contraseña",
        icon: <LockOutlined />,
        onClick: () => navigate("/updatepassword"),
        roles: ["ADMINISTRADOR", "JEFE ARCHIVO", "SECRETARIA", "USUARIO"],
      },
      {
        label: "Roles y Permisos",
        icon: <TeamOutlined />,
        onClick: () => navigate("/permisos"),
        roles: ["ADMINISTRADOR"],
      },
    ];

    // Si el usuario es ADMINISTRADOR, mostrar todas las opciones
    if (userData.cargoid === "ADMINISTRADOR") {
      return options;
    }

    // Para otros roles, filtrar las opciones según el rol
    return options.filter((option) => option.roles.includes(userData.cargoid));
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Panel Izquierdo */}
        <aside className="md:col-span-2 bg-white rounded-2xl shadow p-10 flex flex-col items-center text-center">
          <Avatar
            size={140}
            icon={<UserOutlined />}
            src={userData.fotoPerfil}
            className="mb-6"
          />
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">
            {userData.name || "Usuario"}
          </h1>
          <p className="text-sm text-gray-500 mb-6 uppercase tracking-wide">
            {userData.cargoid || "Cargo"}
          </p>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {getPermittedOptions().map(({ label, icon, onClick }, i) => (
              <button
                key={i}
                onClick={onClick}
                className="
                  flex items-center justify-center gap-2 
                  w-full px-4 py-3 rounded-lg 
                  bg-gray-100 hover:bg-green-100 
                  text-sm text-gray-800 font-medium
                  transition duration-150
                  focus:outline-none focus:ring-2 focus:ring-green-300
                  border border-transparent hover:border-green-300
                "
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </aside>

        {/* Panel Derecho */}
        <section className="md:col-span-1 bg-white rounded-2xl shadow p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Información del Usuario
          </h2>
          <div className="space-y-5">
            {[
              {
                label: "Nombre",
                icon: <UserOutlined className="text-gray-500 text-lg" />,
                value: userData.name,
              },
              {
                label: "Apellido",
                icon: <UserOutlined className="text-gray-500 text-lg" />,
                value: userData.lastname,
              },
              {
                label: "Teléfono",
                icon: <PhoneOutlined className="text-gray-500 text-lg" />,
                value: userData.phone,
              },
              {
                label: "Dirección",
                icon: <HomeOutlined className="text-gray-500 text-lg" />,
                value: userData.address,
              },
            ].map(({ label, icon, value }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="pt-1">{icon}</div>
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-base text-gray-800">{value || "-"}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Perfil;