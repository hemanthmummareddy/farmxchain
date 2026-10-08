import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
// const API_KEY="AIzaSyCuoyxGr05u5xL2shtkGgbYs-DRmTNZgS4"
if (!API_KEY) {
  console.error("❌ Gemini API key is missing. Check .env and restart server.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function fileToGenerativePart(file) {
  const base64EncodedData = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}

export const analyzeCropImage = async (file) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const imagePart = await fileToGenerativePart(file);

    const prompt = `
Analyze this image for a farmer.

Rules:
- If plant: detect disease or say Healthy
- If diseased: give treatment steps
- If diseased: give organic and chemical ways to cure 
- If not plant: return "Not a Crop"

Return STRICT JSON only:

{
  "condition": "",
  "confidence": "",
  "organic way":"",
  "chemicals advised":"",
  
  "advice": ""
}
`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);

  } catch (error) {
    console.error("❌ Gemini Error:", error);
    throw new Error("AI analysis failed");
  }
};
