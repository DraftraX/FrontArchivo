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

// Colores definidos por tipo de documento
const documentTypeColors = {
  Resolucion: "#4CAF50",  // Verde
  Grado: "#2196F3",       // Azul
  Titulo: "#FF9800",      // Naranja
  Doctorado: "#9C27B0",   // Púrpura
  Constancia: "#F44336",  // Rojo
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

  const fetchReportData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/resolucion/verresolucion/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data && data.content) {
        setReportData(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
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

  return (
    <div>
      <Navbar />
      <div style={{ backgroundColor: "#f0f2f5", padding: "20px" }}>
        {/* Fila 1: Título y Tabla */}
        <div className="mb-6 px-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-center text-xl font-semibold mb-4 text-indigo-700">
              Reportes de Documentos Almacenados
            </h2>
            <Table
              dataSource={reportData}
              columns={columns}
              rowKey="nrodoc"
              pagination={paginationConfig}
              loading={loading}
              bordered
            />
          </div>
        </div>

        {/* Fila 2: Gráficos */}
        <div className="flex flex-col gap-6 px-4">
          {/* Gráfico de barras */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-center text-lg font-semibold mb-4 text-emerald-600">
              Distribución de Tipos de Documentos
            </h3>
            <BarChart
              width={window.innerWidth > 1024 ? 600 : 350}
              height={300}
              data={documentTypeCounts}
              margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="type"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={80}
              />
              <YAxis />
              <Tooltip formatter={(value) => `${value} documentos`} />
              <Legend />
              <Bar
                dataKey="count"
                fill="#6366F1"
                label={{ position: "top", fill: "#333" }}
              />
            </BarChart>
          </div>

          {/* Gráfico circular */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-center text-lg font-semibold mb-4 text-pink-600">
              Gráfico Circular de Tipos de Documentos
            </h3>
            <PieChart width={window.innerWidth > 1024 ? 600 : 350} height={300}>
              <Pie
                data={documentTypeCounts}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={50}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {documentTypeCounts.map((entry) => (
                  <Cell
                    key={entry.type}
                    fill={documentTypeColors[entry.type] || "#ccc"}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} documentos`} />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesDocumentos;
