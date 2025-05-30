import React, { useState, useEffect } from "react";
import { Table } from "antd";
import Navbar from "../Navbar/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Sector,
  ResponsiveContainer,
} from "recharts";
import { API_URL } from "../../utils/ApiRuta";

const token = localStorage.getItem("token");

const documentTypeColors = {
  Resolucion: "#4CAF50",
  Grado: "#2196F3",
  Titulo: "#FF9800",
  Doctorado: "#9C27B0",
  Constancia: "#F44336",
};

// Función para resaltar el sector activo
const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333">
        {payload.type}
      </text>
      <text x={sx} y={sy} textAnchor="middle" fill="#999">{`${value} documentos`}</text>
    </g>
  );
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
  const [allData, setAllData] = useState([]); // Para los gráficos
  const [activeIndex, setActiveIndex] = useState(null); 

  // Fetch paginado para la tabla
  const fetchReportData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/resolucion/verresolucion?page=${page - 1}&size=10`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data && data.content) {
        setReportData(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (error) {
      console.error("Error fetching paged data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch completo para gráficos
  const fetchAllData = async () => {
    try {
      const response = await fetch(`${API_URL}/resolucion/verallresolucion`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setAllData(data);
      }
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  };

  useEffect(() => {
    fetchReportData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchAllData();
  }, []);

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
  ];

  const documentTypeCounts = countDocumentTypes(allData);

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
        {/* Fila 1: Tabla */}
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={documentTypeCounts}
                margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                
                {/* Ocultamos los textos del eje X */}
                <XAxis tick={false} />

                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const { type, count } = payload[0].payload;
                      return (
                        <div style={{ backgroundColor: "white", padding: "8px", border: "1px solid #ccc" }}>
                          <p><strong>{type}</strong></p>
                          <p>{count} documentos</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Bar
                  dataKey="count"
                  fill="#6366F1"
                  label={{ position: "top", fill: "#333" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico circular */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-center text-lg font-semibold mb-4 text-pink-600">
              Gráfico Circular de Tipos de Documentos
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={documentTypeCounts}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {documentTypeCounts.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        activeIndex === null || activeIndex === index
                          ? documentTypeColors[entry.type] || "#8884d8"
                          : "#ccc"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} documentos`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesDocumentos;
