import { createStore } from "solid-js/store";
import type { Book } from "@/types";
import { fetchQuery } from "@/data/api";

const useStore = () => {
  const [books, setBooks] = createStore<Book[]>([]);

  const getBooks = async () => {
    const query = "page('books').children.sortBy('date', 'desc')";
    const select = {
      title: true,
      slug: true,
      date: "page.date.toDate('d.m.Y')",
      description: true,
      stack: true,
      files: {
        query: "page.files",
        select: {
          type: true,
          url: true,
        },
      },
    };

    try {
      const response = await fetchQuery({ query, select });

      if (response && response.code === 200) {
        setBooks(response.result as Book[]);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    books,
    getBooks,
  };
};

export { useStore };
