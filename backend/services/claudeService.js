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
  }
};

module.exports = claudeService;
