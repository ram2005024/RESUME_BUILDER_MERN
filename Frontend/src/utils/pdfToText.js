import * as pdfjsLib from "pdfjs-dist";

export async function extractTextFromPDF(file) {
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  let fullText = "";

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);

    const textContent = await page.getTextContent();

    const pageText = textContent.items.map((item) => item.str).join(" ");

    fullText += pageText + "\n";
  }

  return fullText;
}
