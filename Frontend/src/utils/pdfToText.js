import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { createWorker } from "tesseract.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const extractTextFromPDF = async (file) => {
  if (!file) {
    throw new Error("No PDF file selected");
  }

  if (file.type !== "application/pdf") {
    throw new Error("Selected file is not a PDF");
  }

  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  console.log("PDF LOADED");
  console.log("TOTAL PAGES:", pdf.numPages);

  let extractedText = "";

  // First try normal PDF text extraction
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    console.log(`Extracting text from page ${pageNumber}...`);

    const page = await pdf.getPage(pageNumber);

    const textContent = await page.getTextContent();

    console.log(`PAGE ${pageNumber} TEXT ITEMS:`, textContent.items.length);

    const pageText = textContent.items
      .map((item) => item.str || "")
      .join(" ")
      .trim();

    extractedText += pageText + "\n";
  }

  extractedText = extractedText.trim();

  // If normal extraction worked, return it
  if (extractedText.length > 0) {
    console.log("Normal text extraction successful");

    console.log("FINAL TEXT:");
    console.log(extractedText);

    return extractedText;
  }

  // =====================================================
  // OCR FALLBACK
  // =====================================================

  console.log("No text layer found.");
  console.log("Starting OCR...");

  const worker = await createWorker("eng");

  let ocrText = "";

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      console.log(`OCR processing page ${pageNumber}...`);

      const page = await pdf.getPage(pageNumber);

      // Increase scale for better OCR
      const viewport = page.getViewport({
        scale: 2,
      });

      // Create canvas
      const canvas = document.createElement("canvas");

      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      const context = canvas.getContext("2d");

      // Render PDF page → canvas
      await page.render({
        canvasContext: context,
        viewport,
      }).promise;

      // Canvas → image
      const image = canvas.toDataURL("image/png");

      // OCR
      const result = await worker.recognize(image);

      const pageText = result.data.text?.trim() || "";

      console.log(`OCR PAGE ${pageNumber} TEXT:`, pageText);

      ocrText += pageText + "\n";

      page.cleanup();
    }
  } finally {
    await worker.terminate();
  }

  ocrText = ocrText.trim();

  console.log("=================================");
  console.log("FINAL OCR TEXT:");
  console.log(ocrText);
  console.log("TEXT LENGTH:", ocrText.length);
  console.log("=================================");

  return ocrText;
};
