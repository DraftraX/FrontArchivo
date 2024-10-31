import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Table, Pagination } from "antd";
import "../styles/Tabla.css";
import dataDocumentos from "./data/Tablas";

export default function Tablas() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [documentos, setDocumentos] = useState(dataDocumentos); // Establecer datos de prueba
  const [filteredDocumentos, setFilteredDocumentos] = useState(dataDocumentos);
  const [filters, setFilters] = useState({
    nro: "",
    nombre: "",
    fecha: "",
    subcriterio: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(dataDocumentos.length); // Total de documentos

  useEffect(() => {
    // Filtrado de documentos basado en filtros
    const filtered = documentos.filter((doc) => {
      return (
        (filters.nro ? doc.nrodoc.includes(filters.nro) : true) &&
        (filters.nombre
          ? doc.titulo.toLowerCase().includes(filters.nombre.toLowerCase())
          : true) &&
        (filters.fecha ? doc.fecha.includes(filters.fecha) : true)
      );
    });
    setFilteredDocumentos(filtered);
    setTotalElements(filtered.length); // Actualiza el total de elementos después de filtrar
    setCurrentPage(1); // Reinicia la página actual al cambiar filtros
  }, [filters, documentos]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      nro: "",
      nombre: "",
      fecha: "",
      subcriterio: "",
    });
  };

  const handleSaveIdAndRedirect = (id) => {
    localStorage.setItem("documentId", id);
    navigate("/verresolucion");
  };

  const handleChangePage = (page) => {
    setCurrentPage(page); // Actualiza la página actual
  };

  const columns = [
    {
      title: "NRO:",
      dataIndex: "nrodoc",
      key: "nrodoc",
      width: 100,
    },
    {
      title: "Título:",
      dataIndex: "titulo",
      key: "titulo",
    },
    {
      title: "Fecha:",
      dataIndex: "fecha",
      key: "fecha",
      width: 150,
    },
    {
      title: "Enlace:",
      key: "enlace",
      width: 100,
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => handleSaveIdAndRedirect(record.nrodoc)}
          className="rounded-md"
        >
          Ver
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">
        Archivo General Universitario - UNSM
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <Input
          name="nro"
          placeholder="Filtrar por NRO"
          value={filters.nro}
          onChange={handleFilterChange}
          className="col-span-1"
        />
        <Input
          name="nombre"
          placeholder="Filtrar por Nombre de Documento"
          value={filters.nombre}
          onChange={handleFilterChange}
          className="col-span-1"
        />
        <Input
          name="fecha"
          placeholder="Filtrar por Fecha"
          value={filters.fecha}
          onChange={handleFilterChange}
          className="col-span-1"
        />
        <Button onClick={clearFilters} className="col-span-1">
          Limpiar Filtros
        </Button>
      </div>
      <Table
        dataSource={filteredDocumentos.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )}
        columns={columns}
        rowKey="nrodoc"
        className="custom-table"
        pagination={false}
      />
      <Pagination
        className="mt-4"
        current={currentPage}
        total={totalElements}
        pageSize={pageSize}
        onChange={handleChangePage}
        showSizeChanger={false}
        showQuickJumper={false}
      />
    </div>
  );
}
