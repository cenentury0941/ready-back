import { MongoClient } from "mongodb";
import type { Book } from "./bookModel";

import { config } from "dotenv";

config();

const uri = process.env.DOCUMENTDB_URI || ""; // Ensure environment variable is set
const client = new MongoClient(uri);

export const updateBookQuantity = async (bookId: string, quantity: number): Promise<boolean> => {
  try {
    await client.connect();
    const database = client.db(process.env.DOCUMENTDB_DB_NAME);
    const collection = database.collection<Book>("inventory");

    const book = await collection.findOne({ id: bookId });
    if (!book || book.qty < quantity) {
      return false; // Not enough quantity available
    }

    await collection.updateOne({ id: bookId }, { $inc: { qty: -quantity } });

    return true; // Quantity updated successfully
  } catch (error) {
    // Use a proper logging library for error logging
    console.error("Error updating book quantity:", error); // Replace with a logging library
    throw new Error("Failed to update book quantity");
  } finally {
    await client.close();
  }
};

export const getBooks = async (): Promise<Book[]> => {
  try {
    await client.connect();
    const database = client.db(process.env.DOCUMENTDB_DB_NAME); // Replace with your database name
    const collection = database.collection<Book>("inventory");

    const books = await collection.find().toArray();
    return books;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw new Error("Failed to fetch books");
  } finally {
    await client.close();
  }
};
