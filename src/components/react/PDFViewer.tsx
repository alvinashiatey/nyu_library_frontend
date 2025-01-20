import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./PDFViewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  file: string;
}

function PDFViewer({ file }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  useEffect(() => {
    const url = new URL(window.location.href);
    const urlPage = url.searchParams.get("page");
    if (urlPage) {
      const pageNum = parseInt(urlPage);
      if (!isNaN(pageNum) && pageNum > 0) {
        setPageNumber(pageNum);
      }
    }
  }, []);

  const updateURL = (newValue: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", newValue.toString());
    window.history.pushState({}, "", url);
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    const urlPage = parseInt(
      new URL(window.location.href).searchParams.get("page") || "1"
    );
    if (urlPage > numPages) {
      setPageNumber(numPages);
      updateURL(numPages);
    }
  }

  function goToPreviousPage() {
    setPageNumber((prevPageNumber) => {
      const newPage = Math.max(prevPageNumber - 1, 1);
      updateURL(newPage);
      return newPage;
    });
  }

  function goToNextPage() {
    setPageNumber((prevPageNumber) => {
      const newPage = numPages
        ? Math.min(prevPageNumber + 1, numPages)
        : prevPageNumber + 1;
      updateURL(newPage);
      return newPage;
    });
  }

  return (
    <div>
      <div className="page-details">
        <div className="page-nav">
          <button
            className="btn btn-white"
            onClick={goToPreviousPage}
            disabled={pageNumber === 1}
          >
            Previous
          </button>
          <button
            onClick={goToNextPage}
            className="btn btn-white"
            disabled={numPages ? pageNumber === numPages : false}
          >
            Next
          </button>
        </div>
        <p className="page-info">
          Page {pageNumber} of {numPages}
        </p>
      </div>
      <div className="pdf-document">
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
    </div>
  );
}

export default PDFViewer;
