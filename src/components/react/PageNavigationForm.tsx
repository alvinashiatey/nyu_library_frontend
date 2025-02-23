import { useState } from "react";
import styles from "./PDFViewer.module.css";

interface PageNavigationFormProps {
  numPages: number | undefined;
  onPageSubmit: (pageNum: number) => void;
}

const PageNavigationForm = ({
  numPages,
  onPageSubmit,
}: PageNavigationFormProps) => {
  const [goToPageInput, setGoToPageInput] = useState<string>("");
  const [inputError, setInputError] = useState<string>("");

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(goToPageInput);

    if (isNaN(pageNum)) {
      setInputError("Please enter a valid number");
      return;
    }

    if (!numPages) {
      setInputError("Document not loaded yet");
      return;
    }

    if (pageNum < 1 || pageNum > numPages) {
      setInputError(`Please enter a number between 1 and ${numPages}`);
      return;
    }

    setInputError("");
    onPageSubmit(pageNum);
    setGoToPageInput("");
  };

  return (
    <div className={styles["form"]}>
      <form onSubmit={handleGoToPage} className={styles["goto-form"]}>
        <input
          type="number"
          value={goToPageInput}
          onChange={(e) => setGoToPageInput(e.target.value)}
          placeholder="page no."
          className={styles["goto-input"]}
          min="1"
          max={numPages}
        />
        <button type="submit" className="btn btn-black">
          Go
        </button>
      </form>
      {inputError && (
        <span className={styles["error-message"]}>{inputError}</span>
      )}
    </div>
  );
};

export default PageNavigationForm;
