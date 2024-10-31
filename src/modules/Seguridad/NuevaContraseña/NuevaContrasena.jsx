import React, { useState, useEffect } from "react";
import "../../../styles/ForgotPassword.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Swal from "sweetalert2";
import { API_URL } from "../../../utils/ApiRuta";

export default function NuevaContrasena() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const email = query.get("emailTo");
    if (email) {
      setEmailTo(email);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se ha proporcionado el correo electrónico.",
      });
    }
  }, []);

  useEffect(() => {
    // Verificar los requisitos de la contraseña
    const passwordCriteria =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    setPasswordValid(passwordCriteria.test(password));
  }, [password]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Contraseñas no coinciden",
        text: "Asegúrate de que ambas contraseñas sean iguales.",
      });
      return;
    }

    if (!passwordValid) {
      Swal.fire({
        icon: "error",
        title: "Contraseña inválida",
        text: "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.",
      });
      return;
    }

    const requestBody = {
      username: emailTo,
      password: password,
    };

    const response = await fetch(API_URL + "/change-password/newpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Contraseña cambiada",
        text: "Tu contraseña ha sido actualizada exitosamente.",
      }).then(() => {
        window.location.href = "/login"; // Redirigir a la página de inicio de sesión
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al cambiar tu contraseña. Intenta de nuevo.",
      });
    }
  };

  return (
    <div className="vertical-layout 1-column navbar-sticky bg-full-screen-image footer-static blank-page light-layout centered">
      <div className="app-content content">
        <div className="content-overlay"></div>
        <div className="content-wrapper">
          <div className="content-header row"></div>
          <div className="content-body">
            <section className="row flexbox-container centered">
              <div className="col-xl-7 col-md-9 col-10 px-100">
                <div className="card bg-authentication mb-0">
                  <div className="row m-0">
                    <div className="col-md-6 col-12 px-0">
                      <div className="card disable-rounded-right mb-0 p-2">
                        <div className="card-header pb-1">
                          <div className="card-title">
                            <h4 className="text-center mb-2">
                              Nueva Contraseña
                            </h4>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="text-muted text-center mb-2">
                            <small>
                              Ingrese su nueva contraseña, recuerde que ambos
                              campos deben ser iguales
                            </small>
                          </div>
                          <form className="mb-2" onSubmit={handleSubmit}>
                            <input
                              type="hidden"
                              name="_token"
                              value="ezJFlViWvl32MiTep9EMLUI5xP7q5fvHoHxd7ZSu"
                            />
                            <div className="form-group mb-2">
                              <label className="text-bold-600" htmlFor="pass">
                                Nueva Contraseña
                              </label>
                              <input
                                id="pass"
                                type="password"
                                className="form-control"
                                name="pass"
                                autoComplete="pass"
                                autoFocus
                                placeholder="Nueva Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              {!passwordValid && password && (
                                <div className="text-danger">
                                  <small>
                                    La contraseña debe tener al menos 8
                                    caracteres, incluir mayúsculas, minúsculas,
                                    números y caracteres especiales.
                                  </small>
                                </div>
                              )}
                            </div>
                            <div className="form-group mb-2">
                              <label className="text-bold-600" htmlFor="cpass">
                                Confirmar Contraseña
                              </label>
                              <input
                                id="cpass"
                                type="password"
                                className="form-control"
                                name="cpass"
                                autoComplete="cpass"
                                autoFocus
                                placeholder="Confirmar Contraseña"
                                value={confirmPassword}
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                              />
                            </div>
                            <div className="text-center">
                              <button
                                type="submit"
                                className="btn btn-primary glow position-relative"
                                style={{ fontSize: "0.95rem" }}
                              >
                                Confirmar Cambios
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 d-md-block d-none text-center align-self-center">
                      <img
                        className="img-fluid"
                        src="./unsm.png"
                        alt="LOGO UNSM"
                        width="500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
