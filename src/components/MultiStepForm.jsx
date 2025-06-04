import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Steps,
  message,
  Typography,
  Card,
  Space,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/ApiRuta";

const { Step } = Steps;
const { Title } = Typography;
const { Option } = Select;

const cargosFijos = [
  { id: 1, nombre: "ADMINISTRADOR" },
  { id: 2, nombre: "JEFE ARCHIVO" },
  { id: 3, nombre: "SECRETARIA" },
  { id: 4, nombre: "USUARIO" },
];

const MultiStepForm = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const nextStep = async () => {
    try {
      if (step === 0) {
        const values = await form.validateFields([
          "fname",
          "lname",
          "dni",
          "address",
          "phone",
          "cargoid",
        ]);
        setFormData({ ...formData, ...values });
      } else if (step === 1) {
        const values = await form.validateFields(["email", "pass", "cpass"]);
        setFormData({ ...formData, ...values });
      }
      setStep(step + 1);
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleFinish = async (values) => {
    const finalFormData = { ...formData, ...values };
    const { fname, lname, dni, address, phone, email, pass, cargoid } =
      finalFormData;
    const UsuarioRequest = {
      name: fname,
      lastname: lname,
      address: address,
      cargoid: parseInt(cargoid),
      phone: phone,
      dni: dni,
      username: email,
      password: pass,
    };

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/usuario/nuevousuario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(UsuarioRequest),
      });

      if (response.ok) {
        message.success("¡Usuario creado con éxito!");
        navigate("/perfil");
      } else {
        if (response.status === 500) {
          message.error("El nombre de usuario ya está en uso.");
        } else {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          message.error("Hubo un problema al crear el usuario");
        }
      }
    } catch (error) {
      message.error("Hubo un problema al crear el usuario");
      console.error("Error al crear el usuario:", error);
    }
  };

  return (
    <div className="h-full flex justify-center pt-5">
      <Card style={{ maxWidth: 1000, width: "100%" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Registro de Nuevo Usuario
        </Title>

        <Steps current={step} className="mb-6">
          <Step title="Detalles Personales" />
          <Step title="Crear tu cuenta" />
        </Steps>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            fname: "",
            lname: "",
            address: "",
            email: "",
            pass: "",
            dni: "",
            cpass: "",
            phone: "",
            cargoid: "",
          }}
        >
          {step === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Form.Item
                name="fname"
                label="Nombre"
                rules={[
                  { required: true, message: "Por favor ingresa tu nombre" },
                ]}
              >
                <Input placeholder="Nombre" />
              </Form.Item>
              <Form.Item
                name="lname"
                label="Apellido"
                rules={[
                  { required: true, message: "Por favor ingresa tu apellido" },
                ]}
              >
                <Input placeholder="Apellido" />
              </Form.Item>
              <Form.Item
                name="dni"
                label="DNI"
                rules={[
                  { required: true, message: "Por favor ingresa tu DNI" },
                  { len: 8, message: "El DNI debe tener 8 dígitos" },
                ]}
              >
                <Input placeholder="DNI" />
              </Form.Item>
              <Form.Item
                name="address"
                label="Dirección"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa tu dirección",
                  },
                ]}
              >
                <Input placeholder="Dirección" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Teléfono"
                rules={[
                  { required: true, message: "Por favor ingresa tu teléfono" },
                  { min: 9, message: "Número de teléfono inválido" },
                ]}
              >
                <Input placeholder="Teléfono" />
              </Form.Item>
              <Form.Item
                name="cargoid"
                label="Tipo de Usuario"
                rules={[
                  {
                    required: true,
                    message: "Por favor selecciona un tipo de usuario",
                  },
                ]}
              >
                <Select placeholder="Seleccione tipo de usuario">
                  {cargosFijos.map((cargo) => (
                    <Option key={cargo.id} value={cargo.id}>
                      {cargo.nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Form.Item
                name="email"
                label="Correo Electrónico"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Por favor ingresa un correo electrónico válido",
                  },
                ]}
              >
                <Input placeholder="Correo Electrónico" />
              </Form.Item>
              <Form.Item
                name="pass"
                label="Contraseña"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa una contraseña",
                  },
                  {
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "Debe tener mayúscula, minúscula, número y carácter especial",
                  },
                ]}
              >
                <Input.Password placeholder="Contraseña" />
              </Form.Item>
              <Form.Item
                name="cpass"
                label="Confirmar Contraseña"
                dependencies={["pass"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Por favor confirma tu contraseña",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("pass") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Las contraseñas no coinciden")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirmar Contraseña" />
              </Form.Item>
            </div>
          )}

          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "center" }}>
              {step > 0 && (
                <Button className="mr-2" onClick={prevStep}>
                  Anterior
                </Button>
              )}
              {step === 0 && (
                <Button
                  danger
                  onClick={() => navigate("/perfil")}
                  className="mr-2"
                >
                  Cancelar
                </Button>
              )}
              {step < 1 && (
                <Button
                  type="primary"
                  onClick={nextStep}
                  className="bg-green-600 hover:bg-green-700 border-green-600"
                >
                  Siguiente
                </Button>
              )}
              {step === 1 && (
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-green-600 hover:bg-green-700 border-green-600"
                >
                  Enviar
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default MultiStepForm;
