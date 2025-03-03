import React, { useState, useEffect } from "react";
import styles from "./StackView.module.css";
import type { Book } from "@/types";

interface StackViewProps {
  bks: Book[];
  stack?: string;
}

const StackView: React.FC<StackViewProps> = ({ bks, stack }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const paddedStack = Number(stack) < 10 ? `0${stack}` : stack;
  const background = `url(/public/range/r${paddedStack}.png)`;

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
          <div className={styles.preview}>
            <div
              className={styles.image}
              style={{ backgroundImage: background }}
            />
          </div>
          <div className={styles.content}>
            <header>
              <div className={styles.range}>
                <h2>
                  Range <span className="text-white-50">{paddedStack}</span>
                </h2>
              </div>
              <div className="back">
                <a href="/" className="btn btn-black">
                  x
                </a>
              </div>
            </header>
            <div className={styles.books}>
              {books.map((book) => (
                <a href={`/book/${book.slug}`}>
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
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StackView;
