// async function annotatePdf(
//   pdfUrl: string | undefined,
//   container: HTMLDivElement
// ) {
//   if (!pdfUrl) return;
//   pdfjsLib.GlobalWorkerOptions.workerSrc =
//     "/node_modules/pdfjs-dist/build/pdf.worker.min.mjs";
//   pdfjsLib.getDocument(pdfUrl).promise.then((pdfDoc) => {
//     for (let i = 1; i <= pdfDoc.numPages; i++) {
//       pdfDoc.getPage(i).then((page) => {
//         const canvas = document.createElement("canvas");
//         const context = canvas.getContext("2d");
//         container.appendChild(canvas);

//         const viewport = page.getViewport({ scale: 1 });
//         canvas.height = viewport.height;
//         canvas.width = viewport.width;

//         if (context) {
//           page.render({ canvasContext: context, viewport });
//         }
//       });
//     }
//   });
// }

function innitAnnotate() {
  document.getElementById("hypothesis")?.addEventListener("click", () => {
    // Check if Hypothesis is already loaded
    if (!document.querySelector("script#hypothesis-script")) {
      const script = document.createElement("script");
      script.id = "hypothesis-script";
      script.src = "https://hypothes.is/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

function setupHypothesisSidebarObserver() {
  // Create a MutationObserver to watch for the sidebar element
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        const hypothesisSidebar = document.querySelector("hypothesis-sidebar");
        if (hypothesisSidebar) {
          // Set up a ResizeObserver to track sidebar width changes
          trackHypothesisSidebarWidth(hypothesisSidebar);
          // We found what we were looking for, disconnect the observer
          observer.disconnect();
          break;
        }
      }
    }
  });

  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
}

function trackHypothesisSidebarWidth(sidebarElement: Element) {
  // Initial measurement and CSS variable setting
  updateSidebarWidthVariable(sidebarElement);

  // Set up ResizeObserver to track width changes
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      updateSidebarWidthVariable(entry.target);
    }
  });

  resizeObserver.observe(sidebarElement);
}

function updateSidebarWidthVariable(element: Element) {
  // Get the current width of the hypothesis sidebar
  const width = element.getBoundingClientRect().width;

  // Set a CSS variable at the document root level
  document.documentElement.style.setProperty(
    "--hypothesis-sidebar-width",
    `${width}px`
  );
  console.log("Hypothesis sidebar width set to", width, "px");
}

async function main() {
  innitAnnotate();
}

main();
