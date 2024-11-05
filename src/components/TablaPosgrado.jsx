import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Table, Space } from "antd";
import "../styles/Tabla.css";
import dataPosgrado from "./data/TablaPosgrado"; // Importa la data de prueba

const { Column } = Table;

export default function Tablas() {
  const navigate = useNavigate();

  const [documentos, setDocumentos] = useState([]);
  const [filteredDocumentos, setFilteredDocumentos] = useState([]);
  const [filters, setFilters] = useState({
    nombreapellido: "",
    dni: "",
    fechaexpedicion: "",
    maestriadoctorado: "",
  });

  // Usar la data de prueba en lugar de hacer la petición a la API
  useEffect(() => {
    setDocumentos(dataPosgrado);
    setFilteredDocumentos(dataPosgrado);
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = documentos;

      if (filters.nombreapellido) {
        filtered = filtered.filter((doc) =>
          doc.nombreapellido
            .toLowerCase()
            .includes(filters.nombreapellido.toLowerCase())
        );
      }

      if (filters.dni) {
        filtered = filtered.filter((doc) => doc.dni.includes(filters.dni));
      }

      if (filters.fechaexpedicion) {
        filtered = filtered.filter((doc) =>
          doc.fechaexpedicion.includes(filters.fechaexpedicion)
        );
      }

      if (filters.maestriadoctorado) {
        filtered = filtered.filter((doc) =>
          doc.maestriadoctorado
            .toLowerCase()
            .includes(filters.maestriadoctorado.toLowerCase())
        );
      }

      setFilteredDocumentos(filtered);
    };

    applyFilters();
  }, [filters, documentos]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      nombreapellido: "",
      dni: "",
      fechaexpedicion: "",
      maestriadoctorado: "",
    });
  };

  const handleSaveIdAndRedirect = (id) => {
    localStorage.setItem("documentId", id);
    navigate("/verposgrado");
  };

  return (
    <div className="container mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">
        Posgrado
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <Input
          type="text"
          name="nombreapellido"
          placeholder="Filtrar por Nombre y Apellido"
          value={filters.nombreapellido}
          onChange={handleFilterChange}
        />
        <Input
          type="text"
          name="dni"
          placeholder="Filtrar por DNI"
          value={filters.dni}
          onChange={handleFilterChange}
        />
        <Input
          type="text"
          name="fechaexpedicion"
          placeholder="Filtrar por Fecha de Expedición"
          value={filters.fechaexpedicion}
          onChange={handleFilterChange}
        />
        <Input
          type="text"
          name="maestriadoctorado"
          placeholder="Filtrar por Maestría o Doctorado"
          value={filters.maestriadoctorado}
          onChange={handleFilterChange}
        />
        <Button onClick={clearFilters} className="button">
          Limpiar Filtros
        </Button>
      </div>
      <Table dataSource={filteredDocumentos} className="custom-table">
        <Column
          title="Nombre y Apellido"
          dataIndex="nombreapellido"
          key="nombreapellido"
        />
        <Column title="DNI" dataIndex="dni" key="dni" />
        <Column
          title="Fecha de Expedición"
          dataIndex="fechaexpedicion"
          key="fechaexpedicion"
        />
        <Column
          title="Maestría o Doctorado"
          dataIndex="maestriadoctorado"
          key="maestriadoctorado"
        />
        <Column
          title="Enlace"
          key="action"
          render={(documento) => (
            <Space size="middle">
              <Button
                onClick={() => handleSaveIdAndRedirect(documento.idposgrado)}
              >
                Ver
              </Button>
            </Space>
          )}
        />
      </Table>
    </div>
  );
}
