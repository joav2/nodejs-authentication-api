import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../errors/forbidden.error";
import userService from "../services/user.service";

const basicAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new ForbiddenError({ log: "Credenciais not found" });
    }

    const [authorizationType, base64Token] = authorizationHeader.split(" ");

    if (authorizationType !== "Basic") {
      throw new ForbiddenError({ log: "Invalid authorization type" });
    }

    const [username, password] = Buffer.from(base64Token, "base64")
      .toString("utf-8")
      .split(":");

    if (!username || !password) {
      throw new ForbiddenError({ log: "Credenciais not found" });
    }

    const user = await userService.findByUsernameAndPassword(
      username,
      password
    );

    if (!user) {
      throw new ForbiddenError({ log: "Invalid credentials" });
    }

    req.body = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

export default basicAuthMiddleware;
