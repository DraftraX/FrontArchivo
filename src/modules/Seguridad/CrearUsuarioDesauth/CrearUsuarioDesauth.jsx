import { useState } from "react";
import { Form, Input, Button, Steps, message, Typography, Space, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../utils/ApiRuta";

const { Step } = Steps;
const { Title } = Typography;

const CrearUsuarioDesauth = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  // Estados para verificación de correo
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

  // Función para verificar si el correo ya existe
  const checkIfEmailExists = async (email) => {
    try {
      // En lugar de usar el endpoint existente, omitimos esta verificación
      // para permitir que el usuario intente registrarse directamente
      // El backend ya manejará el caso de correo duplicado al crear el usuario
      return false;
    } catch (error) {
      return false;
    }
  };

  const validateEmail = async () => {
    try {
      await form.validateFields(["email"]);
      const email = form.getFieldValue("email");
      
      // Validar que sea un correo de Gmail
      if (!email.endsWith("@gmail.com")) {
        message.error("Solo se permiten correos de Gmail");
        return;
      }

      setIsVerifying(true);
      
      // Verificar si el email ya existe
      const emailExists = await checkIfEmailExists(email);
      
      if (emailExists) {
        setIsVerifying(false);
        message.error("Este correo ya está registrado. Intenta iniciar sesión o recuperar tu contraseña.");
        return;
      }
      
      // Generar código aleatorio de 6 dígitos
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setSentCode(generatedCode);
      
      try {
        // Conexión real con el backend para enviar el código
        console.log("Enviando código:", generatedCode, "a", email);
        
        const response = await fetch(`${API_URL}/verificacion/enviar-codigo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: generatedCode }),
        });
        
        if (response.ok) {
          setIsVerifying(false);
          setIsCodeSent(true);
          message.success(`Código de verificación enviado a ${email}`);
        } else {
          setIsVerifying(false);
          message.error("Error al enviar el código de verificación");
        }
      } catch (error) {
        setIsVerifying(false);
        message.error("Error al enviar el código de verificación");
        console.error("Error:", error);
      }
    } catch (error) {
      console.error("Error de validación:", error);
    }
  };

  const verifyCode = () => {
    if (verificationCode === sentCode) {
      setEmailVerified(true);
      message.success("Correo verificado correctamente");
    } else {
      message.error("Código de verificación incorrecto");
    }
  };

  const nextStep = async () => {
    try {
      if (step === 0) {
        // Verificar que el correo esté validado antes de continuar
        if (!emailVerified) {
          message.error("Debes verificar tu correo electrónico antes de continuar");
          return;
        }
        
        const values = await form.validateFields(["email"]);
        setFormData({ ...formData, ...values });
      } else if (step === 1) {
        const values = await form.validateFields([
          "fname",
          "lname",
          "address",
          "pass",
          "cpass"
        ]);
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
    const { fname, lname, address, email, pass } = finalFormData;

    const UsuarioRequest = {
      name: fname,
      lastname: lname,
      address: address,
      cargoid: 4, // Usando cargo ID 4 como se requiere
      phone: "000000000", // Este valor debería ser proporcionado en el paso 2
      dni: "00000000", // Este valor debería ser proporcionado en el paso 2
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
          const errorText = data && data.message ? data.message : "";
          if (errorText.includes("Duplicate") || errorText.includes("ya está en uso")) {
            message.error("Este correo ya está registrado. Intenta iniciar sesión.");
          } else if (errorText.includes("Cargo no encontrado")) {
            message.error("Error en la configuración del sistema. Por favor contacta al administrador.");
          } else {
            message.error("Hubo un problema al crear el usuario");
          }
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
                      {
                        pattern: /@gmail\.com$/,
                        message: "Solo se permiten correos de Gmail"
                      }
                    ]}
                  >
                    <Input
                      placeholder="Correo Electrónico"
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                      disabled={isCodeSent}
                    />
                  </Form.Item>
                  
                  <div className="flex items-center space-x-4">
                    <Button 
                      onClick={validateEmail} 
                      loading={isVerifying}
                      disabled={isCodeSent && emailVerified}
                      className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                    >
                      {isCodeSent ? "Reenviar código" : "Validar correo"}
                    </Button>
                    
                    {emailVerified && (
                      <span className="text-green-600 font-medium">✓ Correo verificado</span>
                    )}
                  </div>
                  
                  {isCodeSent && !emailVerified && (
                    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                      <h3 className="font-medium mb-2">Verificación de correo</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Hemos enviado un código de 6 dígitos a tu correo. 
                        Introdúcelo a continuación para verificar tu cuenta.
                      </p>
                      <div className="flex items-center space-x-4">
                        <Input
                          placeholder="Código de verificación"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          maxLength={6}
                          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                        />
                        <Button onClick={verifyCode}>Verificar</Button>
                      </div>
                    </div>
                  )}
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
                      disabled={!emailVerified}
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