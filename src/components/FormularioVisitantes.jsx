import React, { useState } from "react";
import "../styles/MultiStepForm.css";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Upload,
  Space,
  Typography,
  Card,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { API_URL } from "../utils/ApiRuta";
import { z } from "zod";

const { Title } = Typography;

// Define the document schema
const documentSchema = z.object({
  nombreapellido: z.string().nonempty("El nombre y apellido son obligatorios"),
  dni: z.string().nonempty("El DNI es obligatorio"),
  fechaexpedicion: z.string().nonempty("La fecha de expedición es obligatoria"),
  maestriadoctorado: z
    .string()
    .nonempty("El grado de maestría o doctorado es obligatorio"),
  idresolucion: z.string().nonempty("La resolución es obligatoria"),
  pdf: z.any().nullable(),
});

const FormularioVisitantes = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [Request, setRequest] = useState({
    nombreapellido: "",
    dni: "",
    fechaexpedicion: "",
    maestriadoctorado: "",
    idresolucion: "",
    pdf: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "pdf" && files) {
      setRequest({ ...Request, pdf: files[0] });
    } else {
      setRequest({ ...Request, [name]: value });
    }
  };

  const handleSubmit = async (values) => {
    try {
      const parsedValues = {
        ...values,
        fechaexpedicion: values.fechaexpedicion.format("YYYY-MM-DD"),
        pdf: Request.pdf,
      };

      documentSchema.parse(parsedValues);

      const formData = new FormData();
      formData.append("nombreapellido", values.nombreapellido);
      formData.append("dni", values.dni);
      formData.append("fechaexpedicion", parsedValues.fechaexpedicion);
      formData.append("maestriadoctorado", values.maestriadoctorado);
      formData.append("idresolucion", values.idresolucion);
      if (Request.pdf) {
        formData.append("pdf", Request.pdf);
      }

      console.log(values.maestriadoctorado);

      const response = await fetch(API_URL + "/posgrado/nuevoposgrado", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        message.success("¡Grado creado con éxito!");
        navigate("/perfil");
      } else {
        message.error("¡Error al crear el grado!");
      }
    } catch (error) {
      if (error.errors) {
        error.errors.forEach((err) => {
          message.error(`¡Error al crear el grado! ${err.message}`);
        });
      } else {
        message.error(`¡Error al crear el grado! ${error.message}`);
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
                label="Ocupacion"
                name="ocupacion"
                rules={[
                  { required: true, message: "Debe ingresar la ocupacion" },
                ]}
              >
                <Input placeholder="Ocupacion" />
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
            label="Correo o Telefono"
            name="correotelefono"
            rules={[
              {
                required: true,
                message: "Debe ingresar un correo o telefono",
              },
            ]}
          >
            <Input placeholder="Correo o telefono" />
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
