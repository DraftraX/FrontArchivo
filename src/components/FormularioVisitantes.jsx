import React, { useState } from "react";
import "../styles/MultiStepForm.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Space,
  Typography,
  Card,
} from "antd";
import { API_URL } from "../utils/ApiRuta";
import { z } from "zod";

const { Title } = Typography;

// Define the document schema
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

      // Validate form data with schema
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
        Swal.fire("¡Éxito!", "¡Visita registrada con éxito!", "success").then(() =>
          navigate("/perfil")
        );
      } else {
        Swal.fire("Error", "¡Error al registrar la visita!", "error");
      }
    } catch (error) {
      if (error.errors) {
        error.errors.forEach((err) => {
          Swal.fire("Error", `¡Error al registrar la visita! ${err.message}`, "error");
        });
      } else {
        Swal.fire("Error", `¡Error al registrar la visita! ${error.message}`, "error");
      }
    }
  };

  return (
    <div className="h-full">
      <Card style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Registrar Visita
        </Title>
        <Form
          id="msform"
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={Request}
        >
          <div className="grid grid-flow-col-dense gap-4">
            <div>
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
            </div>
            <div>
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
            </div>
          </div>

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
          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "center" }}>
              <Button type="primary" htmlType="submit">
                Enviar
              </Button>
              <Button type="default" onClick={() => navigate("/perfil")}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default FormularioVisitantes;
