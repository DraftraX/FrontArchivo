import React, { useEffect, useState } from "react";
import { Spin, Divider, Card, Descriptions } from "antd";
import "../styles/VerDocumento.css"; // Asegúrate de que la ruta del archivo CSS sea correcta

export default function PosgradoDetalle() {
  const [documento, setDocumento] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const documentId = localStorage.getItem("documentId");
  const token = localStorage.getItem("token");

  const mockData = {
    nombreapellido: "María López",
    dni: "87654321",
    fechaexpedicion: "2024-10-22",
    maestriadoctorado: "Maestría en Ciencias de la Computación",
    idresolucion: "RESOL-2024-0002",
  };

  useEffect(() => {
    if (documentId) {
      setDocumento(mockData);
      const simulatedPdfUrl = "http://www.pdf995.com/samples/pdf.pdf"; // URL de ejemplo
      setPdfUrl(simulatedPdfUrl);
    } else {
      setError("No se encontró el ID del documento en el localStorage.");
    }
    setLoading(false);
  }, [documentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-full h-full p-8 bg-gray-50 shadow-lg rounded-lg mt-6">
      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
        Detalle del Posgrado
      </h1>
      <div className="division gap-8">
        {/* Información del Posgrado */}
        <Card bordered={false} className="shadow-lg">
          <Divider orientation="left">
            <h2 className="text-2xl font-semibold">Información del Posgrado</h2>
          </Divider>
          <Descriptions bordered column={1} labelStyle={{ fontWeight: "bold" }}>
            <Descriptions.Item label="Nombre y Apellido">
              {documento.nombreapellido}
            </Descriptions.Item>
            <Descriptions.Item label="DNI">{documento.dni}</Descriptions.Item>
            <Descriptions.Item label="Fecha de Expedición">
              {documento.fechaexpedicion}
            </Descriptions.Item>
            <Descriptions.Item label="Maestría o Doctorado">
              {documento.maestriadoctorado}
            </Descriptions.Item>
            <Descriptions.Item label="ID de Resolución">
              {documento.idresolucion}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* PDF del Documento */}
        <Card bordered={false} className="shadow-lg">
          <Divider orientation="left">
            <h2 className="text-2xl font-semibold">Documento en PDF</h2>
          </Divider>
          <div className="border border-gray-300 rounded-lg h-96 overflow-hidden">
            {pdfUrl ? (
              <embed
                className="w-full h-full"
                src={pdfUrl}
                type="application/pdf"
              />
            ) : (
              <p className="text-center text-gray-500">
                No se pudo cargar el PDF.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
