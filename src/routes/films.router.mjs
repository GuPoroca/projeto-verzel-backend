import { Router } from 'express';
import FilmsController from '../controllers/films.controller.mjs';

const routes = Router();

const filmsController = new FilmsController();
  
  //searchFilms
  routes.get('/api/films', (request, response) =>
    filmsController.search(request, response)
  );

  //favorite
  routes.post('/api/films', (request, response) =>
    filmsController.favorite(request, response)
  );

  
  export default routes;