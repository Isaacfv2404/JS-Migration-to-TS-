import Model from './Model';

const TABLE_NAME = 'users';
const DELETE_SENTENCE = 'AND deleted_at IS NULL';
const MINIMAL_COLUMNS = 'id, name, lastname, email, password, remember_token';
const ALL_COLUMNS = 'id, name, lastname, email, password, remember_token, updated_at, created_at, deleted_at';

class User extends Model {

  oConnection: any;

  constructor() {
    super(TABLE_NAME, DELETE_SENTENCE, ALL_COLUMNS, MINIMAL_COLUMNS);
  }
  /**
   * Función que busca un usuario teniendo en cuenta el email que recibe por parámetro.
   * 
   * @param {string} sEmail Email por el que se desea filtrar al usuario
   * @param {function} fCallBack Función que realiza el callback luego de procesar la busqueda del usuario
   * 
   * @return {User | string}
   * 
   * @author Leandro Curbelo
   */
  getByEmail = async (sEmail:any, fCallBack:any) => {
    try {
      let sSql = `SELECT ${MINIMAL_COLUMNS} FROM ${TABLE_NAME} WHERE email = ${this.oConnection.escape(sEmail)} ${DELETE_SENTENCE}`;
      this.oConnection.query(sSql, (oError:any, oResult:any) => {
        if (oError)
          return fCallBack(oError.message, true);
        fCallBack(oResult[0]);
      });
    } catch (oError:unknown) {
      if (oError instanceof Error) {
        fCallBack(oError.message, true);
      }else{
        fCallBack('Error desconocido', true);
      }
    }
  }
  /**
   * Función que busca un registro de usuario teniendo en cuenta el token de autenticación
   * 
   * @param {string} sToken Token por el cual se buscara al usuario
   * @param {function} fCallBack Función que realiza el callback luego de procesar la busqueda del usuario
   * 
   * @return {User | string}
   * 
   * @author Leandro Curbelo
   */
  getByToken = async (sToken:string, fCallBack:Function) => {
    try {
      let sSql = `SELECT ${MINIMAL_COLUMNS} FROM ${TABLE_NAME} WHERE remember_token = ${this.oConnection.escape(sToken)} ${DELETE_SENTENCE}`;
      this.oConnection.query(sSql, (oError:any, oResult:any) => {
        if (oError)
          return fCallBack(oError.message, true);
        fCallBack(oResult[0]);
      });
    }catch (oError:unknown) {
      if (oError instanceof Error) {
        fCallBack(oError.message, true);
      }else{
        fCallBack('Error desconocido', true);
      }
    }
  }
  /**
   * Función que actualiza el token de un usaurio con el email sEmail.
   * 
   * @param {string} sEmail Email del usuario al que se quiere modificar
   * @param {string} sToken Token de autenticacion que sera actualizado
   * @param {function} fCallBack Función a la cual se llamara una ves de terminar el proceso
   * 
   * @author Leandro Curbelo
   */
  updateToken = (sEmail:string, sToken:string, fCallBack:Function) => {
    try {
      let sSql = `UPDATE ${TABLE_NAME} SET remember_token = ${this.oConnection.escape(sToken)} WHERE email = ${this.oConnection.escape(sEmail)}`;
      this.oConnection.query(sSql, (oError:any, oResult:any) => {
        if (oError)
          return fCallBack(oError.message);
        fCallBack();
      });
    } catch (oError:unknown) {
      if (oError instanceof Error) {
        fCallBack(oError.message, true);
      }else{
        fCallBack('Error desconocido', true);
      }
    }
  }
}

export default User;