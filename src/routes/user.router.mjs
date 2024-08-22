import { Router } from "express";
import UserController from "../controllers/user.controller.mjs";

const routes = Router();

const userController = new UserController();

//auth
routes.get("/api/auth", (request, response) =>
  userController.auth(request, response)
);
//cria 1 user
routes.post("/api/user", (request, response) =>
  userController.storeUser(request, response)
);
//get 1 user
routes.get("/api/user/:email", (request, response) =>
  userController.getOneUser(request, response)
);


export default routes;
