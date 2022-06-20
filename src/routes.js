import { Router } from "express";

import CartsController from "./controllers/CartsController";

import TransactionsController from "./controllers/TransactionsController";

import PostbackController from "./controllers/PostbackController";

const routes = new Router();

routes.get('/cart', CartsController.index);
routes.post('/cart', CartsController.create);
routes.put('/cart/:id', CartsController.update);
routes.delete('/cart/:id', CartsController.delete);


routes.post('/transactions', TransactionsController.create);

routes.post('/postback/pagarme', PostbackController.pagarme);

export default routes;