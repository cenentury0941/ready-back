import { v4 as uuidv4 } from "uuid";
import { OrderSchema, type Order } from "./orderModel";
import { OrderRepository } from "./orderRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { logger } from "@/server";

export class OrderService {
  private orderRepository: OrderRepository;

  constructor(repository: OrderRepository = new OrderRepository()) {
    this.orderRepository = repository;
  }

  // Retrieves orders by user ID
  async findByUserId(userId: number): Promise<ServiceResponse<Order[] | null>> {
    try {
      const orders = await this.orderRepository.findByUserIdAsync(userId);
      if (!orders || orders.length === 0) {
        return ServiceResponse.failure("No Orders found for user", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Order[]>("Orders found for user", orders);
    } catch (ex) {
      const errorMessage = `Error finding orders for user with id ${userId}: ${ex instanceof Error ? ex.message : 'Unknown error'}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving orders for user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Confirms an order and saves it to the database
  async confirmOrder(orderData: Partial<Order>): Promise<ServiceResponse<Order | null>> {
    try {
      const parsedOrderData = OrderSchema.omit({
        id: true,
        confirmationNumber: true,
        createdAt: true,
        updatedAt: true,
      }).parse(orderData);

      const newOrder: Order = {
        ...parsedOrderData,
        id: uuidv4(),
        confirmationNumber: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const savedOrder = await this.orderRepository.save(newOrder);
      return ServiceResponse.success<Order>("Order confirmed", savedOrder);
    } catch (error) {
      const errorMessage = `Failed to confirm order: ${error instanceof Error ? error.message : 'Unknown error'}`;
      logger.error(errorMessage);
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
      const errorMessage = `Error finding all orders: ${ex instanceof Error ? ex.message : 'Unknown error'}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving orders.",
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
      const errorMessage = `Error finding order with id ${id}: ${ex instanceof Error ? ex.message : 'Unknown error'}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding order.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const orderService = new OrderService();
