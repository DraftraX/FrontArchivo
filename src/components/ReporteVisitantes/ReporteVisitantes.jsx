import React from "react";
import { Table } from "antd"; // Solo importa Table de antd
import { visitantesData } from "./data";
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

// Definir colores para cada tipo de visita
const visitTypeColors = {
  Consulta: "#4caf50", // Verde
  "Entrega de documentos": "#2196f3", // Azul
  "Solicitar Documentos": "#ff9800", // Naranja
};

// Función para contar los tipos de visita por año y tipo
const countVisitsByYearAndType = (data) => {
  const groupedData = {};

  data.forEach((item) => {
    const year = new Date(item.fechaVisita).getFullYear(); // Obtener solo el año
    const { tipoVisita } = item;

    if (!groupedData[year]) {
      groupedData[year] = { year }; // Inicializar objeto con el año
    }

    if (!groupedData[year][tipoVisita]) {
      groupedData[year][tipoVisita] = 0; // Inicializar el contador para el tipo de visita
    }

    groupedData[year][tipoVisita] += 1; // Incrementar el contador
  });

  return Object.values(groupedData); // Convertimos el objeto en un array para usarlo en Recharts
};

const ReporteVisitantes = () => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Fecha de Visita",
      dataIndex: "fechaVisita",
      key: "fechaVisita",
    },
    {
      title: "Tipo de Visita",
      dataIndex: "tipoVisita",
      key: "tipoVisita",
    },
  ];

  const visitsByYearAndType = countVisitsByYearAndType(visitantesData);

  const paginationConfig = {
    pageSize: 7,
    showSizeChanger: false,
    total: visitantesData.length,
  };

  return (
    <div>
      <Navbar />
      <div style={{ backgroundColor: "#f0f2f5", padding: "20px" }}>
        <div className="formato">
          <div className="listaVisitantes">
            <h2 className="mb-4 text-center text-3xl font-bold ">
              Reporte de Visitantes
            </h2>
            <Table
              dataSource={visitantesData}
              columns={columns}
              rowKey="id"
              pagination={paginationConfig}
              bordered
              style={{ backgroundColor: "#ffffff" }}
            />
          </div>
          <div className="graficos">
            <h3 className="mb-4 text-center text-3xl font-bold">
              Cantidad de Visitantes por Tipo de Visita (por Año)
            </h3>
            <LineChart
              width={950}
              height={530}
              data={visitsByYearAndType}
              style={{ margin: "0 auto" }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis allowDecimals={false} domain={[0, "auto"]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Consulta"
                stroke={visitTypeColors.Consulta}
                name="Consulta"
              />
              <Line
                type="monotone"
                dataKey="Entrega de documentos"
                stroke={visitTypeColors["Entrega de documentos"]}
                name="Entrega de documentos"
              />
              <Line
                type="monotone"
                dataKey="Solicitar Documentos"
                stroke={visitTypeColors["Solicitar Documentos"]}
                name="Solicitar Documentos"
              />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteVisitantes;
