import ConnectionDB from './ConnectionDB';

/**
 * Instancia de conexion a la base de datos, se maneja como Singleton para hacer posible el manejo
 *  de transacciones sobre la base de datos por diferentes modelos.
 */

interface ICallback {
  (result: any, isError?: boolean): void;
}

export interface IModelOptions {
  connection: any;
}
const oConnectionDB = ConnectionDB.getInstance();

/**
 * Modelo principal el cual extenderan los demas modelos y contendra funciónes en comun.
 */
class Model {
  sTable: string;
  sDeleteSentence: string;
  sAllColumns: string;
  sMinimalColumns: string;
  oConnection: ConnectionDB;

  constructor(sTable: string, sDeleteSentence: string = '', sAllColumns: string = '*', sMinimalColumns: string = sAllColumns) {
    this.sTable = sTable;
    this.sDeleteSentence = sDeleteSentence;
    this.sAllColumns = sAllColumns;
    this.sMinimalColumns = sMinimalColumns;
    this.oConnection = oConnectionDB;
  }

  /**
   * Función común para todos los modelos, retorna el contador de registros actuales activos.
   * 
   * @param fCallBack Función que sera llamada como callback, debe recibir un oResult y un bIsError (oResult, bIsError = false)
   * 
   * @author Leandro Curbelo
   */
  getCount = (fCallBack: ICallback) => {
    oConnectionDB.query(`SELECT COUNT(id) AS count FROM ${this.sTable} WHERE 1 ${this.sDeleteSentence}`, (oError: any, oResult: any) => {
      if (oError)
        return fCallBack(oError, true);
      fCallBack(oResult[0]);
    });
  }

  /**
   * Función común para todos los modelos, retorna todos los registros de la tabla.
   * 
   * @param fCallBack Función que sera llamada como callback, debe recibir un oResult y un bIsError (oResult, bIsError = false)
   * 
   * @author Leandro Curbelo
   */
  getAll = (fCallBack: ICallback) => {
    oConnectionDB.query(`SELECT ${this.sMinimalColumns} FROM ${this.sTable} WHERE 1 ${this.sDeleteSentence} ORDER BY name`, (oError: any, oResult: any) => {
      if (oError)
        return fCallBack(oError, true);
      fCallBack(oResult);
    });
  }

  /**
   * Función común para todos los modelos, busca un registro por el identificador primario de la tabla.
   * 
   * @param nId Identificador primario del registro
   * @param fCallBack Función que sera llamada como callback, debe recibir un oResult y un bIsError (oResult, bIsError = false)
   * 
   * @author Leandro Curbelo
   */
  find = (nId: number, fCallBack: ICallback) => {
    oConnectionDB.query(`SELECT ${this.sMinimalColumns} FROM ${this.sTable} WHERE id = ${oConnectionDB.escape(nId)} ${this.sDeleteSentence}`, (oError: any, oResult: any) => {
      if (oError)
        return fCallBack(oError, true);
      fCallBack(oResult[0]);
    });
  }

  /**
   * Función que realiza el borrado logico de un registro con el identificador nId
   * 
   * @param nId Identificador primario del registro
   * @param dNow Fecha del momento en que el registro se elimina
   * @param fCallBack Función que sera llamada como callback, debe recibir un oResult y un bIsError (oResult, bIsError = false)
   * 
   * @author Leandro Curbelo
   */
  remove = (nId: number, dNow: Date, fCallBack: ICallback) => {
    oConnectionDB.query(`UPDATE ${this.sTable} SET deleted_at = ${oConnectionDB.escape(dNow)} WHERE id = ${oConnectionDB.escape(nId)}`, (oError: any, oResult: any) => {
      if (oError)
        return fCallBack(oError, true);
      fCallBack(oResult[0]);
    });
  }

  /**
   * Función que elimina un registro fisicamente.
   * 
   * @param nId Identificador primario del registro
   * 
   * @author Leandro Curbelo
   */
  delete = (nId: number) => {
    oConnectionDB.query(`DELETE FROM ${this.sTable} WHERE id = ${oConnectionDB.escape(nId)}`, (oError: any, oResult: any) => { });
  }

  /**
   * Función global para todos los modelos, esta función permite la edicion de un registro
   *
   * @param oModel Datos que se deben actualizar en el modelo
   * 
   * @author Leandro Curbelo
   */
  async update(oModel: any, fCallBack: ICallback): Promise<void> {
    try {
      const sSql = `UPDATE ${this.sTable} SET ${oConnectionDB.escape(oModel)} WHERE id = ${oConnectionDB.escape(oModel.id)}`;
      oConnectionDB.query(sSql, (oError: any, oResult: any) => {
        if (oError)
          return fCallBack(oError.message, true);
        fCallBack(oResult);
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
   * Función que comienza una transaccion en la base de datos
   * 
   * @author Leandro Curbelo
   */
  beginTransaction = () => {
    oConnectionDB.beginTransaction();
  }

  /**
   * Función que realiza el commit de una transaccion
   * 
   * @author Leandro Curbelo
   */
  commitTransaction = () => {
    oConnectionDB.commit();
  }

  /**
   * Función que realiza el rollback de una transaccion
   * 
   * @author Leandro Curbelo
   */
  rollbackTransaction = () => {
    oConnectionDB.rollback();
  }
}

export default Model;