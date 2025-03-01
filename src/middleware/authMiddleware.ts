import { ConfidentialClientApplication } from "@azure/msal-node";
import type { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient, { JwksClient, SigningKey } from "jwks-rsa";

import { env } from "@/common/utils/envConfig";

let cca: ConfidentialClientApplication | undefined;

if (env.NODE_ENV !== "development") {
  const clientId = process.env.AZURE_AD_CLIENT_ID;
  const authority = `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}`;
  const clientSecret = process.env.AZURE_AD_CLIENT_SECRET;

  if (!clientId || !authority || !clientSecret) {
    throw new Error("Azure AD configuration is invalid. Please check environment variables.");
  }

  const msalConfig = {
    auth: {
      clientId,
      authority,
      clientSecret,
    },
  };

  cca = new ConfidentialClientApplication(msalConfig);
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  // Skip Azure authentication in development mode
  if (env.NODE_ENV === "development") {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("Authorization header missing");
  }

  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).send("Invalid authorization header format");
  }
  const token = tokenParts[1];
  try {
    if (!cca) {
      throw new Error("Azure AD client not initialized");
    }
    const tokenResponse = await cca.acquireTokenOnBehalfOf({
      oboAssertion: token,
      scopes: ["User.Read"],
    });
    if (tokenResponse?.account) {
      next();
    } else {
      res.status(401).send("Invalid token");
    }
  } catch (error) {
    res.status(401).send("Invalid token");
  }
};

// Middleware to verify Azure AD token
const verifyAzureToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Skip Azure authentication in development mode
  if (env.NODE_ENV === "development") {
    req.user = {
      sub: "dev-user-id",
      name: "Development User",
      email: "dev@example.com",
      oid: "dev-oid",
    };
    return next();
  }

  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    // In production, we'll use the authenticate middleware for token verification
    authenticate(req, res, next);
  } catch (error) {
    res.status(500).json({ message: "Error verifying token", error: (error as Error).message });
  }
};

export default verifyAzureToken;
