import { useState } from "react";
import { message } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../utils/ApiRuta";

export default function RestablecerContrasena() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      message.error("Por favor, ingresa tu correo electrónico.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      message.error("Solo se aceptan correos de @gmail.com.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/change-password/enviarcorreo`,
        {
          mailTo: email,
          username: email,
        }
      );

      if (response.status === 200) {
        message.success("Correo enviado con éxito.");
        setEmail("");
      } else {
        message.error("Error al enviar el correo.");
      }
    } catch (error) {
      message.error("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-500 px-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
          ¿OLVIDASTE TU CONTRASEÑA?
        </h2>
        <div className="flex flex-col md:flex-row gap-10">
          <form onSubmit={handleSubmit} className="flex-1 space-y-5">
            <p className="text-gray-600 mb-4">
              Ingresa el correo electrónico con el cual te registraste.
            </p>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@gmail.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Solo se aceptan correos de @gmail.com
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200 shadow-md"
            >
              RECUPERAR MI CONTRASEÑA
            </button>

            <div className="text-center mt-4 text-green-700">
              <Link to="/" className="hover:underline">
                Recuerdo mi contraseña
              </Link>
            </div>
          </form>

          <div className="flex-1 flex items-center justify-center">
            <img
              src="https://unsm.edu.pe/wp-content/uploads/2023/06/logo-1x1-unsm.jpg"
              alt="Logo UNSM"
              className="w-64 md:w-96"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
