export class UrlModel {
  /**
   *
   * @param {string} long_url
   * @param {string} short_url
   */
  constructor(long_url, short_url) {
    this.long_url = long_url;
    this.short_url = short_url;
    this.created_at = new Date().toISOString();
    this.updated_at = this.created_at;
    this.is_active = true;
  }

  /**
   * @param {object} data
   * @param {string} data.long_url
   * @param {string} data.short_url
   * @param {number} data.id
   * @param {Date} data.created_at
   * @param {Date} data.updated_at
   * @param {boolean} data.is_active
   * @returns {UrlModel} url
   */
  static fromDatabase(data) {
    const url = new UrlModel(data.long_url, data.short_url);
    url.id = data.id;
    url.created_at = data.created_at;
    url.updated_at = data.updated_at;
    url.is_active = data.is_active === 1;
    return url;
  }
}
