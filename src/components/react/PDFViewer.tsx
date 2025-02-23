import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import styles from "./PDFViewer.module.css";
import PageNavigationForm from "./PageNavigationForm";

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

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToPreviousPage();
      } else if (event.key === "ArrowRight") {
        goToNextPage();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [numPages, pageNumber]); // Dependencies ensure we have access to latest state

  const handlePageSubmit = (pageNum: number) => {
    setPageNumber(pageNum);
    updateURL(pageNum);
  };

  return (
    <div className={styles[".document-container"]}>
      <div className={styles["page-details"]}>
        <div className={styles["page-nav"]}>
          <button
            className="btn btn-black"
            onClick={goToPreviousPage}
            disabled={pageNumber === 1}
          >
            ← Prev
          </button>
          <button
            onClick={goToNextPage}
            className="btn btn-black"
            disabled={numPages ? pageNumber === numPages : false}
          >
            Next →
          </button>
        </div>
        <div className="top-info">
          <p className={styles["page-info"]}>
            Page {pageNumber} of {numPages}
          </p>
          <PageNavigationForm
            numPages={numPages}
            onPageSubmit={handlePageSubmit}
          />
        </div>
      </div>
      <div className={styles["pdf-document"]}>
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
    </div>
  );
}

export default PDFViewer;
