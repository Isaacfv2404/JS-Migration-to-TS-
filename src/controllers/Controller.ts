import oEnvironment from '../constants/Environment';
import { CONFLICT, NOT_FOUND, NOT_VALID, PERMISSIONS } from '../constants/StatusCode';
import Log from '../models/Log';
import { Response } from 'express';

const LogModel = new Log();

class Controller {

  constructor() { }
  /**
   * Función que retorna la respuesta.
   * 
   * @param {Response} oResponse Este objeto maneja el response de la solicitud.
   * @param {number} nStatusCode Codigo de estado de la solicud.
   * @param {Array} oData Arreglo de datos que seran devueltos en la solicitud.
   * @param {string | object} oException Mensaje de error o objeto error si lo hay.
   * 
   */
  respond = (oResponse: Response, nStatusCode: number, oData: any = null, oException: string | object | null = null): void => {
    oResponse.status(nStatusCode);
    if (oData == null) {
      switch (nStatusCode) {
        case NOT_FOUND:
          oData = { message: oEnvironment.GENERAL_MESSAGE_NOT_FOUND };
          break;
        case NOT_VALID:
          oData = { message: oEnvironment.GENERAL_MESSAGE_NOT_VALID };
          break;
        case PERMISSIONS:
          oData = { message: oEnvironment.GENERAL_MESSAGE_UNAUTHORIZED };
          break;
        default:
          oData = { message: oEnvironment.GENERAL_MESSAGE_ERROR };
          break;
      }
    }
    if (oEnvironment.DEBUG && oException !== null) {
      oData['debug'] = oException;
    }
    oResponse.json(oData);
  }
  /**
   * Función que retorna la ruta del archivo dependiendo del tipo de archivo que se recibe.
   * 
   * @param {number} nType Representa el tipo de archivo que sera descargado
   * @param {Response} oResponse Este objeto maneja el response de la solicitud.
   * 
   */
  download = (nType:number, oResponse:Response) => {
    nType = +nType;
    let sPath = '';
    try {
      switch (nType) {
        case 1:
          sPath = `${__dirname}/../../public/exports/test.xlsx`;
          oResponse.download(sPath, 'Test.xlsx');
          break;
        default:
          this.respond(oResponse, CONFLICT, { message: 'Método no implementado' });
          break;
      }
    } catch (oException) {
      LogModel.save(nType, 'Problema con la descarga del archivo', oException as string|Object, 'Controller.js', 'download');
      this.respond(oResponse, CONFLICT, null, oException as string | object);
    }
  }
}

export default Controller;