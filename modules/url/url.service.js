import { UrlModel } from './url.model.js';
import { UrlRepository } from './url.repository.js';

export class UrlService {
  /**
   * @param {UrlRepository} url_repository
   */
  constructor(url_repository) {
    this.url_repository = url_repository;
  }

  /**
   * Generates a short URL.
   *
   * @returns {string}
   */
  #generateShortUrl() {
    return Math.random().toString(36).slice(2, 8);
  }

  /**
   * Shortens a URL.
   *
   * @param {string} long_url
   * @returns {UrlModel} url
   */
  shorten(long_url) {
    const existing_url = this.url_repository.findByLongUrl(long_url);

    if (existing_url) {
      return existing_url;
    }

    const short_url = this.#generateShortUrl();
    const url = this.url_repository.save({ short_url, long_url });

    return url;
  }

  /**
   * Gets the original URL from a short URL.
   *
   * @param {string} short_url
   * @returns {string | null}
   */
  getOriginalUrl(short_url) {
    const url = this.url_repository.findByShortUrl(short_url);
    return url ? url.long_url : null;
  }
}
