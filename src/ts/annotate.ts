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
  document
    .getElementById("hypothesis")
    ?.addEventListener("click", (el: MouseEvent) => {
      if (!document.querySelector("script#hypothesis-script")) {
        const script = document.createElement("script");
        script.id = "hypothesis-script";
        script.src = "https://hypothes.is/embed.js";
        script.async = true;
        document.body.appendChild(script);
      }
    });
}

async function main() {
  innitAnnotate();
}

main();
