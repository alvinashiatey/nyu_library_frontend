import React, { useState, useEffect } from "react";
import styles from "./StackView.module.css";
import type { Book } from "@/types";

interface StackViewProps {
  bks: Book[];
}

const StackView: React.FC<StackViewProps> = ({ bks }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bks.length) {
      setBooks(bks);
      setLoading(false);
    }
  }, [bks]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.books}>
          <h1>Stack</h1>
          {books.map((book) => (
            <div key={book.title}>
              <h2>{book.title}</h2>
              <p>{book.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StackView;
