import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const extractTextFromPDF = async (file) => {
  try {
    console.log("PDF FILE:", file);
    console.log("PDF NAME:", file.name);
    console.log("PDF TYPE:", file.type);
    console.log("PDF SIZE:", file.size);

    if (!file) {
      throw new Error("No PDF file selected");
    }

    if (file.type !== "application/pdf") {
      throw new Error("Selected file is not a PDF");
    }

    // Convert File → ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    console.log("ARRAY BUFFER SIZE:", arrayBuffer.byteLength);

    // Load PDF
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;

    console.log("PDF LOADED");
    console.log("TOTAL PAGES:", pdf.numPages);

    let extractedText = "";

    // Extract text from every page
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      console.log(`Extracting page ${pageNumber}...`);

      const page = await pdf.getPage(pageNumber);

      const textContent = await page.getTextContent();

      console.log(`PAGE ${pageNumber} ITEMS:`, textContent.items.length);

      const pageText = textContent.items
        .map((item) => item.str || "")
        .join(" ");

      console.log(`PAGE ${pageNumber} TEXT:`, pageText);

      extractedText += pageText + "\n";
    }

    extractedText = extractedText.trim();

    console.log("=================================");
    console.log("FINAL EXTRACTED TEXT:");
    console.log(extractedText);
    console.log("TEXT LENGTH:", extractedText.length);
    console.log("=================================");

    return extractedText;
  } catch (error) {
    console.error("PDF TEXT EXTRACTION ERROR:", error);

    throw error;
  }
};
