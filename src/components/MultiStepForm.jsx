import React, { useState } from "react";
import { Form, Input, Button, Steps, message } from "antd";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/ApiRuta";
import Swal from "sweetalert2";
const { Step } = Steps;

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
        ]);
        setFormData({ ...formData, ...values });
      } else if (step === 1) {
        const values = await form.validateFields(["email", "pass", "cpass"]);
        setFormData({ ...formData, ...values });
      }
      setStep(step + 1);
    } catch (error) {
      // Handle validation error
      console.error("Validation error:", error);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleFinish = async (values) => {
    const finalFormData = { ...formData, ...values };
    const { fname, lname, dni, address, phone, email, pass } = finalFormData;
    const UsuarioRequest = {
      name: fname,
      lastname: lname,
      address: address,
      cargoid: 1,
      phone: phone,
      dni: dni,
      username: email,
      password: pass,
    };

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(API_URL + "/usuario/nuevousuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(UsuarioRequest),
      });

      if (response.ok) {
        Swal.fire("Success!", "¡Usuario creado con éxito!", "success");
        navigate("/perfil");
      } else {
        if (response.status === 500) 
        {
          Swal.fire("Error", "El nombre de usuario ya está en uso.", "error");
        } 
        else
        {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          Swal.fire("Error", "Hubo un problema al crear el usuario", "error");
        }
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al crear el usuario", "error");
      console.error("Error al crear el usuario:", error);
    }
  };

  return (
    <div className="flex justify-center h-screen pt-5">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
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
          }}
        >
          {step === 0 && (
            <div className="mb-4">
              <Form.Item
                name="fname"
                label="Nombre"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa tu nombre",
                  },
                ]}
              >
                <Input placeholder="Nombre" />
              </Form.Item>
              <Form.Item
                name="lname"
                label="Apellido"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa tu apellido",
                  },
                ]}
              >
                <Input placeholder="Apellido" />
              </Form.Item>
              <Form.Item
                name="dni"
                label="DNI"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa tu DNI",
                  },
                  {
                    len: 8,
                    message: "El DNI debe tener 8 dígitos",
                  },
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
                  {
                    required: true,
                    message: "Por favor ingresa tu teléfono",
                  },
                  {
                    min: 9,
                    message: "Número de teléfono inválido",
                  },
                ]}
              >
                <Input placeholder="Teléfono" />
              </Form.Item>
            </div>
          )}
          {step === 1 && (
            <div className="mb-4">
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
                      "La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial",
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
          <Form.Item className="text-right">
            {step > 0 && (
              <Button onClick={prevStep} className="mr-2">
                Anterior
              </Button>
            )}
            {step < 1 && (
              <Button type="primary" onClick={nextStep}>
                Siguiente
              </Button>
            )}
            {step === 1 && (
              <Button type="primary" htmlType="submit">
                Enviar
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default MultiStepForm;
