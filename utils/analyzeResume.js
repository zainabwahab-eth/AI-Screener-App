const axios = require("axios");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const AI_MODEL = "mistralai/mistral-7b-instruct";

const aiAnalyzeResume = async (jobRequirements, jobDescription, resumeText) => {
  const cleanText = (text) =>
    text
      .substring(0, 8000)
      .replace(/\s+/g, " ")
      .replace(/[●•▪]/g, "");

  const prompt = `Analyze this resume against the job requirements.
  Respond in strict JSON format with:
  - score (0-100)
  - feedback (string)
  
  JOB REQUIREMENTS:
  ${cleanText(jobRequirements)}
  
  JOB DESCRIPTION:
  ${cleanText(jobDescription)}
  
  RESUME CONTENT:
  ${cleanText(resumeText)}`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: AI_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        response_format: { type: "json_object" },
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:4000",
          "X-Title": "AI Screener App",
        },
        timeout: 15000, 
      }
    );

    // Validate and parse response
    const result = JSON.parse(response.data.choices[0].message.content);
    if (typeof result.score !== "number" || !result.feedback) {
      throw new Error("Invalid AI response format");
    }

    return result;
  } catch (error) {
    console.error("AI API Error:", {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    throw new Error(
      `AI analysis failed: ${
        error.response?.data?.error?.message || error.message
      }`
    );
  }
};

module.exports = aiAnalyzeResume;
