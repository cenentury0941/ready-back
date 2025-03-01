import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export const NoteSchema = z.object({
  text: z.string(),
  contributor: z.string(),
  imageUrl: z.string().url(),
});

export const BookSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuidv4()),
  title: z.string(),
  author: z.string(),
  thumbnail: z.string().url().optional(),
  about: z.string(),
  qty: z.preprocess((value) => (typeof value === "string" ? Number.parseFloat(value) : value), z.number()),
  notes: z.array(NoteSchema).default([]),
  isApproved: z.boolean().default(false),
  addedBy: z.string().optional(),
  emailId: z.string().optional(),
  userImageUrl: z.string().url().optional(),
});

export const fileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  destination: z.string(),
  filename: z.string(),
  path: z.string(),
  size: z.number(),
});

export const addBookSchema = z.object({
  message: z.string(),
});

export type Note = z.infer<typeof NoteSchema>;
export type Book = z.infer<typeof BookSchema>;
