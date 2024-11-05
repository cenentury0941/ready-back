import { MongoClient } from "mongodb";
import type { Book } from "./bookModel";

import { config } from "dotenv";

config();

const uri = process.env.DOCUMENTDB_URI || ""; // Ensure environment variable is set
const client = new MongoClient(uri);

export const getBooks = async (): Promise<Book[]> => {
  try {
    await client.connect();
    const database = client.db(process.env.DOCUMENTDB_DB_NAME); // Replace with your database name
    const collection = database.collection<Book>("inventory");

    const books = await collection.find().toArray();
    console.log(books);
    return books;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw new Error("Failed to fetch books");
  } finally {
    await client.close();
  }
};
