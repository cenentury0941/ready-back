import type { Book } from "./bookModel";
import {
  addNoteToBook as addNoteToBookInRepo,
  getBookById as getBookByIdFromRepo,
  getBooks,
  updateBook as updateBookInRepo,
  updateNoteInBook as updateNoteInBookInRepo,
  deleteNoteFromBook as deleteNoteFromBookInRepo,
} from "./bookRepository";

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

  public async updateNoteInBook(id: string, noteIndex: number, note: { text: string; contributor: string; imageUrl: string }): Promise<boolean> {
    return await updateNoteInBookInRepo(id, noteIndex, note);
  }

  public async deleteNoteFromBook(id: string, noteIndex: number): Promise<boolean> {
    return await deleteNoteFromBookInRepo(id, noteIndex);
  }

  public async createBook(bookData: Partial<Book>): Promise<Book> {
    // Implement logic to create a new book
    return {} as Book;
  }

  public async updateBook(id: string, bookData: Partial<Book>): Promise<Book | null> {
    const updatedBook = await updateBookInRepo(id, bookData);
    return updatedBook;
  }

  public async deleteBook(id: string): Promise<boolean> {
    // Implement logic to delete a book
    return false;
  }
}

export default BookService;
