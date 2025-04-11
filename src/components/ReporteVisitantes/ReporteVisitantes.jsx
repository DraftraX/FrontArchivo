import React, { useState, useEffect } from "react";
import { Table } from "antd";
import Navbar from "../Navbar/Navbar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import "./ReporteVisitantes.css";
import { API_URL } from "../../utils/ApiRuta";

const token = localStorage.getItem("token");

const countVisitsByYearAndMotivo = (data) => {
  const groupedData = {};
  const motivosUnicos = new Set();

  data.forEach((item) => {
    const year = new Date(item.fecha).getFullYear();
    const motivo = item.motivo || "Otro";

    motivosUnicos.add(motivo); 

    if (!groupedData[year]) {
      groupedData[year] = { year };
    }

    if (!groupedData[year][motivo]) {
      groupedData[year][motivo] = 0;
    }

    groupedData[year][motivo] += 1;
  });

  return {
    data: Object.values(groupedData), 
    motivos: Array.from(motivosUnicos), 
  };
};


const generateColors = (keys) => {
  const colors = ["#4caf50", "#2196f3", "#ff9800", "#e91e63", "#9c27b0"];
  const assignedColors = {};

  keys.forEach((key, index) => {
    assignedColors[key] = colors[index % colors.length]; 
  });

  return assignedColors;
};

const ReporteVisitantes = () => {
  const [visitantesData, setVisitantesData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [motivoColors, setMotivoColors] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 7, total: 0 });
  const [loading, setLoading] = useState(false);

  // Función para obtener datos del backend
  const fetchVisitantes = async (page = 0, size = 7) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/visita/view`, 
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      setVisitantesData(data.content);

      // Procesar datos para el gráfico
      const { data: groupedData, motivos } = countVisitsByYearAndMotivo(data.content);
      setChartData(groupedData);

      // Generar colores dinámicos para los motivos
      const colors = generateColors(motivos);
      setMotivoColors(colors);

      // Actualizar la configuración de la paginación
      setPagination((prev) => ({
        ...prev,
        total: data.totalElements,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar los datos iniciales
  useEffect(() => {
    fetchVisitantes();
  }, []);

  // Configuración de las columnas de la tabla
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Nombre", dataIndex: "nombre", key: "nombre" },
    { title: "Fecha", dataIndex: "fecha", key: "fecha" },
    { title: "Ocupación", dataIndex: "ocupacion", key: "ocupacion" },
    { title: "Motivo", dataIndex: "motivo", key: "motivo" },
    { title: "Número/Correo", dataIndex: "numerocorreo", key: "numerocorreo" },
  ];

  // Manejo del cambio de página en la tabla
  const handleTableChange = (pagination) => {
    fetchVisitantes(pagination.current - 1, pagination.pageSize);
    setPagination(pagination);
  };

  return (
    <div>
      <Navbar />
      <div style={{ backgroundColor: "#f0f2f5", padding: "20px" }}>
        <div className="formato">
          <div className="listaVisitantes">
            <h2 className="mb-4 text-center text-3xl font-bold">
              Reporte de Visitantes
            </h2>
            <Table
              dataSource={visitantesData}
              columns={columns}
              rowKey="id"
              pagination={pagination}
              loading={loading}
              onChange={handleTableChange}
              bordered
              style={{ backgroundColor: "#ffffff" }}
            />
          </div>
          <div className="graficos">
            <h3 className="mb-4 text-center text-3xl font-bold">
              Cantidad de Visitantes por Motivo (por Año)
            </h3>
            {chartData.length > 0 ? (
              <LineChart
                width={675}
                height={430}
                data={chartData}
                style={{ margin: "0 auto" }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis allowDecimals={false} domain={[0, "auto"]} />
                <Tooltip />
                <Legend />
                {Object.keys(motivoColors).map((motivo) => (
                  <Line
                    key={motivo}
                    type="monotone"
                    dataKey={motivo}
                    stroke={motivoColors[motivo]}
                    name={motivo}
                  />
                ))}
              </LineChart>
            ) : (
              <p className="text-center">No hay datos disponibles para el gráfico.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteVisitantes;
