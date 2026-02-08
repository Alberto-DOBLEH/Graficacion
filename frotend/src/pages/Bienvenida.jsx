import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaginaBienvenida = () => {
  const navigate = useNavigate();

  const [esRegistro, setEsRegistro] = useState(false);

  const [datos, setDatos] = useState({ email: "", password: "", nombre: "" });

  const manejarSubmit = (e) => {
    e.preventDefault();
    // Aqui pones lo del api para el llamado del registro y asi
    // Yo quiero comprarle un ferrari a mi noviaaaa
    // pero no puedo.. no tengo dinero

    // simulacion que simula
    console.log(esRegistro ? "Registrando..?" : "Logueando...", datos);

    navigate("/proyectos");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/50">
              P
            </div>
            <h1 className="text-2xl font-bold tracking-wider">
              ProjectManager<span className="text-blue-400">.io</span>
            </h1>
          </div>
        </div>

        {/* Contexto Principal */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-extrabold mb-6 leading-tight">
            Ingeniería de Software, <br />
            <span className="text-blue-400">profesional y trazable.</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Desde la entrevista con el cliente hasta el despliegue. Gestiona
            requisitos, define stakeholders y controla la calidad de tu software
            en un solo lugar.
          </p>

          {/* Pequeña lista de beneficios */}
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs">
                ✓
              </span>
              Trazabilidad total de requisitos (IDs únicos)
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs">
                ✓
              </span>
              Gestión de Stakeholders y Roles
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs">
                ✓
              </span>
              Matriz de Procesos y Técnicas
            </li>
          </ul>
        </div>

        {/* Footer Izquierdo */}
        <div className="relative z-10 text-sm text-gray-500">
          © 2026 ProjectManager Inc. - Diseñado para Desarrolladores de
          Software.
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              {esRegistro ? "Crear Cuenta" : "Bienvenido de nuevo"}
            </h3>
            <p className="text-gray-500">
              {esRegistro
                ? "Comienza a gestionar tus proyectos hoy."
                : "Ingresa tus credenciales para continuar."}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={manejarSubmit} className="space-y-5">
            {/* Campo Nombre (Solo si es Registro) */}
            {esRegistro && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Ej: Juan Pérez"
                  value={datos.nombre}
                  onChange={(e) =>
                    setDatos({ ...datos, nombre: e.target.value })
                  }
                  required
                />
              </div>
            )}

            {/* Campo Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="ingeniero@empresa.com"
                value={datos.email}
                onChange={(e) => setDatos({ ...datos, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="••••••••"
                value={datos.password}
                onChange={(e) =>
                  setDatos({ ...datos, password: e.target.value })
                }
                required
              />
              {!esRegistro && (
                <div className="text-right mt-1">
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 transform hover:-translate-y-0.5"
            >
              {esRegistro ? "Registrarse Gratis" : "Iniciar Sesión"}
            </button>
          </form>

          {/* Toggle Login/Registro */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600">
              {esRegistro ? "¿Ya tienes cuenta?" : "¿Aún no tienes cuenta?"}
              <button
                onClick={() => setEsRegistro(!esRegistro)}
                className="ml-2 font-bold text-blue-600 hover:text-blue-800 transition"
              >
                {esRegistro ? "Inicia Sesión" : "Regístrate aquí"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaBienvenida;
