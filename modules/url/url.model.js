export class UrlModel {
  /**
   *
   * @param {string} long_url
   * @param {string} short_url
   * @param {Date} expires_at - Optional
   * @param {boolean} visible - Optional
   */
  constructor(long_url, short_url, expires_at = null, visible = true) {
    this.long_url = long_url;
    this.short_url = short_url;
    this.created_at = new Date().toISOString();
    this.updated_at = this.created_at;
    this.is_active = true;
    this.expires_at = expires_at;
    this.redirect_count = 0;
    this.visible = visible;
  }

  /**
   * @param {object} data
   * @param {string} data.long_url
   * @param {string} data.short_url
   * @param {number} data.id
   * @param {Date} data.created_at
   * @param {Date} data.updated_at
   * @param {boolean} data.is_active
   * @param {Date?} data.expires_at
   * @param {number} data.redirect_count
   * @param {boolean} data.visible
   * @returns {UrlModel} url
   */
  static fromDatabase(data) {
    const url = new UrlModel(data.long_url, data.short_url);
    url.id = data.id;
    url.created_at = data.created_at;
    url.updated_at = data.updated_at;
    url.is_active = data.is_active === 1;
    url.expires_at = data.expires_at;
    url.redirect_count = data.redirect_count;
    url.visible = data.visible === 1;
    return url;
  }
}
