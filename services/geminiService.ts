import { GoogleGenAI } from "@google/genai";
import { Cookie } from "../types";

// Initialize Gemini
// Note: In a real production app, you might want to proxy this call to hide the key, 
// but for a client-side demo per instructions, we use process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCookieRecommendation = async (
  query: string, 
  cookies: Cookie[]
): Promise<string> => {
  try {
    const menuDescription = cookies.map(c => `- ${c.name}: ${c.description} (Tags: ${c.tags.join(', ')})`).join('\n');
    
    const prompt = `
      Eres un amable "Concierge de Galletas" para "AMORDIDAS", una tienda de galletas estilo NYC.
      El usuario pregunta: "${query}"
      
      Aquí está nuestro menú:
      ${menuDescription}
      
      Por favor recomienda 1 o 2 galletas específicas del menú que coincidan con su estilo. 
      Mantén el tono súper relajado, corto y divertido. Como un amigo enviando mensajes de texto. 
      No seas formal. Usa emojis. Máximo 50 palabras. RESPONDE EN ESPAÑOL.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "¡Todo es delicioso! ¿Por qué no pruebas La Clásica O.G.?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Mis sentidos de galleta están vibrando, ¡pero no puedo hablar ahora! Sigue tu instinto (o pide La Clásica O.G.).";
  }
};