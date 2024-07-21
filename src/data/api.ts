import type { Book, About, ApiResponse } from "@/types.ts";
const api = "http://localhost:3000/api/query";

const username = import.meta.env.VITE_API_USERNAME;
const password = import.meta.env.VITE_API_PASSWORD;

export const fetchQuery = async (body: {}): Promise<ApiResponse> => {
  const authString = `${username}:${password}`;
  const encodedAuthString = Buffer.from(authString).toString("base64");

  try {
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${encodedAuthString}`,
      },
      body: JSON.stringify(body),
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error; // Optional: re-throw the error if needed
  }
};

export async function fetchBooks(): Promise<Book[]> {
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
      return response.result as Book[];
    }

    return [];
  } catch (error) {
    console.error(error);
    throw error; // Optional: re-throw the error if needed
  }
}

export async function fetchAbout(): Promise<About | null> {
  const query = "page('about')";
  const select = {
    title: true,
    text: "page.text.kirbytext",
  };

  try {
    const response = await fetchQuery({ query, select });

    if (response && response.code === 200) {
      return response.result as About;
    }

    return null;
  } catch (error) {
    console.error(error);
    throw error; // Optional: re-throw the error if needed
  }
}
