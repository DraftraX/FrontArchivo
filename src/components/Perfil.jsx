import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Avatar,
  Typography,
  Row,
  Col,
  Space,
  Divider,
  Descriptions,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const Perfil = () => {
  const navigate = useNavigate();

  // Simulando el token y el nombre de usuario
  const token = "simulatedToken";
  const username = "simulatedUser";

  // Datos de prueba
  const [userData, setUserData] = useState({
    id: "1",
    name: "Eduardo Diego",
    lastname: "Sanchez Vidaurre",
    address: "Jr. Los Pinos 1223, Lima",
    phone: "+51 929 455 391",
    fotoPerfil:
      "https://scontent.flim19-1.fna.fbcdn.net/v/t1.18169-9/15977424_1407659015944818_4808128750698341533_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=53a332&_nc_eui2=AeEYEjNjdHNWKpcPLyfkZ3IX0zt4U9LkBfbTO3hT0uQF9tyr7ejH7aHBWo8s69-fzzbV-HNy3ndpTenxu8tXhuMZ&_nc_ohc=CtbRpmVU4_cQ7kNvgEmFcZL&_nc_zt=23&_nc_ht=scontent.flim19-1.fna&oh=00_AYC_y1M8JEPDqvIOjG6j9_eLcVA31i2nTJjXZB7eyNGWug&oe=673F3DB0",
    cargoid: "Desarrollador Web",
  });

  // El useEffect se mantiene, pero ahora no hace la llamada a la API.
  useEffect(() => {
    // Aquí podrías hacer algo cuando el componente se monte
    // Por ejemplo, podrías configurar los datos del usuario desde un archivo local o similar.
    // setUserData(mockUserData); // Aquí podrías asignar datos simulados si lo deseas
  }, []);

  return (
    <div style={{ backgroundColor: "#f0f2f5", padding: "40px" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card
            style={{
              textAlign: "center",
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
            }}
          >
            <Avatar
              size={100}
              icon={<UserOutlined />}
              src={userData.fotoPerfil}
              style={{ marginBottom: "16px" }}
            />
            <Title level={4}>{userData.name}</Title>
            <Paragraph type="secondary">{userData.cargoid}</Paragraph>
            <Divider />
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                block
                onClick={() => navigate("/createresolucion")}
              >
                Agregar Resoluciones
              </Button>
              <Button
                type="default"
                icon={<IdcardOutlined />}
                block
                onClick={() => navigate("/creategrado")}
              >
                Agregar Grados y Titulos
              </Button>
              <Button
                type="default"
                icon={<IdcardOutlined />}
                block
                onClick={() => navigate("/createposgrado")}
              >
                Agregar Maestria y Doctorado
              </Button>
              <Button
                type="dashed"
                icon={<SettingOutlined />}
                block
                onClick={() => navigate("/create")}
              >
                Crear usuario
              </Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card
            style={{
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
            }}
          >
            <Descriptions title="Información del Usuario" bordered>
              <Descriptions.Item label="Nombre" span={3}>
                <Space>
                  <UserOutlined />
                  <Paragraph>{userData.name}</Paragraph>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Apellido" span={3}>
                <Space>
                  <UserOutlined />
                  <Paragraph>{userData.lastname}</Paragraph>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Teléfono" span={3}>
                <Space>
                  <PhoneOutlined />
                  <Paragraph>{userData.phone}</Paragraph>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Dirección" span={3}>
                <Space>
                  <HomeOutlined />
                  <Paragraph>{userData.address}</Paragraph>
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Perfil;
