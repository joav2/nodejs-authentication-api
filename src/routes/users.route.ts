import { NextFunction, Request, Response, Router } from "express";
import StatusCodes from "http-status-codes";
import { User } from "../models/user.model";
import userService from "../services/user.service";

//  get /users
//  get /users/:uuid
//  post /users
//  put /users/:uuid
//  delete /users/:uuid

const route = Router();

route.get("/users", (req: Request, res: Response, next: NextFunction) => {
  const users = [{ username: "joao" }];
  res.status(StatusCodes.OK).json(users);
});

route.get(
  "/:uuid",
  async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {
      const uuid = req.params.uuid;
      const user: User | null = await userService.findByUuid(uuid);
      if (!user) {
        return res.sendStatus(StatusCodes.NO_CONTENT);
      }
      return res.status(StatusCodes.OK).json(user);
    } catch (error) {
      next(error);
    }
  }
);

route.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User = req.body;
    const uuid = await userService.create(user);
    return res.status(StatusCodes.CREATED).json({ uuid: uuid });
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

route.put(
  "/users/:uuid",
  (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const uuid = req.params.uuid;
    const modifiedUser = req.body;

    modifiedUser.uuid = uuid;

    res.status(StatusCodes.OK).send(modifiedUser);
  }
);

route.delete(
  "/users/:uuid",
  (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    res.sendStatus(StatusCodes.OK);
  }
);

export default route;
