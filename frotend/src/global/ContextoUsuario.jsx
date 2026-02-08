// Para mantener la sesion del usuario con el proyecto seleccionado

// Ay, Mija yo soy mas cabron que bonito
// No considero delito el poder  hecharte la mano
// Tu jefe dice que soy drogadicto
// Yo digo que poquito porque el polvo no esta tan malo
import React, { createContext } from "react";

const ContextoGlobal = createContext();

export const ProveedorGlobal = ({ children }) => {
  const valores = {};

  return (
    <ContextoGlobal.Provider value={valores}>
      {children}
    </ContextoGlobal.Provider>
  );
};

export default ContextoGlobal;
