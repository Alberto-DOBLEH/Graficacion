const Anthropic = require('@anthropic-ai/sdk');

const claudeService = {
  async generarPromptMaestro(contextoProyecto) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('No se encontró la variable ANTHROPIC_API_KEY en el entorno.');
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const systemPrompt = `Eres un Arquitecto de Software Senior, Analista de Negocio Senior e Ingeniero de Requerimientos Senior.
Tu única tarea es analizar la información recopilada del proyecto, detectar inconsistencias, identificar requisitos faltantes, refinar las historias de usuario y reglas de negocio, organizar todos los requisitos de forma óptima, y construir un "Prompt Maestro".
El resultado debe ser ÚNICAMENTE el "Prompt Maestro" final. NO debes generar código fuente del sistema en tu respuesta. El Prompt Maestro que generes será utilizado por otra IA para crear el sistema completo (arquitectura, código, base de datos). 
Asegúrate de que el Prompt Maestro sea extremadamente claro, detallado e incluya toda la información relevante consolidada de manera estructurada. No incluyas saludos ni texto adicional, SOLO el Prompt Maestro final.`;

    const userPrompt = `Aquí tienes el contexto completo del proyecto extraído de la base de datos:\n\n${JSON.stringify(contextoProyecto, null, 2)}`;

    try {
      const msg = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 8192,
        system: systemPrompt,
        messages: [
          { role: "user", content: userPrompt }
        ]
      });

      return msg.content[0].text;
    } catch (error) {
      console.error('Error al llamar a la API de Claude:', error);
      throw new Error('Fallo al comunicarse con Claude: ' + error.message);
    }
  },

  async analizarDocumentoAnexo(textoDocumento) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('No se encontró la variable ANTHROPIC_API_KEY en el entorno.');
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const systemPrompt = `Eres un Ingeniero de Requerimientos y Analista de Negocio experto.
Tu tarea es analizar el texto extraído de un archivo anexo (documento, PDF, HTML, acta, etc.) y extraer la información estructurada que necesita el sistema.
Debes responder ÚNICAMENTE con un objeto JSON válido. No incluyas explicaciones, saludos ni formato de bloques de código markdown como \`\`\`json. Solo el objeto JSON crudo.

El JSON debe tener exactamente esta estructura:
{
  "titulo": "Título corto y formal para el anexo (máx 80 caracteres)",
  "descripcion": "Una descripción muy breve del propósito del anexo (1 o 2 oraciones)",
  "origen": "El origen o fuente probable del documento (ej: Cliente, Departamento de TI, Proveedor, Investigación de mercado)",
  "tipoAnexo": "Debe ser exactamente una de estas opciones: 'Documento', 'Imagen / Captura', 'Diagrama externo', 'Acta de reunión', 'Correo electrónico', 'Otro'",
  "contenido": "Una versión estructurada, limpia y en formato markdown de la información relevante extraída del documento. Si hay tablas o listas, manténlas y ordénalas de forma muy legible.",
  "notas": "Notas adicionales clave, recomendaciones, o advertencias identificadas en el texto."
}`;

    const userPrompt = `Aquí tienes el texto del documento a analizar:\n\n${textoDocumento}`;

    try {
      const msg = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          { role: "user", content: userPrompt }
        ]
      });

      let resText = msg.content[0].text.trim();
      if (resText.startsWith("\`\`\`json")) {
        resText = resText.substring(7, resText.length - 3).trim();
      } else if (resText.startsWith("\`\`\`")) {
        resText = resText.substring(3, resText.length - 3).trim();
      }
      return JSON.parse(resText);
    } catch (error) {
      console.error('Error al analizar documento con Claude:', error);
      throw new Error('Fallo al analizar el documento con IA: ' + error.message);
    }
  }
};

module.exports = claudeService;
