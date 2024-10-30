import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { OrderSchema, CreateOrderSchema } from "./orderModel";
import { orderController } from "./orderController";
import { validateRequest } from "@/common/utils/httpHandlers";

export const orderRegistry = new OpenAPIRegistry();
export const orderRouter: Router = express.Router();

orderRegistry.register("Order", OrderSchema);

orderRegistry.registerPath({
  method: "post",
  path: "/orders",
  tags: ["Order"],
  request: {
    body: {
      content: { 
        "application/json" : { schema: CreateOrderSchema.shape.body },
      }}},
  responses: createApiResponse(OrderSchema, "Order accepted"),
});

orderRegistry.registerPath({
  method: "get",
  path: "/orders/{id}",
  tags: ["Order"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  responses: createApiResponse(OrderSchema, "Order found"),
});

orderRegistry.registerPath({
  method: "get",
  path: "/orders",
  tags: ["Order"],
  responses: createApiResponse(z.array(OrderSchema), "Orders found"),
});

orderRegistry.registerPath({
  method: "get",
  path: "/orders/user/{userId}",
  tags: ["Order"],
  parameters: [
    {
      name: "userId",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  responses: createApiResponse(z.array(OrderSchema), "Orders found for user"),
});

orderRouter.post("/", validateRequest(CreateOrderSchema), orderController.confirmOrder);
orderRouter.get("/:id", orderController.getOrderById);
orderRouter.get("/", orderController.getAllOrders);
orderRouter.get("/user/:userId", orderController.getOrdersByUserId);
