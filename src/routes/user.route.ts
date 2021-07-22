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
import adminUpdateUserSchema from "../validators/adminUpdateUser.validator";
import { flushCache, refreshCache } from "../utils/cache-data";
import adminOnly from "../middlewares/adminOnly";
import auth from "../middlewares/auth";

const router = express.Router();
const userService = container.get<UserService>(Types.IUserService);
const Users = new UserController(userService);

//geting all users
router.get(
  "/",
  auth.authenticate,
  adminOnly,
  async (req: Request, res: Response) => {
    const response: DataResponse = await Users.getAllUsers();
    return handleResponse(res, response);
  }
);

//geting single user
router.get("/:id", async (req: Request, res: Response) => {
  const response: DataResponse = await Users.getUser(req.params.id);
  return handleResponse(res, response);
});

router.put(
  "/update/:id",
  auth.authenticate,

  validatorMiddleware(identifierSchema, adminUpdateUserSchema),
  async (req: Request, res: Response) => {
    const data = await Users.updateVerificationStatus(req.params.id, req.body);
    return handleResponse(res, data);
  }
);

router.put("/:id", auth.authenticate, async (req: Request, res: Response) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res.status(422).json(error.details);
  }
  const data = await Users.updateUser(res.locals.userid, req.body);
  return handleResponse(res, data);
});

router.delete(
  "/:id",
  auth.authenticate,
  adminOnly,
  async (req: Request, res: Response) => {
    const response = await Users.deleteUser(req.params.id);

    flushCache();
    return handleResponse(res, response);
  }
);

router.post(
  "/save-ad",
  auth.authenticate,
  async (req: Request, res: Response) => {
    const response: DataResponse = await Users.savedAd(
      res.locals.userid,
      req.body
    );

    return handleResponse(res, response);
  }
);

router.post(
  "/make-admin",
  auth.authenticate,
  auth.superadmin,
  async (req: Request, res: Response) => {
    const response: DataResponse = await Users.addAdmin(req.body);

    return handleResponse(res, response);
  }
);

router.post(
  "/remove-admin",
  auth.authenticate,
  auth.superadmin,
  async (req: Request, res: Response) => {
    const response: DataResponse = await Users.removeAdmin(req.body);

    return handleResponse(res, response);
  }
);

router.get(
  "/all-admin",
  auth.authenticate,
  auth.superadmin,
  async (req: Request, res: Response) => {
    const response: DataResponse = await Users.getAdmins();

    return handleResponse(res, response);
  }
);
export default router;
