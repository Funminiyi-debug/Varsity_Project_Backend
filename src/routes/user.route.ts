import UserController from "../controllers/user.controller";
import UserService from "../services/user.service";
import express, { Request, Response } from "express";
import { DataResponse } from "../interfaces/DataResponse";
import { handleResponse } from "../utils/handleResponse";
import { container } from "../containerDI";
import Types from "../types";
import middleWare from "../middlewares/auth";
import validatorMiddleware from "../middlewares/schemaValidator";
import { userSchema, identifierSchema } from "../validators";

const router = express.Router();
const userService = container.get<UserService>(Types.IUserService);
const Users = new UserController(userService);

//geting all users
router.get("/", async (req: Request, res: Response) => {
  const response: DataResponse = await Users.getAllUsers();
  return handleResponse(res, response);
});

//geting single user
router.get("/:id", async (req: Request, res: Response) => {
  const response: DataResponse = await Users.getUser(req.params.id);
  return handleResponse(res, response);
});

router.put(
  "/:id",
  validatorMiddleware(identifierSchema, userSchema),
  async (req: Request, res: Response) => {
    const data = await Users.updateUser(req.params.id, req.body);
    res.status(201).json({ sucess: "ok", data: data });
  }
);

router.delete("/:id", async (req: Request, res: Response) => {
  const response = await Users.deleteUser(req.params.id);

  return handleResponse(res, response);
});
export default router;
