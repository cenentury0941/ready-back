import express, { type Request, type Response, type Router } from "express";
import { fetchBooks } from "./bookService";

export const bookRouter: Router = express.Router();

bookRouter.get("/", async (req: Request, res: Response) => {
  const books = await fetchBooks();
  res.json(books);
});
