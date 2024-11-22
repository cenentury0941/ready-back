import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const OrderSchema = z.object({
  id: z.string().openapi({ description: "Order ID" }),
  userId: z.string().openapi({ description: "User ID" }),
  fullName: z.string().openapi({ description: "Full name of the user" }),
  location: z.string().openapi({ description: "Location of the order" }),
  items: z
    .array(z.object({ productId: z.string().openapi({ description: "Product ID" }) }))
    .openapi({ description: "List of items" }),
  confirmationNumber: z.string().openapi({ description: "Confirmation number" }),
  status: z.string().openapi({ description: "Order status" }),
  createdAt: z.date().openapi({ description: "Creation date" }),
  updatedAt: z.date().openapi({ description: "Last update date" }),
});

export const CreateOrderSchema = z.object({
  body: z.object({
    userId: z.string().openapi({ description: "User ID" }),
    fullName: z.string().openapi({ description: "Full name of the user" }),
    location: z.string().openapi({ description: "Location of the order" }),
    items: z
      .array(z.object({ productId: z.string().openapi({ description: "Product ID" }) }))
      .openapi({ description: "List of items" }),
  }),
});

export type Order = z.infer<typeof OrderSchema>;
