import * as pdfjsLib from "pdfjs-dist";
import { PDFViewer } from "pdfjs-dist/web/pdf_viewer";

// Set the worker file path
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "//unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js";

// Get the container element
const viewerContainer = document.getElementById(
  "viewerContainer"
) as HTMLElement;

// Check if the container exists
if (!viewerContainer) {
  throw new Error(
    "Viewer container not found. Ensure the element with ID 'viewerContainer' exists."
  );
}

// Verify the data attributes
const PDF_PATH = viewerContainer.getAttribute("data-pdf") || "";
console.log("PDF_PATH", PDF_PATH);

if (!PDF_PATH) {
  throw new Error(
    "PDF path is missing. Ensure the data-pdf attribute is set on the viewer container."
  );
}

// Initialize the PDF.js Viewer
try {
  const pdfViewer = new PDFViewer({
    container: viewerContainer,
  });

  // Load the PDF document
  pdfjsLib
    .getDocument(PDF_PATH)
    .promise.then((pdfDocument) => {
      pdfViewer.setDocument(pdfDocument);
    })
    .catch((error) => {
      console.error("Error loading PDF document:", error);
    });

  // Add keyboard navigation for pages
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      pdfViewer.currentPageNumber += 1;
    } else if (event.key === "ArrowLeft") {
      pdfViewer.currentPageNumber -= 1;
    }
  });
} catch (error) {
  console.error("Error initializing PDFViewer:", error);
}
