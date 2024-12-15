import assert from 'node:assert';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { after, beforeEach, suite, test } from 'node:test';
import { UserRepository } from '../user.repository.js';
import { UserService } from '../user.service.js';

suite('UserService', () => {
  const database_url = './test_user_service.db';

  const database = new DatabaseSync(database_url, { open: false });
  const user_repository = new UserRepository(database);
  const user_service = new UserService(user_repository);

  const user_json = {
    username: 'test',
    email: 'test@email.com',
    password: 'password',
  };

  beforeEach(() => {
    database.open();
    database.exec(`
        DROP TABLE IF EXISTS users;
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

  after(() => {
    fs.unlinkSync(database_url);
  });

  test('should create a new user', () => {
    const actual = user_service.create({ ...user_json });
    assert.notStrictEqual(actual, null);
  });

  test('should return the created user with correct data', () => {
    const actual = user_service.create({ ...user_json });
    assert.strictEqual(actual.username, user_json.username);
    assert.strictEqual(actual.email, user_json.email);
    assert.notStrictEqual(actual.password, user_json.password);
    assert.notStrictEqual(actual.created_at, null);
    assert.notStrictEqual(actual.updated_at, null);
    assert.deepStrictEqual(actual.id, 1);
  });

  test('should throw an error when creating a user with an existing username', () => {
    user_service.create(user_json);
    assert.throws(() => user_service.create({ ...user_json }), {
      message: 'Username already exists',
    });
  });

  test('should throw an error when creating a user with an existing email', () => {
    const { username, ...rest } = user_json;
    user_service.create({ username: 'test2', ...rest });
    assert.throws(() => user_service.create({ ...user_json }), {
      message: 'Email already exists',
    });
  });
});
