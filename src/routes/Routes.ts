import oEnvironment from '../constants/Environment';
import express from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const routes = (app: express.Application) => {
  // Rutas con autenticación
  app.use(`${oEnvironment.URL_API}admin`, AuthMiddleware, require('./Users'));

  // Rutas sin autenticación
  app.use(`${oEnvironment.URL_API}admin`, require('./Users'));
};

export { routes }; // Exportamos 'routes' para poder importarlo correctamente en otros archivos
