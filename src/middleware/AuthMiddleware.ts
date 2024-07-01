const { PERMISSIONS } = require('../constants/StatusCode.js');
const UserController = require('../controllers/UserController.js');
const Controller = new UserController();

/**
 * Middleware encargado de la autenticación y permisos sobre cada ruta del sistema
 */
export const AuthMiddleware = (oRequest:any, oResponse:any, oNext:any) => {
  let sToken = oRequest.headers.authorization;
  try {
    if (!sToken)
      return Controller.respond(oResponse, PERMISSIONS);
    Controller.findByToken(sToken, (oUser = null, bIsError = false) => {
      if (!bIsError && oUser) {
        oRequest.oUser = oUser;
        return oNext();
      }
      return Controller.respond(oResponse, PERMISSIONS);
    });
  } catch (oException) {
    return Controller.respond(oResponse, PERMISSIONS, null, oException);
  }
}