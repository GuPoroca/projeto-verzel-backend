import { Router } from "express";
import UserController from "../controllers/user.controller.mjs";

const routes = Router();

const userController = new UserController();

//auth
routes.post("/api/auth", (request, response) =>
  userController.auth(request, response)
);
//cria 1 user
routes.post("/api/user", (request, response) =>
  userController.storeUser(request, response)
);
//pega o user dado o hash
routes.get("/api/user/:hash", (request, response) =>
  userController.getUser(request, response)
);

export default routes;
