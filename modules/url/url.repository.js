import { DatabaseSync } from 'node:sqlite';
import { UrlModel } from './url.model.js';

export class UrlRepository {
  /**
   *
   * @param {DatabaseSync} database
   */
  constructor(database) {
    this.database = database;
  }

  /**
   * @param {object} data
   * @param {string} data.short_url
   * @param {string} data.long_url
   * @returns {UrlModel}
   */
  save(data) {
    try {
      const url = new UrlModel(data.long_url, data.short_url);

      this.database.open();

      const insert = this.database.prepare(
        'INSERT INTO urls (short_url, long_url, created_at, updated_at) VALUES (?, ?, ?, ?)',
      );
      insert.run(url.short_url, url.long_url, url.created_at, url.updated_at);

      const select = this.database.prepare(
        'SELECT * FROM urls WHERE short_url = ?',
      );

      const row = select.get(url.short_url);

      this.database.close();

      if (row?.id) return UrlModel.fromDatabase(row);
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * @param {string} shortUrl
   * @returns {UrlModel}
   */
  findByShortUrl(shortUrl) {
    try {
      this.database.open();

      const select = this.database.prepare(
        'SELECT * FROM urls WHERE short_url = ?',
      );
      const row = select.get(shortUrl);
      this.database.close();

      if (row?.id) return UrlModel.fromDatabase(row);
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * @param {string} long_url
   * @returns {UrlModel}
   */
  findByLongUrl(long_url) {
    try {
      this.database.open();

      const select = this.database.prepare(
        'SELECT * FROM urls WHERE long_url = ?',
      );
      const row = select.get(long_url);

      this.database.close();

      if (row?.id) return UrlModel.fromDatabase(row);
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
