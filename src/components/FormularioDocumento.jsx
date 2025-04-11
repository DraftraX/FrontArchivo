import React, { useState, useEffect } from "react";
import "../styles/MultiStepForm.css";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  DatePicker,
  Upload,
  Space,
  Typography,
  Row,
  Col,
  Card,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { API_URL } from "../utils/ApiRuta";
import { z } from "zod";

const { Option } = Select;
const { Title } = Typography;

const documentSchema = z.object({
  nrodoc: z.string().nonempty("El número de documento es obligatorio"),
  titulo: z.string().nonempty("El título es obligatorio"),
  fecha: z.string().nonempty("La fecha es obligatoria"),
  duracion: z.number().min(1, "La duración debe ser mayor a 0").optional(),
  tipoResolucion: z.string().nonempty("El tipo de resolución es obligatorio"),
  link: z
    .string()
    .url("Debe ingresar un enlace válido")
    .nonempty("El link es obligatorio"), 
});

const FormularioDocumento = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [Request, setRequest] = useState({
    nrodoc: "",
    titulo: "",
    estado: "",
    fecha: "",
    duracion: 1,
    tipoResolucion: "",
    link: "",
  });

  const handleTipoResolucionChange = (e) => {
    const tipoResolucion = e.target.value;
    setRequest((prev) => ({ ...prev, tipoResolucion }));
  };

  const handleSubmit = async (values) => {
    try {
      
      const usuario = localStorage.getItem("username");

      const parsedValues = {
        ...values,
        fecha: values.fecha.format("YYYY-MM-DD"),
        duracion:
          Request.tipoResolucion === "Temporal" ? Number(values.duracion) : undefined,
        tipoResolucion: Request.tipoResolucion,
        link: Request.link,
      };
  
      documentSchema.parse(parsedValues);
  
      const formData = new FormData();
      formData.append("nrodoc", values.nrodoc);
      formData.append("titulo", values.titulo);
      formData.append("fecha", parsedValues.fecha);
      formData.append("tipoResolucion", parsedValues.tipoResolucion);
      if (parsedValues.tipoResolucion === "Temporal") {
        formData.append("duracion", parsedValues.duracion);
        formData.append("estado", "Temporal");
      } else {
        formData.append("estado", "Permanente");
      }

      formData.append("link", parsedValues.link);
      formData.append("usuario", usuario)

  
      const response = await fetch(API_URL + "/resolucion/nuevaresolucion", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (response.ok) {
        message.success("¡Documento creado con éxito!");
        navigate("/perfil");
      } else {
        message.error("¡Error al crear el documento!");
      }
    } catch (error) {
      if (error.errors) {
        error.errors.forEach((err) => {
          message.error(`¡Error al crear el documento! ${err.message}`);
        });
      } else {
        message.error(`¡Error al crear el documento! ${error.message}`);
      }
    }
  };

  return (
    <div className="h-full">
      <Card style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Formulario de Resolucion
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
                label="Número de Documento"
                name="nrodoc"
                rules={[
                  {
                    required: true,
                    message: "Debe ingresar su Número de documento",
                  },
                ]}
              >
                <Input placeholder="Número de Documento" />
              </Form.Item>

              <Form.Item
                label="Link del Documento"
                name="link"
                rules={[
                  {
                    required: true,
                    message: "Debe ingresar el link del documento",
                  },
                  {
                    type: "url",
                    message: "Debe ingresar un enlace válido",
                  },
                ]}
              >
                <Input
                  placeholder="Ingrese el enlace del documento"
                  value={Request.link}
                  onChange={(e) =>
                    setRequest((prev) => ({ ...prev, link: e.target.value }))
                  }
                />
              </Form.Item>
            </div>

            <div>
              <Form.Item
                label="Título"
                name="titulo"
                rules={[{ required: true, message: "Debe ingresar un título" }]}
              >
                <Input placeholder="Título" />
              </Form.Item>
              
              <Form.Item
                label="Fecha"
                name="fecha"
                rules={[{ required: true, message: "Debe ingresar una fecha" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </div>
          </div>

          <Form.Item
            label="Tipo de Resolución"
            name="tipoResolucion"
            rules={[
              {
                required: true,
                message: "Debe seleccionar un tipo de resolución",
              },
            ]}
          >
            <Radio.Group onChange={handleTipoResolucionChange}>
              <Row>
                <Col span={12}>
                  <Radio value="Permanente">Permanente</Radio>
                </Col>
                <Col span={12}>
                  <Radio value="Temporal">Temporal</Radio>
                </Col>
              </Row>
            </Radio.Group>
          </Form.Item>
          {Request.tipoResolucion === "Temporal" && (
            <Form.Item
              label="Duración (años)"
              name="duracion"
              rules={[
                { required: true, message: "Debe ingresar una duración" },
              ]}
            >
              <Input type="number" placeholder="Duración (años)" />
            </Form.Item>
          )}
          
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

export default FormularioDocumento;
