import React, { useState } from "react";
import { Form, Input, Button, Card, Row, Col, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import Swal from "sweetalert2";
import { API_URL } from "../../../../url";

const loginSchema = z.object({
  username: z
    .string()
    .email("Debe ingresar un correo válido")
    .min(1, "Ingrese su Usuario"),
  password: z.string().min(1, "Ingrese su contraseña"),
});

export default function IniciarSesion() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChangeUsername = (value) => {
    setUsername(value);
    if (errors.username) {
      setErrors((prevErrors) => ({ ...prevErrors, username: null }));
    }
  };

  const handleChangePassword = (value) => {
    setPassword(value);
    if (errors.password) {
      setErrors((prevErrors) => ({ ...prevErrors, password: null }));
    }
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (values) => {
    try {
      loginSchema.parse(values);
      setErrors({});

      if (!captchaToken) {
        message.error("Por favor, complete el CAPTCHA.");
        return;
      }

      const data = {
        username: values.username,
        password: values.password,
        recaptchaResponse: captchaToken,
      };

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Respuesta del servidor:", data);

        // Almacenar el token en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);

        // Mostrar mensaje de éxito con SweetAlert2
        Swal.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
          text: "Bienvenido al sistema",
          confirmButtonText: "Continuar",
        }).then(() => {
          // Redirigir después de cerrar SweetAlert2
          navigate("/paginaprincipal");
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: errorData.message || "Error al iniciar sesión",
          confirmButtonText: "Intentar de nuevo",
        });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: "Ha ocurrido un error. Inténtelo nuevamente.",
        confirmButtonText: "Cerrar",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-500">
      <Card className="bg-white shadow-md rounded-lg overflow-hidden p-6 w-full max-w-4xl">
        <h2 className="text-xl font-bold text-center text-gray-700 mb-4">
          ARCHIVERO CENTRAL
        </h2>
        <Row gutter={16}>
          <Col span={12}>
            <Form onFinish={handleSubmit} layout="vertical">
              <Form.Item
                label="Usuario"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa tu correo electrónico",
                  },
                ]}
              >
                <Input
                  type="email"
                  placeholder="Ingrese su usuario"
                  onChange={(e) => handleChangeUsername(e.target.value)}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs italic">
                    {errors.username}
                  </p>
                )}
              </Form.Item>
              <Form.Item
                label="Contraseña"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa tu contraseña",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Ingrese su contraseña"
                  onChange={(e) => handleChangePassword(e.target.value)}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs italic">
                    {errors.password}
                  </p>
                )}
              </Form.Item>
              <Form.Item>
                <ReCAPTCHA
                  sitekey="6Lcs1U0qAAAAAKrgSA6QXMBD7ziudNsw5jtjCBdF"
                  onChange={handleCaptchaChange}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  Iniciar Sesión
                </Button>
              </Form.Item>
            </Form>
            <div className="mt-4 text-center">
              <Link to="/restore" className="hover:text-green-500">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </Col>
          <Col span={12} className="flex items-center justify-center">
            <img
              className="h-auto max-w-full"
              src="https://admision.unsm.edu.pe/ADMISI%C3%93N%20WEB%20_%20UNSM_files/Logo.png"
              alt="Archivero UNSM"
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
}