import { config } from "dotenv";
import { MongoClient } from "mongodb";
import type { Book } from "./bookModel";

config();

const uri = process.env.DOCUMENTDB_URI || ""; // Ensure environment variable is set

// Utility function to connect to the database
const connectToDatabase = async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const database = client.db(process.env.DOCUMENTDB_DB_NAME);
  const collection = database.collection<Book>("inventory");
  return { client, collection };
};

export const getBooks = async (): Promise<Book[]> => {
  const { client, collection } = await connectToDatabase();
  try {
    const books = await collection.find().toArray();
    return books;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw new Error("Failed to fetch books");
  } finally {
    await client.close();
  }
};

export const getBookById = async (bookId: string): Promise<Book | null> => {
  const { client, collection } = await connectToDatabase();
  try {
    const book = await collection.findOne({ id: bookId });
    return book;
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    throw new Error("Failed to fetch book by ID");
  } finally {
    await client.close();
  }
};

export const updateBookQuantity = async (bookId: string, quantity: number): Promise<boolean> => {
  const { client, collection } = await connectToDatabase();
  try {
    const book = await collection.findOne({ id: bookId });
    if (!book || book.qty < quantity) {
      return false; // Not enough quantity available
    }

    await collection.updateOne({ id: bookId }, { $inc: { qty: -quantity } });

    return true; // Quantity updated successfully
  } catch (error) {
    console.error("Error updating book quantity:", error);
    throw new Error("Failed to update book quantity");
  } finally {
    await client.close();
  }
};

export const addNoteToBook = async (
  bookId: string,
  note: { text: string; contributor: string; imageUrl: string },
): Promise<void> => {
  const { client, collection } = await connectToDatabase();
  try {
    await collection.updateOne({ id: bookId }, { $push: { notes: note } });
  } catch (error) {
    console.error("Error adding note to book:", error);
    throw new Error("Failed to add note to book");
  } finally {
    await client.close();
  }
};
