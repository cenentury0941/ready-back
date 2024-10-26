import { z } from "zod";

export const OrderSchema = z.object({
  id: z.number(),
  userId: z.number(),
  fullName: z.string(),
  location: z.string(),
  items: z.array(z.object({ productId: z.string() })),
  confirmationNumber: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});


export const CreateOrderSchema = z.object({
  body: z.object({
    userId: z.number(),
    fullName: z.string(),
    location: z.string(),
    items: z.array(z.object({ productId: z.string() })),
  })
})

export type Order = z.infer<typeof OrderSchema>;
