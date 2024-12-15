import assert from 'node:assert';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { after, beforeEach, suite, test } from 'node:test';
import { UrlRepository } from '../url.repository.js';

suite('UrlRepository', () => {
  const database = new DatabaseSync('./test.db', { open: false });
  const urlRepository = new UrlRepository(database);

  const url = {
    long_url: 'https://www.google.com',
    short_url: 'google',
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
    fs.unlinkSync('./test.db');
  });

  test('should create a new url', () => {
    const result = urlRepository.save(url);
    assert.notStrictEqual(result, null);
  });

  test('should find a url by short url', () => {
    const expected = urlRepository.save(url);
    const actual = urlRepository.findByShortUrl('google');
    assert.deepStrictEqual(actual, expected);
  });

  test('should return null when url is not found', () => {
    const actual = urlRepository.findByShortUrl('google');
    assert.strictEqual(actual, null);
  });

  test('should find a url by long url', () => {
    const expected = urlRepository.save(url);
    const actual = urlRepository.findByLongUrl('https://www.google.com');
    assert.deepStrictEqual(actual, expected);
  });

  test('should return null when long url is not found', () => {
    const actual = urlRepository.findByLongUrl('https://www.google.com');
    assert.strictEqual(actual, null);
  });
});
