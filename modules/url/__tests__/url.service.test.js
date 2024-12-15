import assert from 'node:assert';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { after, beforeEach, suite, test } from 'node:test';
import { UrlRepository } from '../url.repository.js';
import { UrlService } from '../url.service.js';

suite('UrlService', () => {
  const database = new DatabaseSync('./test_service.db', { open: false });
  const urlRepository = new UrlRepository(database);
  const urlService = new UrlService(urlRepository);

  const data = {
    long_url: 'https://www.google.com',
  };

  beforeEach(() => {
    database.open();
    database.exec(`
        DROP TABLE IF EXISTS urls;
        CREATE TABLE urls (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          long_url TEXT NOT NULL,
          short_url TEXT NOT NULL,
          created_at TIMESTAMP,
          updated_at TIMESTAMP,
          is_active BOOLEAN DEFAULT TRUE,
          expires_at TIMESTAMP,
          redirect_count INTEGER DEFAULT 0,
          visible BOOLEAN DEFAULT TRUE,
          UNIQUE (long_url, short_url)
        );
    `);
    database.close();
  });

  after(() => {
    fs.unlinkSync('./test_service.db');
  });

  test('should create a new shorted url', () => {
    const actual = urlService.shorten(data.long_url);
    assert.notStrictEqual(actual, null);
  });

  test('should find a url by short url', () => {
    const expected = urlService.shorten(data.long_url);
    const actual = urlService.getOriginalUrl(expected.short_url);
    assert.deepStrictEqual(actual, data.long_url);
  });

  test('should return null when url is not found', () => {
    const actual = urlService.getOriginalUrl('google');
    assert.strictEqual(actual, null);
  });
});
