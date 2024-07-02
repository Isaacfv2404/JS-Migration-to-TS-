import oEnvironment from '../constants/Environment';
import express from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import Users from './Users';

const routes = (app: express.Application) => {

  app.use(`${oEnvironment.URL_API}admin`, AuthMiddleware, Users);

  app.use(`${oEnvironment.URL_API}admin`, Users);
};

export default routes;
