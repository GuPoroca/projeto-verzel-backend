import { Router } from "express";
import FilmsController from "../controllers/films.controller.mjs";

const routes = Router();

const filmsController = new FilmsController();

//searchFilms
routes.post("/api/films", (request, response) =>
  filmsController.search(request, response)
);

routes.post("/api/test", (request, response) =>
  filmsController.test(request, response)
);

//favorite
routes.post("/api/favorite", (request, response) =>
  filmsController.favorite(request, response)
);

routes.get("/api/films/:hash", (request, response) =>
  filmsController.favoriteList(request, response)
);

export default routes;
