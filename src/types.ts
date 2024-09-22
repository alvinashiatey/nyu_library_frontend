export interface Book {
  title: string;
  slug: string;
  date: string;
  description: string;
  stack: string;
  files: {
    type: string;
    url: string;
  }[];
}

export interface About {
  title: string;
  text: string;
}

export interface ApiResponse {
  code: number;
  result: Book[] | About | null;
}
