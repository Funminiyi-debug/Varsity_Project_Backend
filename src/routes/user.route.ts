import UserController from "../controllers/user.controller";
import express, { Request, Response } from "express";
import handleResponse from "../utils/response";
import { DataResponse } from "../interfaces/DataResponse";

const router = express();
const Users = new UserController();
//geting all users
router.get("/users", async (req: Request, res: Response) => {
  const { ...response }: DataResponse = await Users.getAllUsers();
  return handleResponse(res, response);
});

//geting single user
router.get("/users/:id", async (req: Request, res: Response) => {
  const { ...response }: DataResponse = await Users.getUser(
    Number(req.params.id)
  );
  return handleResponse(res, response);
});

router.post("/users", async (req: Request, res: Response) => {
  const data = await Users.createUser(req.body);
  res.status(201).send({ sucess: "ok", data: data });
});

export default router;
