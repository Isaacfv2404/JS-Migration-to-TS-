import { PERMISSIONS } from "../constants/StatusCode";
import UserController from "../controllers/UserController";

const Controller = new UserController();

/**
 * Middleware encargado de la autenticación y permisos sobre cada ruta del sistema
 */
export const AuthMiddleware = (oRequest: any, oResponse: any, oNext: any) => {
  let sToken = oRequest.headers.authorization;
  try {
    if (!sToken)
      return Controller.respond(oResponse, PERMISSIONS);
    Controller.findByToken(sToken, (oUser, bIsError = false) => {
      if (!bIsError && oUser) {
        oRequest.oUser = oUser;
        return oNext();
      }
      return Controller.respond(oResponse, PERMISSIONS);
    });
  } catch (oException) {
    if (typeof oException === 'string' || typeof oException === 'object' || oException === null || oException === undefined) {
      return Controller.respond(oResponse, PERMISSIONS, null, oException);
    } else {
      return Controller.respond(oResponse, PERMISSIONS, null, 'Unknown error');
    }
  }
};