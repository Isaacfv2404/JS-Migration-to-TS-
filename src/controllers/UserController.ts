import { Response } from 'express';
import { NOT_VALID, NOT_FOUND, DONE, CONFLICT } from '../constants/StatusCode';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User';
import Controller from '../controllers/Controller';
import { TokenGenerator, BASE16 } from 'uuid-token-generator';
const oTokenGenerator = new TokenGenerator(256, BASE16);

/**
 * Principal modelo a ser usado por el controlador
 */
const Model = new User();
/**
 * Controlador que controla los datos y la sesion del usuario.
 */
class UserController extends Controller {

  constructor() {
    super();
  }

  /**
   * Función de login, se toman los datos del usuario, se comprueba que los mismos sean correctos y se genera una nueva api token.
   * 
   * @param {Request} oRequest Request de la peticion, aqui se reciben las credenciales del usuario
   * @param {Response} oResponse Este objeto maneja el response de la solicitud
   * 
   * @author Leandro Curbelo
   */
  login = async (oRequest: any, oResponse: any) => {
    try {
      const { email: sEmail, password: sPassword } = oRequest.body;
      if (!sEmail || !sPassword)
        return this.respond(oResponse, NOT_VALID, { message: 'Se necesitan credenciales válidas' });
      
      Model.getByEmail(sEmail, async (oUser: IUser | string, bIsError: boolean = false) => {
        if (bIsError)
          return this.respond(oResponse, CONFLICT, null, oUser);
        if (!oUser || (typeof oUser === 'string') || !(await bcrypt.compare(sPassword, oUser.password!))) {
          return this.respond(oResponse, NOT_FOUND, { message: 'Credenciales incorrectas' });
        }
        
        
        const sToken = oTokenGenerator.generate();
        Model.updateToken(sEmail, sToken, (sMessageError: string | null = null) => {
          if (sMessageError)
            return this.respond(oResponse, CONFLICT, null, sMessageError);
          
          oUser.remember_token = sToken;
          this.respond(oResponse, DONE, { message: 'Login correcto', data: oUser });
        });
      });
    } catch (oException) {
      return this.handleError(oResponse, oException);
    }
  }

  /**
   * Función de logout, se obtiene el usuario y se eliminan las credenciales de acceso al sistema
   * 
   * @param {Request} oRequest Request de la peticion, aqui se reciben las credenciales del usuario
   * @param {Response} oResponse Este objeto maneja el response de la solicitud
   * 
   * @author Leandro Curbelo
   */
  logout = async (oRequest: any, oResponse: any) => {
    try {
      const sToken = oRequest.headers.authorization;
      if (!sToken) {
        return this.respond(oResponse, NOT_VALID, { message: 'No autorizado' });
      }
  
      // Utiliza findByToken para obtener oUser
      this.findByToken(sToken, (oUser: IUser | string, bIsError: boolean = false) => {
        if (bIsError || !oUser) {
          return this.respond(oResponse, DONE, { message: 'Autenticación no válida' });
        }
  
        // Verifica si oUser es de tipo IUser
        if (typeof oUser !== 'string' && oUser.email) {
          Model.updateToken(oUser.email, sToken, (sMessageError: string | null = null) => {
            this.respond(oResponse, DONE, { message: 'El usuario cerró sesión correctamente' });
          });
        } else {
          this.respond(oResponse, DONE, { message: 'El usuario no tiene email' });
        }
      });
    } catch (oException) {
      return this.handleError(oResponse, oException);
    }
  }
  

  /**
   * Función de logout, se obtiene el usuario y se eliminan las credenciales de acceso al sistema
   * 
   * @param {Request} oRequest Request de la peticion, aqui se reciben las credenciales del usuario
   * @param {Response} oResponse Este objeto maneja el response de la solicitud
   * 
   * @author Leandro Curbelo
   */
  checkToken = (oRequest: any, oResponse: any) => {
    try {
      if (!oRequest.oUser) {
        return this.respond(oResponse, NOT_VALID, { message: 'Autenticación no válida' });
      }
      
      // Verifica si oRequest.oUser es de tipo IUser
      if (typeof oRequest.oUser !== 'string' && oRequest.oUser.remember_token) {
        this.findByToken(oRequest.oUser.remember_token, (oUser: IUser | string, bIsError: boolean = false) => {
          if (bIsError || !oUser) {
            return this.respond(oResponse, NOT_VALID, { message: 'Autenticación no válida', debug: oRequest.oUser });
          }
  
          const sToken = oTokenGenerator.generate();
          Model.updateToken(oRequest.oUser.email!, sToken, (sMessageError: string | null = null) => {
            if (sMessageError) {
              return this.respond(oResponse, CONFLICT, null, sMessageError);
            }
            
            // Actualiza oUser solo si es de tipo IUser
            if (typeof oUser !== 'string') {
              oUser.remember_token = sToken;
              return this.respond(oResponse, DONE, { message: 'Token actualizado', data: oUser });
            }
          });
        });
      } else {
        return this.respond(oResponse, NOT_VALID, { message: 'Autenticación no válida', debug: oRequest.oUser });
      }
    } catch (oException) {
      return this.handleError(oResponse, oException);
    }
  }
  

  /**
   * Función encargada de buscar mediante el modelo al usuario en base a su token
   * 
   * @author Leandro Curbelo
   */
  findByToken = (sToken: string, fCallBack: (oUser: IUser | string, bIsError: boolean) => void) => {
    Model.getByToken(sToken, fCallBack);
  }

  /**
   * Función que maneja los errores y envía una respuesta al cliente
   * 
   * @param {Response} oResponse Objeto de respuesta
   * @param {any} oException Excepción ocurrida
   * 
   * @author Leandro Curbelo
   */
  handleError = (oResponse: Response, oException: any) => {
    console.error(oException);
    return this.respond(oResponse, CONFLICT, { message: 'Ocurrió un error inesperado' });
  }
}

/*
    ! COMENTARIO DE AYUDA - Fragmento de codigo que genera clave
    bcryptjs.genSalt(10, (err, salt)  => {
        bcryptjs.hash('123', salt, (err, hash) =>  {
            this.respond(oResponse, DONE, hash);
        });
    });
    return;
 */

export default UserController