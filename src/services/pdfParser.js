import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import fs from "fs";

async function extractTextFromPDF(path) {
  const data = new Uint8Array(fs.readFileSync(path));

  const pdf = await pdfjsLib.getDocument({ data }).promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();

    const pageText = textContent.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n";
  }

  return fullText;
}

export default extractTextFromPDF;
