import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import JWT from "jsonwebtoken";
import basicAuthMiddleware from "../middlewares/basic-authentication.middleware";

const route = Router();

route.post(
  "/token",
  basicAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.body;

      const token = JWT.sign({}, "teste", {
        audience: user.uuid,
        subject: user.uuid,
      });

      return res.status(StatusCodes.OK).json({ token });
    } catch (error) {
      next(error);
    }
  }
);

export default route;
