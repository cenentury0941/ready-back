import type { Book } from "./bookModel";
import { addNoteToBook as addNoteToBookInRepo, getBookById as getBookByIdFromRepo, getBooks } from "./bookRepository";

class BookService {
  public async getAllBooks(): Promise<Book[]> {
    return await getBooks();
  }

  public async getBookById(id: string): Promise<Book | null> {
    return await getBookByIdFromRepo(id);
  }

  public async addNoteToBook(id: string, note: { text: string; contributor: string; imageUrl: string }): Promise<void> {
    await addNoteToBookInRepo(id, note);
  }

  public async createBook(bookData: Partial<Book>): Promise<Book> {
    // Implement logic to create a new book
    return {} as Book;
  }

  public async updateBook(id: string, bookData: Partial<Book>): Promise<Book | null> {
    // Implement logic to update a book
    return null;
  }

  public async deleteBook(id: string): Promise<boolean> {
    // Implement logic to delete a book
    return false;
  }
}

export default BookService;
