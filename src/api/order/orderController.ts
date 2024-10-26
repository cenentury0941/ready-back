import type { Request, RequestHandler, Response } from "express";
import { orderService } from "./orderService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { OrderRepository } from "./orderRepository";

const orderRepository = new OrderRepository();

class OrderController {
  public confirmOrder: RequestHandler = async (req: Request, res: Response) => {
    const orderData = req.body;
    const serviceResponse = await orderService.confirmOrder(orderData);
    return handleServiceResponse(serviceResponse, res);
  };

  public getOrdersByUserId: RequestHandler = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    const serviceResponse = await orderService.findByUserId(userId);
    return handleServiceResponse(serviceResponse, res);
  };

  public getOrderById: RequestHandler = async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const order = await orderRepository.findByIdAsync(orderId);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  };

  public getAllOrders: RequestHandler = async (_req: Request, res: Response) => {
    const orders = await orderRepository.findAllAsync();
    res.status(200).json(orders);
  };
}

export const orderController = new OrderController();
