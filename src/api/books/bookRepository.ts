import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb"; // Removed ModifyResult import
import type { Book, Note } from "./bookModel";

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
    const queryId = bookId.trim();
    let book: Book | null = null;

    // Try to find by '_id'
    try {
      const objectId = new ObjectId(queryId);
      book = await collection.findOne({ _id: objectId });
    } catch (err) {
      // If invalid ObjectId, ignore and try by 'id' field
    }

    // If not found, try to find by 'id' field
    if (!book) {
      book = await collection.findOne({ id: queryId });
    }

    return book;
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    throw new Error("Failed to fetch book by ID");
  } finally {
    await client.close();
  }
};

export const updateBook = async (bookId: string, updateData: Partial<Book>): Promise<Book | null> => {
  const { client, collection } = await connectToDatabase();
  try {
    const queryId = bookId.trim();
    let updatedBook: Book | null = null;

    // Try to update by '_id'
    try {
      const objectId = new ObjectId(queryId);
      const result = await collection.findOneAndUpdate(
        { _id: objectId },
        { $set: updateData },
        { returnDocument: "after" },
      );
      if (result) {
        updatedBook = result;
      }
    } catch (err) {
      // If invalid ObjectId, ignore and try by 'id' field
    }

    // If not updated, try to update by 'id' field
    if (!updatedBook) {
      const result = await collection.findOneAndUpdate(
        { id: queryId },
        { $set: updateData },
        { returnDocument: "after" },
      );
      if (result) {
        updatedBook = result;
      }
    }

    return updatedBook;
  } catch (error) {
    console.error("Error updating book:", error);
    throw new Error("Failed to update book");
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
    const book = await collection.findOne({ id: bookId });
    if (book) {
      const existingNote = book.notes?.find((n: Note) => n.contributor === note.contributor);
      if (existingNote) {
        throw new Error("Contributor has already added a note to this book.");
      }
      await collection.updateOne({ id: bookId }, { $push: { notes: note } });
    } else {
      throw new Error("Book not found.");
    }
  } catch (error) {
    console.error("Error adding note to book:", error);
    throw new Error("Failed to add note to book");
  } finally {
    await client.close();
  }
};
