export interface BaseMedia {
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

export interface Book extends BaseMedia {}

export interface Artwork extends BaseMedia {
  is3d: string;
}

export interface About {
  title: string;
  text: string;
}

export interface ApiResponse {
  code: number;
  result: Book[] | About | Artwork[] | null;
}
