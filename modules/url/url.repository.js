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
   * @param {Date?} data.expires_at
   * @param {boolean?} data.visible
   * @returns {UrlModel}
   */
  save(data) {
    try {
      if (!data.short_url || !data.long_url) return null;

      const url = new UrlModel(
        data.long_url,
        data.short_url,
        data.expires_at,
        data.visible,
      );

      this.database.open();

      const insert = this.database.prepare(
        'INSERT INTO urls (short_url, long_url, created_at, updated_at, expires_at, visible) VALUES (?, ?, ?, ?, ?, ?)',
      );

      insert.run(
        url.short_url,
        url.long_url,
        url.created_at,
        url.updated_at,
        url.expires_at,
        url.visible | 0,
      );

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
