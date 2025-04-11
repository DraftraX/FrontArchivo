import React, { useEffect, useState } from "react";
import { Spin, Divider, Table } from "antd";
import { API_URL } from "../utils/ApiRuta";

export default function DocumentoDetalle() {
  const [documento, setDocumento] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const documentId = localStorage.getItem("documentId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/resolucion/verresolucion/${documentId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los datos del documento");
        }

        const data = await response.json();
        setDocumento(data);
        setPdfUrl(data.link);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (documentId && token) {
      fetchData();
    } else {
      setError("No se encontró el ID del documento o el token.");
      setLoading(false);
    }
  }, [documentId, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!documento) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>No se encontró el documento.</div>
      </div>
    );
  }

  const columns = [
    {
      title: "Campo",
      dataIndex: "campo",
      key: "campo",
      width: "30%",
      align: "center",
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
    },
  ];

  const data = [
    {
      key: "1",
      campo: "NRO",
      valor: documento.nrodoc,
    },
    {
      key: "2",
      campo: "Título",
      valor: documento.titulo,
    },
    {
      key: "3",
      campo: "Estado",
      valor: documento.estado,
    },
    {
      key: "4",
      campo: "Fecha",
      valor: documento.fecha,
    },
    {
      key: "5",
      campo: "Duración",
      valor: documento.duracion,
    },
    {
      key: "6",
      campo: "Vencimiento",
      valor: documento.vencimiento,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">
        Detalle del Documento
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Divider orientation="left">Información del Documento</Divider>
          <Table
            columns={columns}
            dataSource={data}
            size="middle"
            pagination={false}
            bordered
          />
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          {pdfUrl ? (
            <iframe
              className="w-full h-96"
              src={pdfUrl}
              title="Documento PDF"
              width="800" 
              height="600" 
              allow="autoplay"
            />
          ) : (
            <div>No se pudo cargar el documento PDF.</div>
          )}
        </div>
      </div>
    </div>
  );
}
