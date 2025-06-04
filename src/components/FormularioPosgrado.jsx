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
import dayjs from "dayjs";

const { Title } = Typography;

// Schema para validación con Zod
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

const FormularioPosgrado = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form] = Form.useForm();
  const [file, setFile] = useState(null);

  const handleSubmit = async (values) => {
    try {
      if (!file) {
        message.error("Debe subir un archivo PDF.");
        return;
      }

      const parsedValues = {
        ...values,
        fechaexpedicion: values.fechaexpedicion.format("YYYY-MM-DD"),
        pdf: file,
      };

      documentSchema.parse(parsedValues);

      const formData = new FormData();
      formData.append("nombreapellido", parsedValues.nombreapellido);
      formData.append("dni", parsedValues.dni);
      formData.append("fechaexpedicion", parsedValues.fechaexpedicion);
      formData.append("maestriadoctorado", parsedValues.maestriadoctorado);
      formData.append("idresolucion", parsedValues.idresolucion);
      formData.append("pdf", parsedValues.pdf);

      const response = await fetch(`${API_URL}/posgrado/nuevoposgrado`, {
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
        error.errors.forEach((err) => message.error(`Error: ${err.message}`));
      } else {
        message.error(`Error inesperado: ${error.message}`);
      }
    }
  };

  return (
    <div className="h-full">
      <Card style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Formulario de Posgrado
        </Title>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{
            nombreapellido: "",
            dni: "",
            fechaexpedicion: null,
            maestriadoctorado: "",
            idresolucion: "",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

            <Form.Item
              label="Fecha de Expedición"
              name="fechaexpedicion"
              rules={[{ required: true, message: "Debe ingresar una fecha" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Grado de Maestría o Doctorado"
              name="maestriadoctorado"
              rules={[{ required: true, message: "Debe ingresar el grado" }]}
            >
              <Input placeholder="Maestría o Doctorado" />
            </Form.Item>

            <Form.Item
              label="Resolución"
              name="idresolucion"
              rules={[
                { required: true, message: "Debe ingresar la resolución" },
              ]}
            >
              <Input placeholder="Resolución" />
            </Form.Item>

            <Form.Item label="PDF">
              <Upload
                accept="application/pdf"
                beforeUpload={(file) => {
                  setFile(file);
                  return false;
                }}
                fileList={file ? [file] : []}
                onRemove={() => setFile(null)}
              >
                <Button icon={<UploadOutlined />}>Subir PDF</Button>
              </Upload>
            </Form.Item>
          </div>

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

export default FormularioPosgrado;
