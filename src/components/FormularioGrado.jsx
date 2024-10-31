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
import { z } from "zod";

const { Title } = Typography;

// Define the document schema
const documentSchema = z.object({
  nombreapellido: z.string().nonempty("El nombre y apellido son obligatorios"),
  dni: z.string().nonempty("El DNI es obligatorio"),
  fechaexpedicion: z.string().nonempty("La fecha de expedición es obligatoria"),
  facultadescuela: z.string().nonempty("La facultad o escuela es obligatoria"),
  gradotitulo: z.string().nonempty("El grado o título es obligatorio"),
  idresolucion: z.string().nonempty("La resolución es obligatoria"),
  pdf: z.any().nullable(),
});

const FormularioGrado = () => {
  const navigate = useNavigate();

  const [Request, setRequest] = useState({
    nombreapellido: "",
    dni: "",
    fechaexpedicion: "",
    facultadescuela: "",
    gradotitulo: "",
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

      message.success("¡Formulario completado con éxito!");
      console.log("Datos de ejemplo enviados: ", parsedValues);

      navigate("/perfil");
    } catch (error) {
      if (error.errors) {
        error.errors.forEach((err) => {
          message.error(`¡Error en el formulario! ${err.message}`);
        });
      } else {
        message.error(`¡Error en el formulario! ${error.message}`);
      }
    }
  };

  return (
    <div className="h-full">
      <Card style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Formulario de Grado
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
                label="Nombre y Apellido"
                name="nombreapellido"
                rules={[
                  {
                    required: true,
                    message: "Debe ingresar el nombre y apellido",
                  },
                ]}
              >
                <Input placeholder="Nombre y Apellido" />
              </Form.Item>
              <Form.Item
                label="DNI"
                name="dni"
                rules={[{ required: true, message: "Debe ingresar el DNI" }]}
              >
                <Input placeholder="DNI" />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Fecha de Expedición"
                name="fechaexpedicion"
                rules={[
                  {
                    required: true,
                    message: "Debe ingresar una fecha de expedición",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Facultad o Escuela"
                name="facultadescuela"
                rules={[
                  {
                    required: true,
                    message: "Debe ingresar la facultad o escuela",
                  },
                ]}
              >
                <Input placeholder="Facultad o Escuela" />
              </Form.Item>
            </div>
          </div>

          <Form.Item
            label="Grado o Título"
            name="gradotitulo"
            rules={[
              {
                required: true,
                message: "Debe ingresar el grado o título",
              },
            ]}
          >
            <Input placeholder="Grado o Título" />
          </Form.Item>
          <Form.Item
            label="Resolución"
            name="idresolucion"
            rules={[
              {
                required: true,
                message: "Debe ingresar una resolución",
              },
            ]}
          >
            <Input placeholder="Resolución" />
          </Form.Item>
          <Form.Item label="PDF" name="pdf">
            <Upload
              accept="application/pdf"
              beforeUpload={(file) => {
                setRequest({ ...Request, pdf: file });
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Subir PDF</Button>
            </Upload>
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

export default FormularioGrado;
