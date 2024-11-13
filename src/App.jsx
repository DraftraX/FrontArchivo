import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// SEGURIDAD
import IniciarSesion from "./modules/Seguridad/IniciarSesion/IniciarSesion";
import RestablecerContrasena from "./modules/Seguridad/RestablecerContraseña/RestablecerContrasena";
import NuevaContrasena from "./modules/Seguridad/NuevaContraseña/NuevaContrasena";
import CambiarContrasena from "./modules/Seguridad/NuevaContraseña/UpdatePassword";
import PaginaPrincipal from "./modules/Seguridad/PaginaPrincipal/PaginaPrincipal";
import CrearUsuario from "./modules/Seguridad/CrearUsuario";
import PerfilUsuario from "./modules/Seguridad/PerfilUsuario";
import CrearResolucion from "./modules/Seguridad/CrearResolucion";
import CrearGrado from "./modules/Seguridad/CrearGrado";
import CrearPosgrado from "./modules/Seguridad/CrearPosgrado";
import RegistrarVisita from "./modules/Seguridad/RegistrarVisita/RegistrarVisita";
import Permisos from "./modules/Seguridad/Permisos/Permisos";

// RESOLUCIONES
import VistaResoluciones from "./modules/Resoluciones/VistaResoluciones";
import VerResolucion from "./modules/Resoluciones/VerResolucion";

// GRADOS Y TITULOS
import VistaGrados from "./modules/GradosyTItulos/VistaGrados";
import VerGrado from "./modules/GradosyTItulos/VerGrado";
import VistaPosgrados from "./modules/GradosyTItulos/VistaPosgrados";
import VerPosgrado from "./modules/GradosyTItulos/VerPosgrado";
import ReportesDocumentos from "./components/ReporteDocumentos/ReporteDocumentos";
import ReportesVisitantes from "./components/ReporteVisitantes/ReporteVisitantes";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  useEffect(() =>
  {
    if (process.env.NODE_ENV === 'development') {
      const isFirstTime = localStorage.getItem('isFirstTime');
      if (!isFirstTime) {
        localStorage.clear();
        localStorage.setItem('isFirstTime', 'true');
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Routes>
          {/* Ruta inicial */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Demás rutas */}
          <Route path="/login" element={<IniciarSesion />} />
          <Route path="/restore" element={<RestablecerContrasena />} />
          <Route path="/newpassword" element={<NuevaContrasena />} />

          {/* Rutas protegidas */}
          <Route path="/updatepassword" element={<PrivateRoute><CambiarContrasena /></PrivateRoute>} />
          <Route path="/paginaprincipal" element={<PrivateRoute><PaginaPrincipal /></PrivateRoute>} />
          <Route path="/perfil" element={<PrivateRoute><PerfilUsuario /></PrivateRoute>} />
          <Route path="/create" element={<PrivateRoute><CrearUsuario /></PrivateRoute>} />
          <Route path="/resoluciones" element={<PrivateRoute><VistaResoluciones /></PrivateRoute>} />
          <Route path="/verresolucion" element={<PrivateRoute><VerResolucion /></PrivateRoute>} />
          <Route path="/createresolucion" element={<PrivateRoute><CrearResolucion /></PrivateRoute>} />
          <Route path="/grados" element={<PrivateRoute><VistaGrados /></PrivateRoute>} />
          <Route path="/vergrado" element={<PrivateRoute><VerGrado /></PrivateRoute>} />
          <Route path="/creategrado" element={<PrivateRoute><CrearGrado /></PrivateRoute>} />
          <Route path="/posgrados" element={<PrivateRoute><VistaPosgrados /></PrivateRoute>} />
          <Route path="/verposgrado" element={<PrivateRoute><VerPosgrado /></PrivateRoute>} />
          <Route path="/createposgrado" element={<PrivateRoute><CrearPosgrado /></PrivateRoute>} />
          <Route path="/reportes-documentos" element={<PrivateRoute><ReportesDocumentos /></PrivateRoute>} />
          <Route path="/reportes-visitantes" element={<PrivateRoute><ReportesVisitantes /></PrivateRoute>} />
          <Route path="/visita" element={<PrivateRoute><RegistrarVisita /></PrivateRoute>} />
          <Route path="/permisos" element={<PrivateRoute><Permisos /></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;