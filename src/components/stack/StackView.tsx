import { type Component, For, createSignal, createComputed } from "solid-js";
import styles from "./StackView.module.css";
import type { Book } from "@/types";

interface StackViewProps {
  bks: Book[];
}

const StackView: Component<StackViewProps> = (props) => {
  const { bks } = props as { bks: Book[] };
  const [books, setBooks] = createSignal<Book[]>([]);

  const [loading, setLoading] = createSignal(true);

  createComputed(() => {
    if (bks.length) {
      setBooks(bks);
      setLoading(false);
    }
  });

  return (
    <div>
      {loading() ? (
        <div>Loading...</div>
      ) : (
        <div class={styles.books}>
          <h1>Stack</h1>
          <For each={books()}>
            {(book) => (
              <div>
                <h2>{book.title}</h2>
                <p>{book.description}</p>
              </div>
            )}
          </For>
        </div>
      )}
    </div>
  );
};

export default StackView;
