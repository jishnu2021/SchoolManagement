import { GoogleGenerativeAI } from "@google/generative-ai";
import School from "../models/SchoolModel.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const regenerateDescription = async (req, res) => {
  try {
    const { id } = req.params;

    const school = await School.findById(id);
    if (!school) {
      return res.status(404).json({ success: false, message: "School not found" });
    }


    const prompt = `Generate a professional acheievment-oriented description for a school based on the following details in about 100 words:
    Name: ${school.name}
    Location: ${school.location}
    Type: ${school.type}
    Board: ${school.board}
    Facilities: ${school.facilities}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(prompt);
    const newDescription = result.response.text();

    return res.json({
      success: true,
      description: newDescription
    });

  } catch (error) {
    console.error("Error regenerating school description:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
