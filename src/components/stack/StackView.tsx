import React, { useState, useEffect } from "react";
import styles from "./StackView.module.css";
import type { Book } from "@/types";

interface StackViewProps {
  bks: Book[];
  stack?: string;
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

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.container}>
          <div className={styles.preview}></div>
          <div className={styles.books}>
            {books.map((book) => (
              <div key={book.title} className={styles.book}>
                {book.files && (
                  <div className={styles.image}>
                    <img src={book.files[0].url} alt={book.title} />
                  </div>
                )}
                <div className={styles.info}>
                  <h2>{book.title}</h2>
                  <p>{truncateText(book.description)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StackView;
