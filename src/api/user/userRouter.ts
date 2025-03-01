import fs from "node:fs";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import multer from "multer";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { CreateUserSchema, GetUserSchema, UserSchema, fileSchema, uploadPhotoSchema } from "@/api/user/userModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import verifyAzureToken from "@/middleware/authMiddleware";
import { userController } from "./userController";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

// Ensure the "uploads" directory exists
const uploadsDir = "uploads";

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({ dest: uploadsDir });

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
  method: "get",
  path: "/users",
  tags: ["User"],
  responses: createApiResponse(z.array(UserSchema), "Success"),
});

userRouter.get("/", userController.getUsers);

userRegistry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["User"],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.get("/:id", validateRequest(GetUserSchema), userController.getUser);

userRegistry.registerPath({
  method: "post",
  path: "/users",
  tags: ["User"],
  request: { body: { content: { "application/json": { schema: CreateUserSchema.shape.body } } } },
  responses: createApiResponse(UserSchema, "User created successfully"),
});

userRouter.post("/", validateRequest(CreateUserSchema), userController.createUser);

userRegistry.registerPath({
  method: "post",
  path: "/users/upload-photo",
  tags: ["User"],
  request: {
    body: {
      content: { "multipart/form-data": { schema: fileSchema } },
    },
  },
  responses: createApiResponse(uploadPhotoSchema, "Photo uploaded successfully"),
});

userRouter.post("/upload-photo", verifyAzureToken, upload.single("file"), userController.uploadPhoto);
