import oEnvironment from '../constants/Environment';
import * as oMySQL from 'mysql';

/**
 * Singleton encargado de manejar una unica conexion a la base de datos, de este modo se pueden
 *  manejar transacciones sobre MySQL con inserciones en diferentes modelos de datos.
 */
class ConnectionDB {
  /**
   * En el costructor se genera la conexion a la base de datos si aun no se ah creado y se
   *  realiza la configuracion pertinente
   */
  private static oConnection: oMySQL.Connection;

  constructor() {
    if (!ConnectionDB.oConnection) {
      ConnectionDB.oConnection = oMySQL.createConnection({
        host: oEnvironment.DB_HOST,
        user: oEnvironment.DB_USER,
        password: oEnvironment.DB_PASSWORD,
        database: oEnvironment.DB_NAME,
        port: parseInt(oEnvironment.DB_PORT || '3306', 10),
        charset: oEnvironment.DB_CHARSET,
        timezone: oEnvironment.DB_UTC,
      });

      ConnectionDB.oConnection.config.queryFormat = function (oQuery, oValues) {
        if (!oValues) return oQuery;
        return oQuery.replace(/\:(\w+)/g, (sTxt, sKey) => {
          if (oValues.hasOwnProperty(sKey)) {
            let sValue = oValues[sKey] !== '' ? oValues[sKey] : null;
            return ConnectionDB.oConnection.escape(sValue);
          }
          return sTxt;
        });
      };
    }
  }
  /**
   * Esta función retorna la instancia de la conexion a la base de datos.
   * 
   * @returns {oMySQL.ConnectionConfig}
   * 
   * @author Leandro Curbelo
   */
  public static getInstance(): oMySQL.Connection {
    if (!ConnectionDB.oConnection) {
      new ConnectionDB(); // Asegura que la conexión esté inicializada
    }
    return ConnectionDB.oConnection;
  }
}

export default ConnectionDB;