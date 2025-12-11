import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import extractTextFromPDF from "../services/pdfParser.js";
import extractFields from "../services/fieldExtractor.js";
import routeClaim from "../services/routingEngine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({ dest: uploadsDir });

router.post("/", upload.single("file"), async (req, res) => {
  let filePath = null;

  try {
    // if FNOL text is provided
    let text = req.body?.text; 

    // If text not provided, fallback to PDF upload
    if (!text) {
      const file = req.file;
      if (!file)
        return res
          .status(400)
          .json({ error: "Provide either FNOL text or a PDF file" });

      filePath = file.path;

      // Only pdf file is supported
      if (!file.mimetype || !file.mimetype.includes("pdf")) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return res.status(400).json({ error: "Only PDF files are supported" });
      }

      // Extract text from PDF
      text = await extractTextFromPDF(filePath);
      if (!text || text.trim().length === 0) {
        throw new Error("PDF appears to be empty or could not extract text");
      }
    }

    const fields = await extractFields(text);

    const routing = routeClaim(fields);

    return res.json({
      extractedFields: fields,
      missingFields: routing.missingFields,
      recommendedRoute: routing.route,
      reasoning: routing.reason,
    });
  } catch (err) {
    console.error(err);
    const statusCode = err.message.includes("API") ? 503 : 500;
    res.status(statusCode).json({ error: err.message });
  } finally {
    // Clean up uploaded file after processing
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.error("Failed to cleanup file:", cleanupError);
      }
    }
  }
});

export default router;
