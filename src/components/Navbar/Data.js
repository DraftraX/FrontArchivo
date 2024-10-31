import { UserOutlined, FileTextOutlined, HomeOutlined, AppstoreAddOutlined, ExperimentOutlined, ToolOutlined } from "@ant-design/icons";
import React from "react";
export const navigation = [
  {
    name: "Resoluciones",
    children: [
      {
        name: "Todas las resoluciones",
        href: "/resoluciones",
        message: "verresolucion/",
        icon: React.createElement(UserOutlined),
      },
      {
        name: "Archivos de Gestión",
        href: "/resoluciones",
        message: "verresolucion/criteriomayor/1",
        icon: React.createElement(FileTextOutlined),
      },
      {
        name: "Oficinas Académicas",
        href: "/resoluciones",
        message: "verresolucion/criteriomayor/2",
        icon: React.createElement(HomeOutlined),
      },
      {
        name: "Vicerrectoría de Investigación",
        href: "/resoluciones",
        message: "verresolucion/criteriomayor/3",
        icon: React.createElement(AppstoreAddOutlined),
      },
      {
        name: "Oficinas Administrativas",
        href: "/resoluciones",
        message: "verresolucion/criteriomayor/4",
        icon: React.createElement(ExperimentOutlined),
      },
      {
        name: "Archivos Externos",
        href: "/resoluciones",
        message: "verresolucion/criteriomayor/5",
        icon: React.createElement(ToolOutlined),
      },
    ],
    icon: React.createElement(FileTextOutlined), 
  },
  {
    name: "Grados y Títulos",
    href: "/grados",
    icon: React.createElement(AppstoreAddOutlined),
  },
  {
    name: "Maestría y Doctorado",
    href: "/posgrados",
    icon: React.createElement(ExperimentOutlined),
  },
];
