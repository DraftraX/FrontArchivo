import React, { useState, useEffect } from "react";
import { Table } from "antd";
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
import { API_URL } from "../../utils/ApiRuta";

const token = localStorage.getItem("token");

// Definir colores para cada tipo de documento
const documentTypeColors = {
  Resolucion: "#4caf50", // Verde
  Grado: "#2196f3", // Azul
  Titulo: "#ff9800", // Naranja
  Doctorado: "#9c27b0", // Púrpura
  Constancia: "#f44336", // Rojo
};

const countDocumentTypes = (data) => {
  const counts = {};
  data.forEach((item) => {
    counts[item.titulo] = (counts[item.titulo] || 0) + 1;
  });
  return Object.entries(counts).map(([type, count]) => ({ type, count }));
};

const ReportesDocumentos = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Función para obtener datos del backend
  const fetchReportData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/resolucion/verresolucion/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error al obtener datos del backend ${response.status}`);
      }

      const data = await response.json();
      if (data && data.content) {
        setReportData(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        console.error("Respuesta inesperada:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData(currentPage);
  }, [currentPage]);

  const columns = [
    {
      title: "N° de Resolución",
      dataIndex: "nrodoc",
      key: "nrodoc",
    },
    {
      title: "Título",
      dataIndex: "titulo",
      key: "titulo",
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
    },
    {
      title: "Tipo de Documento",
      dataIndex: "titulo", 
      key: "titulo",
    },
  ];

  const documentTypeCounts = countDocumentTypes(reportData);

  const paginationConfig = {
    current: currentPage,
    pageSize: 10,
    total: totalElements,
    showSizeChanger: false,
    onChange: (page) => setCurrentPage(page),
  };

  const generateRandomColors = (data) => {
    const colors = {};
    data.forEach((item) => {
      colors[item.type] =
        "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    });
    return colors;
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
              rowKey="nrodoc"
              pagination={paginationConfig}
              loading={loading}
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
              >
                {documentTypeCounts.map((entry) => (
                  <Cell
                    key={entry.type}
                    fill={documentTypeColors[entry.type] || "#ccc"} // fallback en caso no esté definido
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
