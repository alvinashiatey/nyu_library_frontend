import { useState, useEffect, useCallback, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import styles from "./PDFViewer.module.css";
import PageNavigationForm from "./PageNavigationForm";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  file: string;
}

const maxWidth = 800;
const resizeObserverOptions = {};

function PDFViewer({ file }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [containerHeight, setContainerHeight] =
    useState<string>("calc(100vh - 5rem)");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  useEffect(() => {
    const calculateHeight = () => {
      const headerHeight = document.querySelector("header")?.clientHeight || 0;
      const newHeight = `calc(100vh - ${headerHeight}px)`;
      setContainerHeight(newHeight);
    };

    // Calculate on initial render
    calculateHeight();

    // Recalculate if window is resized
    window.addEventListener("resize", calculateHeight);

    // Clean up
    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef.current, resizeObserverOptions, onResize);

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

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
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
          <div
            className={`${styles["nav-controls"]} ${
              isHovering ? styles["visible"] : styles["hidden"]
            }`}
          >
            <button
              className="btn btn-black"
              onClick={goToPreviousPage}
              disabled={pageNumber === 1}
            >
              ← Prev
            </button>
            <p className={styles["page-number"]}>
              {pageNumber} of {numPages}
            </p>
            <button
              onClick={goToNextPage}
              className="btn btn-black"
              disabled={numPages ? pageNumber === numPages : false}
            >
              Next →
            </button>
          </div>
        </div>
        <div className="top-info">
          <PageNavigationForm
            numPages={numPages}
            onPageSubmit={handlePageSubmit}
          />
        </div>
      </div>
      <div
        className={styles["pdf-wrapper"]}
        style={{ height: containerHeight }}
      >
        <div
          className={styles["pdf-document"]}
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              pageNumber={pageNumber}
              width={
                containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
              }
            />
          </Document>
        </div>
      </div>
    </div>
  );
}

export default PDFViewer;
