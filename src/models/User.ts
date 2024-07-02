import Model from './Model';
import ConnectionDB from './ConnectionDB';

const TABLE_NAME = 'users';
const DELETE_SENTENCE = 'AND deleted_at IS NULL';
const MINIMAL_COLUMNS = 'id, name, lastname, email, password, remember_token';
const ALL_COLUMNS = 'id, name, lastname, email, password, remember_token, updated_at, created_at, deleted_at';

export interface IUser {
  id?: number;
  name: string;
  lastname: string;
  email: string;
  password: string;
  remember_token: string;
  updated_at?: Date;
  created_at?: Date;
  deleted_at?: Date;
}
class User extends Model {
  oConnection: any;
  constructor() {
    super(TABLE_NAME, DELETE_SENTENCE, ALL_COLUMNS, MINIMAL_COLUMNS); {
      this.oConnection = ConnectionDB.getInstance()
    }
  }
  /**
   * Función que busca un usuario teniendo en cuenta el email que recibe por parámetro.
   * 
   * @param sEmail Email por el que se desea filtrar al usuario
   * @param fCallBack Función que realiza el callback luego de procesar la busqueda del usuario
   * 
   * @return IUser | string
   * 
   * @author Leandro Curbelo
   */
  getByEmail = async (sEmail: string, fCallBack: (result: IUser | string, isError: boolean) => void) => {
    try {
      const sSql = `SELECT ${MINIMAL_COLUMNS} FROM ${TABLE_NAME} WHERE email = ${this.oConnection.escape(sEmail)} ${DELETE_SENTENCE}`;
      this.oConnection.query(sSql, (oError: any, oResult: IUser[]) => {
        if (oError)
          return fCallBack(oError.message, true);
        fCallBack(oResult[0], false);
      });
    } catch (oError) {
      if (oError instanceof Error) {
        fCallBack(oError.message, true);
      } else {
        fCallBack('Error desconocido', true);
      }
    }
  }

  /**
   * Función que busca un registro de usuario teniendo en cuenta el token de autenticación
   * 
   * @param sToken Token por el cual se buscara al usuario
   * @param fCallBack Función que realiza el callback luego de procesar la busqueda del usuario
   * 
   * @return IUser | string
   * 
   * @author Leandro Curbelo
   */
  getByToken = async (sToken: string, fCallBack: (result: IUser | string, isError: boolean) => void) => {
    try {
      const sSql = `SELECT ${MINIMAL_COLUMNS} FROM ${TABLE_NAME} WHERE remember_token = ${this.oConnection.escape(sToken)} ${DELETE_SENTENCE}`;
      this.oConnection.query(sSql, (oError: any, oResult: IUser[]) => {
        if (oError)
          return fCallBack(oError.message, true);
        fCallBack(oResult[0], false);
      });
    } catch (oError) {
      if (oError instanceof Error) {
        fCallBack(oError.message, true);
      } else {
        fCallBack('Error desconocido', true);
      }
    }
  }

  /**
   * Función que actualiza el token de un usaurio con el email sEmail.
   * 
   * @param sEmail Email del usuario al que se quiere modificar
   * @param sToken Token de autenticacion que sera actualizado
   * @param fCallBack Función a la cual se llamara una ves de terminar el proceso
   * 
   * @author Leandro Curbelo
   */
  updateToken = (sEmail: string, sToken: string, fCallBack: (error?: string) => void) => {
    try {
      const sSql = `UPDATE ${TABLE_NAME} SET remember_token = ${this.oConnection.escape(sToken)} WHERE email = ${this.oConnection.escape(sEmail)}`;
      this.oConnection.query(sSql, (oError: any, oResult: any) => {
        if (oError)
          return fCallBack(oError.message);
        fCallBack();
      });
    } catch (oError) {
      if (oError instanceof Error) {
        fCallBack(oError.message);
      } else {
        fCallBack('Error desconocido');
      }
    }
  }
}

export default User;