import UserController from "../controllers/user.controller";
import express, { Request, Response } from "express";
import { DataResponse } from "../interfaces/DataResponse";
import handleResponse from "../utils/response";
import middleWare = require("../middlewares/auth");

const router = express.Router();
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
  res.status(201).json({ sucess: "ok", data: data });
});

export default router;
