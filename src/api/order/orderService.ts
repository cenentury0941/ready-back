import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { ServiceResponse } from "../../common/models/serviceResponse";
import { logger } from "../../server";
import { updateBook } from "../books/bookRepository";
import { type Order, OrderSchema } from "./orderModel";
import { OrderRepository } from "./orderRepository";

interface OrderItem {
  productId: string;
  quantity: number;
}

export class OrderService {
  private orderRepository: OrderRepository;

  constructor(repository: OrderRepository = new OrderRepository()) {
    this.orderRepository = repository;
  }

  // Retrieves orders by user ID
  async findByUserId(userId: string): Promise<ServiceResponse<Order[] | null>> {
    try {
      const orders = await this.orderRepository.findByUserIdAsync(userId);
      if (!orders || orders.length === 0) {
        return ServiceResponse.failure("No Orders found for user", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Order[]>("Orders found for user", orders);
    } catch (ex) {
      const errorMessage = `Error finding orders for user with id ${userId}: ${ex instanceof Error ? ex.message : "Unknown error"}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving orders for user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Confirms an order and saves it to the database
  async confirmOrder(orderData: Partial<Order & { items: OrderItem[] }>): Promise<ServiceResponse<Order | null>> {
    try {
      if (!orderData.items || orderData.items.length === 0) {
        return ServiceResponse.failure("Order must contain at least one item", null, StatusCodes.BAD_REQUEST);
      }

      // Check if the order contains more than one book
      if (orderData.items.length > 1) {
        return ServiceResponse.failure("An order can only contain one book", null, StatusCodes.BAD_REQUEST);
      }

      // Check if the user already has an order
      const existingOrders = await this.orderRepository.findByUserIdAsync(orderData.userId);
      if (existingOrders.length > 0) {
        return ServiceResponse.failure("Only one book can be purchased by a user", null, StatusCodes.BAD_REQUEST);
      }
      console.log("order service - items:", orderData.items);
      for (let i = 0; i < orderData.items.length; i++) {
        const bookId = orderData.items[i].productId;
        if (!bookId) {
          return ServiceResponse.failure("Product ID is required", null, StatusCodes.BAD_REQUEST);
        }
        const quantity = orderData.items[i].quantity;
        const isUpdated = await updateBook(bookId, { qty: quantity });
        if (!isUpdated) {
          return ServiceResponse.failure("Insufficient quantity available", null, StatusCodes.BAD_REQUEST);
        }
      }

      const parsedOrderData = OrderSchema.omit({
        id: true,
        confirmationNumber: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      }).parse(orderData);

      const newOrder: Order = {
        ...parsedOrderData,
        id: uuidv4(),
        confirmationNumber: uuidv4(),
        status: "Received",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const savedOrder = await this.orderRepository.save(newOrder);
      return ServiceResponse.success<Order>("Order confirmed", savedOrder);
    } catch (error) {
      const errorMessage = `Failed to confirm order: ${error instanceof Error ? error.message : "Unknown error"}`;
      logger.error(error);
      return ServiceResponse.failure("Failed to confirm order", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Retrieves all orders from the database
  async findAll(): Promise<ServiceResponse<Order[] | null>> {
    try {
      const orders = await this.orderRepository.findAllAsync();
      if (!orders || orders.length === 0) {
        return ServiceResponse.failure("No Orders found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Order[]>("Orders found", orders);
    } catch (ex) {
      const errorMessage = `Error finding all orders: ${ex instanceof Error ? ex.message : "Unknown error"}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving orders.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOrderStatus(id: string, newStatus: string): Promise<ServiceResponse<Order | null>> {
    try {
      const order = await this.orderRepository.findByIdAsync(id);
      if (!order) {
        return ServiceResponse.failure("Order not found", null, StatusCodes.NOT_FOUND);
      }
      order.status = newStatus; // Update the status
      const updatedOrder = await this.orderRepository.updateStatus(id, newStatus);
      return ServiceResponse.success<Order>("Order status updated", order);
    } catch (ex) {
      const errorMessage = `Error updating order status for order with id ${id}: ${ex instanceof Error ? ex.message : "Unknown error"}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating order status.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieves a single order by its ID
  async findById(id: string): Promise<ServiceResponse<Order | null>> {
    try {
      const order = await this.orderRepository.findByIdAsync(id);
      if (!order) {
        return ServiceResponse.failure("Order not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Order>("Order found", order);
    } catch (ex) {
      const errorMessage = `Error finding order with id ${id}: ${ex instanceof Error ? ex.message : "Unknown error"}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding order.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const orderService = new OrderService();
