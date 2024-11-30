import { DatabaseSync } from 'node:sqlite';

const database = new DatabaseSync('./url-shortener.db', { open: false });

export default database;
