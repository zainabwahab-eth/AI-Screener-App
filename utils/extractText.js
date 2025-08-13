// src/server/utils/extractText.js
const pdfparse = require("pdf-parse");
const mammoth = require("mammoth");

const getExtractedText = async (file) => {
  try {
    if (!file.buffer) {
      throw new Error("No file buffer available.");
    }

    let extractedText = "";

    if (file.mimetype === "application/pdf") {
      const data = await pdfparse(file.buffer);
      extractedText = data.text?.trim() || "";
    } else if (
      file.mimetype === "application/msword" ||
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value?.trim() || "";
    } else {
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }

    if (extractedText.length < 10) {
      throw new Error("Extracted text is too short or invalid.");
    }

    return extractedText;
  } catch (error) {
    console.error(`Failed to extract text from ${file.originalname}:`, error.message);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
};

module.exports = getExtractedText;
