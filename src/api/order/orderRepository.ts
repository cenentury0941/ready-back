import type { Order } from "./orderModel";

const orders: Order[] = [];

export class OrderRepository {
  async save(order: Order): Promise<Order> {
    orders.push(order);
    return order;
  }

  async findByUserIdAsync(userId: number): Promise<Order[]> {
    return orders.filter(order => order.userId === userId);
  }
  async findByIdAsync(id: number): Promise<Order | undefined> {
    return orders.find(order => order.id === id);
  }

  async findAllAsync(): Promise<Order[]> {
    return orders;
  }
}
