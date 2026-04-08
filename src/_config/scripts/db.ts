/* Packages */
import mysql from 'mysql2/promise';

/* Local scripts */
import { variables } from './variables';

/* Create and export connection pool */
export const pool = mysql.createPool({
	host: variables.db.host,
	port: variables.db.port,
	user: variables.db.user,
	password: variables.db.password,
	database: variables.db.name,
	waitForConnections: true,
	connectionLimit: 10,
});
