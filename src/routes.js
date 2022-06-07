import { Router } from "express";

import CartsController from "./controllers/CartsController";

const routes = new Router();

routes.get('/cart', CartsController.index);
routes.post('/cart', CartsController.create);
routes.put('/cart/:id', CartsController.update);
routes.delete('/cart/:id', CartsController.delete);

export default routes;