// Rutas para el front y asi

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ProveedorGlobal } from "./global/ContextoUsuario";

import PaginaBienvenida from "./pages/Bienvenida";
import ListaProyectos from "./pages/Inicio";
import DiseñoPrincipal from "./components/DiseñoPrincipal";
import Configuracion from "./pages/Configuracion";
import GestionProcesos from "./pages/GestionProcesos";
import Validacion from "./pages/Validacion";

function App() {
  return (
    <ProveedorGlobal>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PaginaBienvenida />} />
          <Route path="proyectos" element={<ListaProyectos />} />
          <Route path="configuracion" element={<Configuracion />} />
          <Route path="procesos" element={<GestionProcesos />} />
          <Route path="validacion" element={<Validacion />} />
          <Route path="proyecto/:idProyecto" element={<DiseñoPrincipal />} />
          {/* </Route> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ProveedorGlobal>
  );
}

export default App;
