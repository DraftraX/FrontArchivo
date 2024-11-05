import React, { useState } from "react";
import { Typography, Checkbox, Button, Modal, message, Select } from "antd";
import Navbar from "../../../components/Navbar/Navbar";

const { Title } = Typography;
const { Option } = Select;

const Permisos = () => {
  const [modulos, setModulos] = useState([
    {
      id: 1,
      nombre: "Usuarios",
      submodulos: ["Crear"],
    },
    {
      id: 2,
      nombre: "Resoluciones",
      submodulos: ["Registrar", "Visualizar", "Filtrar"],
    },
    { id: 3, nombre: "Visitantes", submodulos: ["Registrar"] },
    { id: 4, nombre: "Reportes", submodulos: ["Visualizar", "Exportar"] },
  ]);
  const [permisos, setPermisos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);
  const [perfilesSeleccionados, setPerfilesSeleccionados] = useState([]);

  const handleGuardarPermisos = () => {
    // Lógica para guardar los permisos
    message.success("Permisos guardados exitosamente");
    setModalVisible(false);
  };

  const handleSeleccionModulo = (moduloId) => {
    const moduloIndex = modulos.findIndex((modulo) => modulo.id === moduloId);
    const submodulos = modulos[moduloIndex].submodulos;
    const nuevosPermisos = [...permisos];

    if (nuevosPermisos.includes(moduloId)) {
      // Si el módulo ya está seleccionado, lo eliminamos
      nuevosPermisos.splice(nuevosPermisos.indexOf(moduloId), 1);
      submodulos.forEach((submodulo) => {
        nuevosPermisos.splice(nuevosPermisos.indexOf(submodulo), 1);
      });
    } else {
      // Si el módulo no está seleccionado, lo agregamos y agregamos sus submódulos
      nuevosPermisos.push(moduloId);
      submodulos.forEach((submodulo) => {
        if (!nuevosPermisos.includes(submodulo)) {
          nuevosPermisos.push(submodulo);
        }
      });
    }

    setPermisos(nuevosPermisos);
  };

  const handleSeleccionSubmodulo = (submodulo) => {
    const nuevosPermisos = [...permisos];
    if (nuevosPermisos.includes(submodulo)) {
      nuevosPermisos.splice(nuevosPermisos.indexOf(submodulo), 1);
    } else {
      nuevosPermisos.push(submodulo);
    }
    setPermisos(nuevosPermisos);
  };

  const handleSeleccionUsuario = (usuarios) => {
    setUsuariosSeleccionados(usuarios);
  };

  const handleSeleccionPerfil = (perfiles) => {
    setPerfilesSeleccionados(perfiles);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <Title level={2}>Asignar Permisos</Title>
          <div className="mb-4">
            <Select
              mode="multiple"
              placeholder="Seleccionar Usuarios"
              style={{ width: "100%" }}
              onChange={handleSeleccionUsuario}
              value={usuariosSeleccionados}
            >
              <Option key="usuario1">Usuario 1</Option>
              <Option key="usuario2">Usuario 2</Option>
              <Option key="usuario3">Usuario 3</Option>
            </Select>
          </div>
          <div className="mb-4">
            <Select
              mode="multiple"
              placeholder="Seleccionar Perfiles"
              style={{ width: "100%" }}
              onChange={handleSeleccionPerfil}
              value={perfilesSeleccionados}
            >
              <Option key="perfil1">Perfil 1</Option>
              <Option key="perfil2">Perfil 2</Option>
              <Option key="perfil3">Perfil 3</Option>
            </Select>
          </div>
          {modulos.map((modulo) => (
            <div key={modulo.id} className="mb-4">
              <Checkbox
                onChange={() => handleSeleccionModulo(modulo.id)}
                checked={permisos.includes(modulo.id)}
              >
                {modulo.nombre}
              </Checkbox>
              <div className="ml-8">
                {modulo.submodulos.map((submodulo, index) => (
                  <div key={index} className="ml-4">
                    <Checkbox
                      onChange={() => handleSeleccionSubmodulo(submodulo)}
                      checked={permisos.includes(submodulo)}
                    >
                      {submodulo}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Button type="primary" onClick={() => setModalVisible(true)}>
            Guardar Permisos
          </Button>
        </div>
      </div>

      <Modal
        title="Confirmación"
        visible={modalVisible}
        onOk={handleGuardarPermisos}
        onCancel={() => setModalVisible(false)}
      >
        <p>¿Está seguro que desea guardar los permisos seleccionados?</p>
      </Modal>
    </div>
  );
};

export default Permisos;
