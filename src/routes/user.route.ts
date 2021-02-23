import UserController from "../controllers/user.controller";
import UserService from "../services/user.service";
import express, { Request, Response } from "express";
import { DataResponse } from "../interfaces/DataResponse";
import handleResponse from "../utils/response";
import { container } from "../containerDI";
import Types from "../types";
import middleWare = require("../middlewares/auth");

const router = express.Router();
const userService = container.get<UserService>(Types.IUserService);
const Users = new UserController(userService);
//geting all users
router.get("/users", async (req: Request, res: Response) => {
  const response: DataResponse = await Users.getAllUsers();
  return handleResponse(res, response);
});

//geting single user
router.get("/users/:id", async (req: Request, res: Response) => {
  const response: DataResponse = await Users.getUser(req.params.id);
  return handleResponse(res, response);
});

router.put("/users/:id", async (req: Request, res: Response) => {
  const data = await Users.updateUser(req.params.id, req.body);
  res.status(201).json({ sucess: "ok", data: data });
});

export default router;
