import { Router } from "express";

import CartsController from "./controllers/CartsController";

const routes = new Router();

routes.get('/cart', CartsController.index);

export default routes;