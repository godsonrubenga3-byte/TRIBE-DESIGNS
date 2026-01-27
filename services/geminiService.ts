
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDesignAdvice = async (userPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an expert African high-fashion jersey designer for 'TRIBE DESIGNS'. 
      A user wants a custom jersey inspired by: "${userPrompt}". 
      Suggest a color palette, a specific African cultural pattern reference, and a modern twist.
      Keep it high-energy, youth-focused, and stylish.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            palette: { type: Type.ARRAY, items: { type: Type.STRING } },
            patternConcept: { type: Type.STRING },
            modernTwist: { type: Type.STRING },
            vibeDescription: { type: Type.STRING }
          },
          required: ["palette", "patternConcept", "modernTwist", "vibeDescription"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
