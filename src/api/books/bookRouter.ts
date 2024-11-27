import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Request, type Response, type Router } from "express";
import BookController from "./bookController";

export const bookRouter: Router = express.Router();
const bookController = new BookController();

// Define the OpenAPI registry for books
export const bookRegistry = new OpenAPIRegistry();

// Existing route definitions...

// Add route definition for adding a note to a book
bookRegistry.registerPath({
  method: "post",
  path: "/books/{id}/notes",
  description: "Add a note to a book",
  tags: ["Books"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["text", "contributor"],
          properties: {
            text: { type: "string" },
            contributor: { type: "string" },
            imageUrl: { type: "string" },
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Note added successfully",
      content: {
        "application/json": {
          schema: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    400: {
      description: "Invalid request",
    },
    500: {
      description: "Server error",
    },
  },
});

// Add route definition for updating a note in a book
bookRegistry.registerPath({
  method: "put",
  path: "/books/{id}/notes/{noteIndex}",
  description: "Update a note in a book",
  tags: ["Books"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
    {
      name: "noteIndex",
      in: "path",
      required: true,
      schema: { type: "integer" },
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["text", "contributor"],
          properties: {
            text: { type: "string" },
            contributor: { type: "string" },
            imageUrl: { type: "string" },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Note updated successfully",
      content: {
        "application/json": {
          schema: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    404: {
      description: "Note not found",
    },
    400: {
      description: "Invalid request",
    },
    500: {
      description: "Server error",
    },
  },
});

// Add route definition for deleting a note from a book
bookRegistry.registerPath({
  method: "delete",
  path: "/books/{id}/notes/{noteIndex}",
  description: "Delete a note from a book",
  tags: ["Books"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
    {
      name: "noteIndex",
      in: "path",
      required: true,
      schema: { type: "integer" },
    },
  ],
  responses: {
    200: {
      description: "Note deleted successfully",
      content: {
        "application/json": {
          schema: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    404: {
      description: "Note not found",
    },
    400: {
      description: "Invalid request",
    },
    500: {
      description: "Server error",
    },
  },
});

// Existing routes...

bookRouter.get("/", (req: Request, res: Response) => bookController.getBooks(req, res));
bookRouter.get("/:id", (req: Request, res: Response) => bookController.getBookById(req, res));
bookRouter.post("/", (req: Request, res: Response) => bookController.createBook(req, res));
bookRouter.put("/:id", (req: Request, res: Response) => bookController.updateBook(req, res));
bookRouter.delete("/:id", (req: Request, res: Response) => bookController.deleteBook(req, res));

// Add the new route for adding a note to a book
bookRouter.post("/:id/notes", (req: Request, res: Response) => bookController.addNoteToBook(req, res));

// Add the new route for updating a note in a book
bookRouter.put("/:id/notes/:noteIndex", (req: Request, res: Response) => bookController.updateNoteInBook(req, res));

// Add the new route for deleting a note from a book
bookRouter.delete("/:id/notes/:noteIndex", (req: Request, res: Response) => bookController.deleteNoteFromBook(req, res));
