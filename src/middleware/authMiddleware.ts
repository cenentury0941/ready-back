import { Request, Response, NextFunction } from "express";
import { ConfidentialClientApplication } from "@azure/msal-node";

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

const cca = new ConfidentialClientApplication(msalConfig);

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
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
    const tokenResponse = await cca.acquireTokenOnBehalfOf({
      oboAssertion: token,
      scopes: ["User.Read"],
    });
    if (tokenResponse && tokenResponse.account) {
      next();
    } else {
      res.status(401).send("Invalid token");
    }
  } catch (error) {
    res.status(401).send("Invalid token");
  }
};
