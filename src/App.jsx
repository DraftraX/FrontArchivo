import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// SEGURIDAD
import IniciarSesion from "./modules/Seguridad/IniciarSesion/IniciarSesion";
import RestablecerContrasena from "./modules/Seguridad/RestablecerContraseña/RestablecerContrasena";
import NuevaContrasena from "./modules/Seguridad/NuevaContraseña/NuevaContrasena";
import PaginaPrincipal from "./modules/Seguridad/PaginaPrincipal/PaginaPrincipal";
import CrearUsuario from "./modules/Seguridad/CrearUsuario";
import PerfilUsuario from "./modules/Seguridad/PerfilUsuario";
import CrearResolucion from "./modules/Seguridad/CrearResolucion";
import CrearGrado from "./modules/Seguridad/CrearGrado";
import CrearPosgrado from "./modules/Seguridad/CrearPosgrado";

// RESOLUCIONES
import VistaResoluciones from "./modules/Resoluciones/VistaResoluciones";
import VerResolucion from "./modules/Resoluciones/VerResolucion";

// GRADOS Y TITULOS
import VistaGrados from "./modules/GradosyTItulos/VistaGrados";
import VerGrado from "./modules/GradosyTItulos/VerGrado";
import VistaPosgrados from "./modules/GradosyTItulos/VistaPosgrados";
import VerPosgrado from "./modules/GradosyTItulos/VerPosgrado";
import Reportes from "./components/ReportePrueba/Reporte";
import RutasProtegidas from "./utils/RutasProtegida";

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
          <Route path="/reportes" element={<Reportes />} />

          {/* Rutas protegidas */}
          {/* <Route element={<RutasProtegidas />}>
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
          </Route> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// function Navigatiion(){
//   return  <nav>
//     <ul>
//       <li>
//         <Link></Link>
//       </li>
//     </ul>
//   </nav>
// }

export default App;
