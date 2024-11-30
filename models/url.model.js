import database from '../utils/database.js';

export class UrlModel {
  id;
  long_url;
  short_url;
  created_at;
  updated_at;
  is_active;

  /**
   * @param {object} url_object
   * @param {string} url_object.long_url
   * @param {string} url_object.short_url
   * @returns {UrlModel}
   */
  static save(url_object) {
    database.open();

    const insert = database.prepare(
      'INSERT INTO urls (long_url, short_url, created_at, updated_at) VALUES (?, ?, ?, ?)',
    );

    const now = new Date().toISOString();
    insert.run(url_object.long_url, url_object.short_url, now, now);

    const select = database.prepare('SELECT * FROM urls WHERE short_url = ?');

    const url = select.get(url_object.short_url);

    database.close();

    return url;
  }

  /**
   * @param {string} long_url
   * @returns {UrlModel}
   */
  static find_by_long_url(long_url) {
    database.open();
    const select = database.prepare('SELECT * FROM urls WHERE long_url = ?');
    const data = select.get(long_url);
    database.close();
    return data;
  }
}
