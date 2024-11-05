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

function App() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const isFirstTime = localStorage.getItem("isFirstTime");
      if (!isFirstTime) {
        localStorage.clear();
        localStorage.setItem("isFirstTime", "true");
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
          <Route path="/updatepassword" element={<CambiarContrasena />} />
          <Route path="/paginaprincipal" element={<PaginaPrincipal />} />
          <Route path="/perfil" element={<PerfilUsuario />} />
          <Route path="/create" element={<CrearUsuario />} />
          <Route path="/resoluciones" element={<VistaResoluciones />} />
          <Route path="/verresolucion" element={<VerResolucion />} />
          <Route path="/createresolucion" element={<CrearResolucion />} />
          <Route path="/grados" element={<VistaGrados />} />
          <Route path="/vergrado" element={<VerGrado />} />
          <Route path="/creategrado" element={<CrearGrado />} />
          <Route path="/posgrados" element={<VistaPosgrados />} />
          <Route path="/verposgrado" element={<VerPosgrado />} />
          <Route path="/createposgrado" element={<CrearPosgrado />} />
          <Route path="/reportes-documentos" element={<ReportesDocumentos />} />
          <Route path="/reportes-visitantes" element={<ReportesVisitantes />} />
          <Route path="/visita" element={<RegistrarVisita />} />
          <Route path="/permisos" element={<Permisos />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
