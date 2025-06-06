import React, { useState, useEffect } from "react";
import { Typography, Button, Modal, message, Select, Table, Tag, Space } from "antd";
import Navbar from "../../../components/Navbar/Navbar";
import { API_URL } from "../../../utils/ApiRuta";

const { Title } = Typography;
const { Option } = Select;

const Permisos = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargos, setCargos] = useState([
    { id: 2, nombre: "JEFE ARCHIVO" },
    { id: 3, nombre: "SECRETARIA" },
    { id: 4, nombre: "USUARIO" }
  ]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nuevoCargoId, setNuevoCargoId] = useState(null);

  // Cargar usuarios desde el backend
  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          message.error("No se encontró un token de autenticación");
          return;
        }
        
        const response = await fetch(`${API_URL}/usuario/usuarios`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          // Filtrar usuarios ADMINISTRADOR
          const filteredUsers = data.filter(user => user.cargoid !== "ADMINISTRADOR");
          setUsuarios(filteredUsers);
        } else {
          message.error("Error al obtener los usuarios");
        }
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        message.error("Error de conexión");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsuarios();
  }, []);

  // Función para abrir el modal de cambio de rol
  const handleCambiarRol = (usuario) => {
    setUsuarioSeleccionado(usuario);
    
    // Encontrar el ID del cargo actual
    const cargoActual = cargos.find(c => c.nombre === usuario.cargoid);
    setNuevoCargoId(cargoActual ? cargoActual.id : null);
    
    setModalVisible(true);
  };

  // Función para guardar el cambio de rol
  const handleGuardarCambio = async () => {
    if (!usuarioSeleccionado || !nuevoCargoId) {
      message.error("Selecciona un cargo válido");
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const cargoSeleccionado = cargos.find(c => c.id === nuevoCargoId);
      
      // Aquí harías la llamada al backend para actualizar el cargo
      // Este es un ejemplo, el endpoint y payload deben ajustarse a tu API
      const response = await fetch(`${API_URL}/usuario/actualizar-cargo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          usuarioId: usuarioSeleccionado.id,
          cargoId: nuevoCargoId,
          cargoNombre: cargoSeleccionado.nombre
        }),
      });
      
      if (response.ok) {
        // Actualizar la lista de usuarios localmente
        setUsuarios(usuarios.map(user => {
          if (user.id === usuarioSeleccionado.id) {
            return { ...user, cargoid: cargoSeleccionado.nombre };
          }
          return user;
        }));
        
        message.success(`Rol de ${usuarioSeleccionado.name} actualizado a ${cargoSeleccionado.nombre}`);
        setModalVisible(false);
      } else {
        message.error("Error al actualizar el rol del usuario");
      }
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
      message.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // Configuración de la tabla
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => `${record.name} ${record.lastname || ''}`,
    },
    {
      title: 'Dirección',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Cargo Actual',
      dataIndex: 'cargoid',
      key: 'cargoid',
      render: (text) => {
        let color = 'green';
        if (text === 'SECRETARIA') {
          color = 'blue';
        } else if (text === 'USUARIO') {
          color = 'gray';
        }
        return (
          <Tag color={color}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          onClick={() => handleCambiarRol(record)}
          className="bg-green-600 hover:bg-green-700"
        >
          Cambiar Rol
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <Title level={2} className="mb-6">Gestión de Roles de Usuarios</Title>
          
          <Table 
            columns={columns} 
            dataSource={usuarios}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            className="mb-6"
          />
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <Title level={4} className="text-gray-700">Información de Roles</Title>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-3 border rounded-lg">
                <Tag color="green" className="mb-2">JEFE ARCHIVO</Tag>
                <p className="text-sm text-gray-600">Gestión completa del archivo y su personal</p>
              </div>
              <div className="p-3 border rounded-lg">
                <Tag color="blue" className="mb-2">SECRETARIA</Tag>
                <p className="text-sm text-gray-600">Operaciones diarias y registro de documentos</p>
              </div>
              <div className="p-3 border rounded-lg">
                <Tag color="gray" className="mb-2">USUARIO</Tag>
                <p className="text-sm text-gray-600">Solo gestión personal, acceso básico</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Cambiar Rol de Usuario"
        open={modalVisible}
        onOk={handleGuardarCambio}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
      >
        {usuarioSeleccionado && (
          <div>
            <p className="mb-4">
              Cambiar el rol de <strong>{usuarioSeleccionado.name} {usuarioSeleccionado.lastname}</strong>
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol actual:
              </label>
              <Tag color={
                usuarioSeleccionado.cargoid === 'JEFE ARCHIVO' ? 'green' : 
                usuarioSeleccionado.cargoid === 'SECRETARIA' ? 'blue' : 'gray'
              }>
                {usuarioSeleccionado.cargoid}
              </Tag>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nuevo rol:
              </label>
              <Select
                style={{ width: '100%' }}
                value={nuevoCargoId}
                onChange={setNuevoCargoId}
              >
                {cargos.map(cargo => (
                  <Option key={cargo.id} value={cargo.id}>
                    {cargo.nombre}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Permisos;