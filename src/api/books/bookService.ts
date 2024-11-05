import type { Book } from "./bookModel";
import { getBooks } from "./bookRepository";

export const fetchBooks = async (): Promise<Book[]> => {
  return await getBooks();
};
