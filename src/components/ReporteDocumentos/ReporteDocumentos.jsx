import React from "react";
import { Table } from "antd"; // Solo importa Table de antd
import { reportData } from "./data";
import Navbar from "../Navbar/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Definir colores para cada tipo de documento
const documentTypeColors = {
  Resolucion: "#4caf50", // Verde
  Grado: "#2196f3", // Azul
  Titulo: "#ff9800", // Naranja
  Doctorado: "#9c27b0", // Púrpura
  Constancia: "#f44336", // Rojo
};

// Función para contar los tipos de documentos
const countDocumentTypes = (data) => {
  const counts = {};
  data.forEach((item) => {
    counts[item.DocumentType] = (counts[item.DocumentType] || 0) + 1;
  });
  return Object.entries(counts).map(([type, count]) => ({ type, count }));
};

const ReportesDocumentos = () => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Tipo de Documento",
      dataIndex: "DocumentType",
      key: "DocumentType",
    },
  ];

  const documentTypeCounts = countDocumentTypes(reportData);

  // Configuración de paginación
  const paginationConfig = {
    pageSize: 12, // Mostrar 12 documentos por página
    showSizeChanger: false, // Ocultar el selector de tamaño
    total: reportData.length, // Total de documentos
  };

  return (
    <div>
      <Navbar />
      <div style={{ backgroundColor: "#f0f2f5", padding: "20px" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
          <div className="listaReportes">
            <h2 style={{ textAlign: "center" }}>
              Reportes de Documentos Almacenados
            </h2>
            <Table
              dataSource={reportData}
              columns={columns}
              rowKey="id"
              pagination={paginationConfig} // Aplicar configuración de paginación
              bordered
              style={{ backgroundColor: "#ffffff" }}
            />
          </div>
          <div className="graficos">
            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
              Distribución de Tipos de Documentos
            </h3>
            <BarChart
              width={600}
              height={300}
              data={documentTypeCounts}
              style={{ margin: "0 auto", marginBottom: "20px" }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>

            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
              Gráfico Circular de Tipos de Documentos
            </h3>
            <PieChart width={600} height={300} style={{ margin: "0 auto" }}>
              <Pie
                data={documentTypeCounts}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {documentTypeCounts.map((entry) => (
                  <Cell
                    key={entry.type}
                    fill={documentTypeColors[entry.type]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesDocumentos;
