export interface Note {
  text: string;
  contributor: string;
  imageUrl: string;
}

export interface Book {
  title: string;
  author: string;
  thumbnailUrl: string;
  qty: number;
  notes: Note[];
}
