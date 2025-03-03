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
  const [hypothesisSidebarWidth, setHypothesisSidebarWidth] =
    useState<number>(0);

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

  useEffect(() => {
    // Function to read and update the hypothesis sidebar width state
    const checkSidebarWidth = () => {
      const sidebarWidth = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--hypothesis-sidebar-width");

      if (sidebarWidth) {
        // Convert from "123px" to 123
        const width = parseInt(sidebarWidth.replace("px", ""), 10);
        if (!isNaN(width)) {
          setHypothesisSidebarWidth(width);
        }
      }
    };

    // Check immediately
    checkSidebarWidth();

    // Create observer to watch for CSS variable changes
    const observer = new MutationObserver(checkSidebarWidth);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => observer.disconnect();
  }, []);

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
      <div
        className={styles["pdf-document"]}
        ref={containerRef}
        style={{
          height: containerHeight,
          // Adjust width when hypothesis sidebar is present
          marginRight: hypothesisSidebarWidth
            ? `${hypothesisSidebarWidth}px`
            : "0",
        }}
      >
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            pageNumber={pageNumber}
            width={
              containerWidth
                ? Math.min(containerWidth - hypothesisSidebarWidth, maxWidth)
                : maxWidth
            }
          />
        </Document>
      </div>
    </div>
  );
}

export default PDFViewer;
