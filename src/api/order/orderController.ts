import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { Request, RequestHandler, Response } from "express";
import { getBookById } from "../books/bookRepository";
import { OrderRepository } from "./orderRepository";
import { orderService } from "./orderService";

const orderRepository = new OrderRepository();

class OrderController {
  public confirmOrder: RequestHandler = async (req: Request, res: Response) => {
    const orderData = req.body;
    const serviceResponse = await orderService.confirmOrder(orderData);
    return handleServiceResponse(serviceResponse, res);
  };

  public getOrdersByUserId: RequestHandler = async (req: Request, res: Response) => {
    const userId = req.params.userId;
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
    for (let i = 0; i < orders.length; i++) {
      const items = orders[i].items;
      const updateItems = [];
      for (let j = 0; j < items.length; j++) {
        const item = items[j];
        const book = await getBookById(item.productId);
        updateItems.push({
          ...item,
          ...book,
        });
      }
      orders[i].items = updateItems;
    }
    res.status(200).json(orders);
  };

  public updateOrderStatus: RequestHandler = async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const { status } = req.body;
    const serviceResponse = await orderService.updateOrderStatus(orderId, status);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const orderController = new OrderController();
