import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const devAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  // In development mode, we'll add a mock user to the request
  req.user = {
    sub: "dev-user-id",
    name: "Development User",
    email: "dev@example.com",
    oid: "dev-oid",
  };
  next();
};

export default devAuthenticate;
