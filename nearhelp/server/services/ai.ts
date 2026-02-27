import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const FALLBACK_GUIDANCE: Record<string, any> = {
  medical: {
    steps: [
      "Check for breathing and pulse.",
      "Call local emergency services immediately.",
      "Keep the person warm and still.",
      "Do not give them anything to eat or drink."
    ],
    summary: "Medical emergency reported. Immediate assistance required.",
    debrief: "Ensure the patient is handed over to professional medical staff."
  },
  fire: {
    steps: [
      "Evacuate the building immediately.",
      "Call the fire department.",
      "Do not use elevators.",
      "Stay low to the ground to avoid smoke."
    ],
    summary: "Fire emergency reported. Evacuation in progress.",
    debrief: "Wait for fire marshals to declare the area safe."
  },
  accident: {
    steps: [
      "Do not move injured persons unless there is immediate danger.",
      "Warn oncoming traffic if possible.",
      "Call emergency services.",
      "Stay with the victims until help arrives."
    ],
    summary: "Road accident reported. Traffic and medical support needed.",
    debrief: "Provide a clear statement to the authorities."
  },
  default: {
    steps: [
      "Stay calm and assess the situation.",
      "Contact emergency services.",
      "Secure the perimeter.",
      "Wait for professional help."
    ],
    summary: "Emergency alert triggered.",
    debrief: "Follow official instructions."
  }
};

export async function generateCrisisGuidance(type: string) {
  if (!process.env.GEMINI_API_KEY) {
    return FALLBACK_GUIDANCE[type] || FALLBACK_GUIDANCE.default;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // Using flash for speed
      contents: `Generate emergency guidance for a ${type} emergency. 
      Return JSON with:
      - steps: string[] (3-5 immediate actions)
      - summary: string (short summary for dispatchers)
      - debrief: string (post-incident advice)
      Keep it concise and professional.`,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Guidance Error:", error);
    return FALLBACK_GUIDANCE[type] || FALLBACK_GUIDANCE.default;
  }
}
