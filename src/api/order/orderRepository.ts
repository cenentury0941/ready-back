import { type Collection, type Db, MongoClient, ObjectId, type UpdateResult, type WithId } from "mongodb";
import type { Order } from "./orderModel";

let db: Db;
let ordersCollection: Collection<Order>;

async function connectToDatabase() {
  if (!db) {
    const documentDbUri = process.env.DOCUMENTDB_URI;
    if (!documentDbUri) {
      throw new Error("DOCUMENTDB_URI is not set in the environment variables.");
    }
    const client = new MongoClient(documentDbUri);
    await client.connect();
    db = client.db(process.env.DOCUMENTDB_DB_NAME);
    ordersCollection = db.collection<Order>("orders");
  }
}

export class OrderRepository {
  async save(order: Order): Promise<Order> {
    await connectToDatabase();
    await ordersCollection.insertOne(order);
    return order;
  }

  async updateStatus(id: string, newStatus: string): Promise<UpdateResult> {
    await connectToDatabase();
    return await ordersCollection.updateOne({ id: id }, { $set: { status: newStatus, updatedAt: new Date() } });
  }

  async findByUserIdAsync(userId: string): Promise<Order[]> {
    await connectToDatabase();
    return ordersCollection.find({ userId: userId }).toArray();
  }

  async findByIdAsync(id: string): Promise<WithId<Order> | null> {
    await connectToDatabase();
    return ordersCollection.findOne({ id: id });
  }

  async findAllAsync(): Promise<Order[]> {
    await connectToDatabase();
    return ordersCollection.find().toArray();
  }
}
