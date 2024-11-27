import { z } from "zod";

export interface Note {
  text: string;
  contributor: string;
  imageUrl: string;
}

export interface Book {
  title: string;
  author: string;
  thumbnailUrl: string;
  about: string;
  qty: number;
  notes: Note[];
}

export const fileSchema = z.object({
  file: z.instanceof(File),
})

export const addBookSchema = z.object({
  message: z.string(),
})