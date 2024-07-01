import oEnvironment from '../constants/Environment';
import {AuthMiddleware} from '../middleware/AuthMiddleware';

export const app:any = (oApp:any) => {
  // Routes with authentication
  oApp.use(`${oEnvironment.URL_API}admin`, AuthMiddleware, require('./Users'));

  // Routes without authentication
  oApp.use(`${oEnvironment.URL_API}admin`, require('./Users'));
};