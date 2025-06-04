import React, { useState } from "react";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { API_URL } from "../../../utils/ApiRuta";

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Ingrese su Usuario")
    .regex(
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.es)$/,
      "Solo se permiten correos de gmail.com, hotmail.com u outlook.es"
    ),
  password: z.string().min(1, "Ingrese su contraseña"),
});

export default function IniciarSesion() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      loginSchema.parse({ username, password });

      if (!captcha) {
        message.error("Por favor, complete el CAPTCHA.");
        return;
      }

      const res = await axios.post(
        `${API_URL}/auth/login`,
        {
          username,
          password,
          recaptchaResponse: captcha,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        const data = res.data;
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);

        message.success("Inicio de sesión exitoso. Bienvenido al sistema.");
        setTimeout(() => navigate("/paginaprincipal"), 1000);
      } else {
        message.error("Error al iniciar sesión");
      }
    } catch (err) {
      if (err.errors) {
        message.error(err.errors[0].message);
      } else if (err.response?.data) {
        message.error(err.response.data.message || "Error al iniciar sesión");
      } else {
        console.error(err);
        message.error("Ha ocurrido un error. Inténtelo nuevamente.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-500 px-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
          ARCHIVERO CENTRAL
        </h1>

        <div className="flex flex-col md:flex-row gap-10">
          <form onSubmit={handleSubmit} className="flex-1 space-y-5" noValidate>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Usuario
              </label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6LdpRVUrAAAAAMXUbqkpGhxIchH5GeKh4EU8tX_f"
                onChange={setCaptcha}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200 shadow-md"
            >
              Iniciar Sesión
            </button>

            <div className="flex justify-between text-sm mt-2 text-green-700">
              <Link to="/restore" className="hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
              <Link to="/registro" className="hover:underline">
                Crear nuevo usuario
              </Link>
            </div>
          </form>

          <div className="flex-1 flex items-center justify-center">
            <img
              src="https://admision.unsm.edu.pe/ADMISI%C3%93N%20WEB%20_%20UNSM_files/Logo.png"
              alt="Archivero UNSM"
              className="w-48 md:w-72"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
