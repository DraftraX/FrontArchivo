import React, { useState } from "react";
import { Form, Input, Button, Card, Row, Col, message } from "antd";
const { Item } = Form;

export default function RestablecerContrasena() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = () => {
    // Validar que los campos no estén vacíos
    if (!email || !username) {
      message.error("Por favor, complete todos los campos.");
      return;
    }

    // Simular el envío del correo
    message.success("Correo enviado con éxito.");
    // Aquí podrías redirigir al usuario o limpiar el formulario
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-500 ">
      <Row justify="center" className="w-full">
        <Col xl={8} lg={10} md={12} sm={20} xs={24}>
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden h-full">
            <div className="grid grid-cols-2">
              <div>
                <div className="p-1 ">
                  <h2 className="text-2xl font-semibold mb-4">
                    ¿Olvidaste tu Contraseña?
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Ingresa el correo electrónico con el cual te registraste
                  </p>
                  <Form onFinish={handleSubmit}>
                    <Item
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Por favor ingresa tu correo electrónico",
                        },
                      ]}
                    >
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full py-2 px-3 border border-gray-300 rounded"
                      />
                    </Item>
                    <Item
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "Por favor ingresa tu nombre de usuario",
                        },
                      ]}
                    >
                      <Input
                        type="text"
                        placeholder="Nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full py-2 px-3 border border-gray-300 rounded mt-4"
                      />
                    </Item>
                    <Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        RECUPERAR MI CONTRASEÑA
                      </Button>
                    </Item>
                  </Form>
                  <div className="text-center mt-4">
                    <a href="/login" className="text-sm text-gray-500">
                      Recuerdo mi contraseña
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <div
                  className="bg-cover bg-center h-full"
                  style={{
                    backgroundImage:
                      "url(https://unsm.edu.pe/wp-content/uploads/2023/06/logo-1x1-unsm.jpg)",
                    minHeight: "100%",
                  }}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
