import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Space,
  Typography,
  Card,
  message,
} from "antd";
import { z } from "zod";
import dayjs from "dayjs";
import { API_URL } from "../utils/ApiRuta";

const { Title } = Typography;
const { Option } = Select;

const documentSchema = z.object({
  nrodoc: z.string().min(1, "El número de documento es obligatorio"),
  titulo: z.string().min(1, "El título es obligatorio"),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  duracion: z
    .number({ invalid_type_error: "Debe ingresar un número" })
    .min(1, "La duración debe ser mayor a 0")
    .optional(),
  tipoResolucion: z.enum(["Permanente", "Temporal"], {
    required_error: "El tipo de resolución es obligatorio",
  }),
  link: z
    .string()
    .url("Debe ingresar un enlace válido")
    .min(1, "El link es obligatorio"),
});

const FormularioDocumento = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const usuario = localStorage.getItem("username");

  const [form] = Form.useForm();
  const [tipoResolucion, setTipoResolucion] = useState("");

  const handleSubmit = async (values) => {
    try {
      const parsedValues = {
        ...values,
        fecha: values.fecha.format("YYYY-MM-DD"),
        duracion:
          values.tipoResolucion === "Temporal"
            ? Number(values.duracion)
            : undefined,
      };

      documentSchema.parse(parsedValues);

      const formData = new FormData();
      formData.append("nrodoc", parsedValues.nrodoc);
      formData.append("titulo", parsedValues.titulo);
      formData.append("fecha", parsedValues.fecha);
      formData.append("tipoResolucion", parsedValues.tipoResolucion);
      formData.append(
        "estado",
        parsedValues.tipoResolucion === "Temporal" ? "Temporal" : "Permanente"
      );
      formData.append("duracion", parsedValues.duracion || "");
      formData.append("link", parsedValues.link);
      formData.append("usuario", usuario);

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
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          message.error(err.message);
        });
      } else {
        message.error(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="h-full">
      <Card style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Registro de Resolución
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            nrodoc: "",
            titulo: "",
            fecha: null,
            duracion: "",
            tipoResolucion: "",
            link: "",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Form.Item
              label="Número del Documento"
              name="nrodoc"
              rules={[{ required: true, message: "Debe ingresar el número" }]}
            >
              <Input placeholder="Ej. RES-2025-UNSM" />
            </Form.Item>

            <Form.Item
              label="Link del Documento"
              name="link"
              rules={[
                { required: true, message: "Debe ingresar el link" },
                { type: "url", message: "Ingrese un link válido" },
              ]}
            >
              <Input placeholder="https://ejemplo.com/documento.pdf" />
            </Form.Item>

            <Form.Item
              label="Título del Documento"
              name="titulo"
              rules={[{ required: true, message: "Debe ingresar el título" }]}
            >
              <Input placeholder="Título del documento" />
            </Form.Item>

            <Form.Item
              label="Fecha"
              name="fecha"
              rules={[{ required: true, message: "Debe ingresar una fecha" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Tipo de Resolución"
              name="tipoResolucion"
              rules={[{ required: true, message: "Debe seleccionar un tipo" }]}
            >
              <Select
                placeholder="Seleccione tipo"
                onChange={(value) => setTipoResolucion(value)}
              >
                <Option value="Permanente">Permanente</Option>
                <Option value="Temporal">Temporal</Option>
              </Select>
            </Form.Item>

            {tipoResolucion === "Temporal" && (
              <Form.Item
                label="Duración (meses)"
                name="duracion"
                rules={[
                  { required: true, message: "Debe ingresar la duración" },
                  {
                    pattern: /^\d+$/,
                    message: "La duración debe ser un número",
                  },
                ]}
              >
                <Input placeholder="Ej. 12" />
              </Form.Item>
            )}
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

export default FormularioDocumento;
