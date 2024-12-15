import assert from 'node:assert';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { after, afterEach, beforeEach, suite, test } from 'node:test';
import { UserRepository } from '../user.repository.js';

suite('UrlRepository', () => {
  const database_url = './test_user_repository.db';

  const database = new DatabaseSync(database_url, { open: false });
  const user_repository = new UserRepository(database);

  const user_json = {
    username: 'test',
    email: 'test@test.com',
    password: 'password',
  };

  beforeEach(() => {
    database.open();
    database.exec(`
        CREATE TABLE users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          email TEXT NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMP,
          updated_at TIMESTAMP,
          UNIQUE (email, username)
        );
    `);
    database.close();
  });

  afterEach(() => {
    database.open();
    database.exec('DROP TABLE users;');
    database.close();
  });

  after(() => {
    fs.unlinkSync(database_url);
  });

  test('should create a new user', () => {
    const result = user_repository.save({ ...user_json });
    assert.notStrictEqual(result, null);
  });

  test('should return created user with correct data', () => {
    const expected = user_json;
    const actual = user_repository.save({ ...user_json });
    assert.deepStrictEqual(actual.email, expected.email);
    assert.deepStrictEqual(actual.username, expected.username);
    assert.deepStrictEqual(actual.password, expected.password);
    assert.notStrictEqual(actual.created_at, null);
    assert.notStrictEqual(actual.updated_at, null);
    assert.deepStrictEqual(actual.id, 1);
  });

  test('should return null when user is not created', () => {
    const result = user_repository.save({});
    assert.strictEqual(result, null);
  });

  test('should find a user by email', () => {
    const expected = user_repository.save({ ...user_json });
    const actual = user_repository.findByEmail(user_json.email);
    assert.deepStrictEqual(actual, expected);
  });

  test('should find user by username', () => {
    const expected = user_repository.save({ ...user_json });
    const actual = user_repository.findByUsername(user_json.username);
    assert.deepStrictEqual(actual, expected);
  });

  test('should return null when user is not found', () => {
    const actual = user_repository.findByEmail(user_json.email);
    assert.strictEqual(actual, null);
  });

  test('should return null when user is not found', () => {
    const actual = user_repository.findByUsername(user_json.username);
    assert.strictEqual(actual, null);
  });
});
