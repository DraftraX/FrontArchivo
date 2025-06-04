import { useState } from "react";
import { Form, Input, Button, Steps, message, Typography, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../utils/ApiRuta";

const { Step } = Steps;
const { Title } = Typography;

const CrearUsuarioDesauth = () => {
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
      cargoid: 4,
      phone: phone,
      dni: dni,
      username: email,
      password: pass,
    };

    try {
      const response = await fetch(`${API_URL}/usuario/nuevousuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(UsuarioRequest),
      });

      let data = null;
      try {
        data = await response.json();
        console.log("Respuesta backend:", data);
      } catch (error) {
        console.log("Respuesta sin contenido JSON.");
      }

      if (response.ok) {
        message.success(
          "¡Usuario creado con éxito! Serás redirigido al login."
        );
        navigate("/login");
      } else {
        if (response.status === 500) {
          message.error("El nombre de usuario ya está en uso.");
        } else {
          message.error("Hubo un problema al crear el usuario");
        }
      }
    } catch (error) {
      message.error("Hubo un problema al crear el usuario");
      console.error("Error al crear el usuario:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-500 px-4 py-10">
      <div className="w-full max-w-8xl p-6 bg-white rounded-2xl shadow-2xl grid grid-cols-[2fr_1fr]">
        <div>
          <h1 className="text-2xl font-bold text-center text-green-700">
            Registro de Nuevo Usuario
          </h1>
          <div className="flex flex-col gap-8">
            <Steps
              current={step}
              items={[
                { title: "Detalles Personales" },
                { title: "Crear tu cuenta" },
              ]}
            />

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
                // <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                //   <Form.Item
                //     name="fname"
                //     label="Nombre"
                //     rules={[
                //       {
                //         required: true,
                //         message: "Por favor ingresa tu nombre",
                //       },
                //     ]}
                //   >
                //     <Input
                //       placeholder="Nombre"
                //       className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                //     />
                //   </Form.Item>
                //   <Form.Item
                //     name="lname"
                //     label="Apellido"
                //     rules={[
                //       {
                //         required: true,
                //         message: "Por favor ingresa tu apellido",
                //       },
                //     ]}
                //   >
                //     <Input
                //       placeholder="Apellido"
                //       className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                //     />
                //   </Form.Item>
                //   <Form.Item
                //     name="dni"
                //     label="DNI"
                //     rules={[
                //       { required: true, message: "Por favor ingresa tu DNI" },
                //       { len: 8, message: "El DNI debe tener 8 dígitos" },
                //     ]}
                //   >
                //     <Input
                //       placeholder="DNI"
                //       className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                //     />
                //   </Form.Item>
                //   <Form.Item
                //     name="address"
                //     label="Dirección"
                //     rules={[
                //       {
                //         required: true,
                //         message: "Por favor ingresa tu dirección",
                //       },
                //     ]}
                //   >
                //     <Input
                //       placeholder="Dirección"
                //       className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                //     />
                //   </Form.Item>
                //   <Form.Item
                //     name="phone"
                //     label="Teléfono"
                //     rules={[
                //       {
                //         required: true,
                //         message: "Por favor ingresa tu teléfono",
                //       },
                //       { min: 9, message: "Número de teléfono inválido" },
                //     ]}
                //   >
                //     <Input
                //       placeholder="Teléfono"
                //       className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                //     />
                //   </Form.Item>
                // </div>
                <div className="grid grid-cols-1 gap-6 mb-8">
                  <Form.Item
                    name="email"
                    label="Correo Electrónico"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message:
                          "Por favor ingresa un correo electrónico válido",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Correo Electrónico"
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                    />
                    <a href="">Validar correo Electronico</a>
                  </Form.Item>
                </div>
              )}

              {step === 1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
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
                    <Input
                      placeholder="Nombre"
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                    />
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
                    <Input
                      placeholder="Apellido"
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                    />
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
                    <Input
                      placeholder="Dirección"
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                    />
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
                    <Input.Password
                      placeholder="Contraseña"
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                    />
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
                    <Input.Password
                      placeholder="Confirmar Contraseña"
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                    />
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
                      onClick={() => navigate("/login")}
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
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img
            src="https://admision.unsm.edu.pe/ADMISI%C3%93N%20WEB%20_%20UNSM_files/Logo.png"
            alt="Archivero UNSM"
            className="w-48 md:w-96"
          />
        </div>
      </div>
    </div>
  );
};

export default CrearUsuarioDesauth;
