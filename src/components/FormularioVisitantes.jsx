import React, { useState } from "react";
import "../styles/MultiStepForm.css";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Space,
  Typography,
  Card,
  message,
} from "antd";
import { API_URL } from "../utils/ApiRuta";
import { z } from "zod";

const { Title } = Typography;

const documentSchema = z.object({
  visitante: z.string().nonempty("El nombre del visitante es obligatorio"),
  ocupacion: z.string().nonempty("La ocupación es obligatoria"),
  fecha: z.string().nonempty("La fecha de visita es obligatoria"),
  motivo: z.string().nonempty("El motivo es obligatorio"),
  correotelefono: z.string().nonempty("El correo o teléfono es obligatorio"),
});

const FormularioVisitantes = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [Request, setRequest] = useState({
    visitante: "",
    ocupacion: "",
    fecha: "",
    motivo: "",
    correotelefono: "",
  });

  const handleSubmit = async (values) => {
    try {
      const parsedValues = {
        ...values,
        fecha: values.fecha.format("YYYY-MM-DD"),
      };

      documentSchema.parse(parsedValues);

      const username = localStorage.getItem("username");

      const jsonData = {
        nombre: values.visitante,
        ocupacion: values.ocupacion,
        fecha: parsedValues.fecha,
        motivo: values.motivo,
        numerocorreo: values.correotelefono,
        username: username,
      };

      const response = await fetch(API_URL + "/visita/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jsonData),
      });

      if (response.ok) {
        message.success("¡Visita registrada con éxito!");
        navigate("/perfil");
      } else {
        message.error("¡Error al registrar la visita!");
      }
    } catch (error) {
      if (error.errors) {
        error.errors.forEach((err) => {
          message.error(`¡Error al registrar la visita! ${err.message}`);
        });
      } else {
        message.error(`¡Error al registrar la visita! ${error.message}`);
      }
    }
  };

  return (
    <div className="h-full">
      <Card style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Registrar Visita
        </Title>

        <Form onFinish={handleSubmit} layout="vertical" initialValues={Request}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Form.Item
              label="Visitante"
              name="visitante"
              rules={[
                {
                  required: true,
                  message: "Debe ingresar el nombre y apellido",
                },
              ]}
            >
              <Input placeholder="Visitante" />
            </Form.Item>

            <Form.Item
              label="Ocupación"
              name="ocupacion"
              rules={[
                { required: true, message: "Debe ingresar la ocupación" },
              ]}
            >
              <Input placeholder="Ocupación" />
            </Form.Item>

            <Form.Item
              label="Fecha de Visita"
              name="fecha"
              rules={[
                {
                  required: true,
                  message: "Debe ingresar una fecha de visita",
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Motivo"
              name="motivo"
              rules={[
                {
                  required: true,
                  message: "Debe ingresar un motivo de visita",
                },
              ]}
            >
              <Input placeholder="Motivo" />
            </Form.Item>

            <Form.Item
              label="Correo o Teléfono"
              name="correotelefono"
              rules={[
                {
                  required: true,
                  message: "Debe ingresar un correo o teléfono",
                },
              ]}
            >
              <Input placeholder="Correo o teléfono" />
            </Form.Item>
          </div>

          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "center" }}>
              <Button type="primary" htmlType="submit">
                Enviar
              </Button>
              <Button onClick={() => navigate("/perfil")}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default FormularioVisitantes;
