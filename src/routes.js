import { Router } from "express";

import CartsController from "./controllers/CartsController";

import TransactionsController from "./controllers/TransactionsController";

const routes = new Router();

routes.get('/cart', CartsController.index);
routes.post('/cart', CartsController.create);
routes.put('/cart/:id', CartsController.update);
routes.delete('/cart/:id', CartsController.delete);


routes.post('/transactions', TransactionsController.create);

export default routes;