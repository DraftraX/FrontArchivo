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
  idtipocriterio: z.number().min(1, "El criterio es obligatorio"),
  pdf: z.any().nullable(),
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
    idtipocriterio: 0,
    pdf: null,
  });

  const [criterios, setCriterios] = useState([]);
  const [subCriterios, setSubCriterios] = useState([]);
  const [subSubCriterios, setSubSubCriterios] = useState([]);
  const [selectedCriterio, setSelectedCriterio] = useState(null);
  const [selectedSubCriterio, setSelectedSubCriterio] = useState(null);
  const [selectedSubSubCriterio, setSelectedSubSubCriterio] = useState(null);

  useEffect(() => {
    const fetchCriterios = async () => {
      try {
        const response = await fetch(
          API_URL + "/tipocriterio/vercriterio/tipocriterios",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCriterios(data.slice(0, 5));
        } else {
          console.error("Error al obtener los criterios");
        }
      } catch (error) {
        console.error("Error al obtener los criterios:", error);
      }
    };

    fetchCriterios();
  }, [token]);

  const fetchSubCriterios = async (mainid) => {
    try {
      const response = await fetch(
        `${API_URL}/tipocriterio/vercriterio/criteriomayor/${mainid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSubCriterios(data);
        setSubSubCriterios([]);
        setSelectedSubCriterio(null);
        setRequest((prev) => ({ ...prev, idtipocriterio: mainid }));
      } else {
        console.error("Error al obtener los sub-criterios");
      }
    } catch (error) {
      console.error("Error al obtener los sub-criterios:", error);
    }
  };

  const fetchSubSubCriterios = async (mainid) => {
    try {
      const response = await fetch(
        `${API_URL}/tipocriterio/vercriterio/criteriomayor/${mainid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSubSubCriterios(data);
        setRequest((prev) => ({ ...prev, idtipocriterio: mainid }));
      } else {
        console.error("Error al obtener los sub-subcriterios");
      }
    } catch (error) {
      console.error("Error al obtener los sub-subcriterios:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === "pdf" && files) {
      setRequest({ ...Request, pdf: files[0] });
    } else if (type === "checkbox") {
      setRequest({ ...Request, [name]: checked ? value : "" });
    } else {
      setRequest({ ...Request, [name]: value });
    }
  };

  const handleTipoResolucionChange = (e) => {
    const tipoResolucion = e.target.value;
    setRequest((prev) => ({ ...prev, tipoResolucion }));
  };

  const handleCriterioChange = (value) => {
    setSelectedCriterio(value);
    fetchSubCriterios(value);
  };

  const handleSubCriterioChange = (value) => {
    setSelectedSubCriterio(value);
    fetchSubSubCriterios(value);
  };

  const handleSubSubCriterioChange = (value) => {
    setSelectedSubSubCriterio(value);
  };

  const handleSubmit = async (values) => {
    try {
      const idtipocriterio =
        subSubCriterios.length > 0
          ? selectedSubSubCriterio
          : selectedSubCriterio;
      console.log(idtipocriterio);
      if (!idtipocriterio) {
        message.error("Debe seleccionar un criterio válido.");
        return;
      }

      const parsedValues = {
        ...values,
        fecha: values.fecha.format("YYYY-MM-DD"),
        duracion:
          Request.tipoResolucion === "Temporal"
            ? Number(values.duracion)
            : undefined,
        pdf: Request.pdf,
        tipoResolucion: Request.tipoResolucion,
        idtipocriterio,
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
      formData.append("idtipocriterio", parsedValues.idtipocriterio);
      if (Request.pdf) {
        formData.append("pdf", Request.pdf);
      }

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
          <Form.Item
            label="Tipo de Criterio"
            name="idtipocriterio"
            rules={[
              { required: true, message: "Debe seleccionar un criterio" },
            ]}
          >
            <Select
              placeholder="Seleccione Tipo de Criterio"
              onChange={handleCriterioChange}
            >
              <Option value="">Seleccione Tipo de Criterio</Option>
              {criterios.map((criterio) => (
                <Option key={criterio.mainid} value={criterio.mainid}>
                  {criterio.criteryname}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {subCriterios.length > 0 && (
            <Form.Item
              label="Sub-Criterio"
              name="subcriterio"
              rules={[
                { required: true, message: "Debe seleccionar un sub-criterio" },
              ]}
            >
              <Select
                placeholder="Seleccione Sub-Criterio"
                onChange={handleSubCriterioChange}
              >
                {subCriterios.map((subCriterio) => (
                  <Option key={subCriterio.mainid} value={subCriterio.mainid}>
                    {subCriterio.criteryname}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          {subSubCriterios.length > 0 && (
            <Form.Item
              label="Sub-Sub-Criterio"
              name="subsubcriterio"
              rules={[
                {
                  required: true,
                  message: "Debe seleccionar un sub-subcriterio",
                },
              ]}
            >
              <Select
                placeholder="Seleccione Sub-aSub-Criterio"
                onChange={handleSubSubCriterioChange}
              >
                {subSubCriterios.map((subSubCriterio) => (
                  <Option
                    key={subSubCriterio.mainid}
                    value={subSubCriterio.mainid}
                  >
                    {subSubCriterio.criteryname}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
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

export default FormularioDocumento;
