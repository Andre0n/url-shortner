import { UserModel } from './user.model.js';

export class UserRepository {
  /**
   * @param {import('node:sqlite').DatabaseSync} database
   */
  constructor(database) {
    this.database = database;
  }

  /**
   * Saves a user to the database
   *
   * @param {object} user
   * @param {string} user.username
   * @param {string} user.email
   * @param {string} user.password
   * @returns {UserModel}
   */
  save(user) {
    if (!user.username || !user.email || !user.password) return null;

    const user_model = new UserModel(user.username, user.email, user.password);
    this.database.open();
    this.database
      .prepare(
        'INSERT INTO users (username, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
      )
      .run(
        user_model.username,
        user_model.email,
        user_model.password,
        user_model.created_at,
        user_model.updated_at
      );

    const row = this.database
      .prepare('SELECT * FROM users WHERE username = ?')
      .get(user_model.username);

    this.database.close();
    if (row?.id) return UserModel.fromDatabase(row);
    return null;
  }

  /**
   * Returns a user from the database by username
   *
   * @param {string} username
   * @returns {UserModel}
   */
  findByUsername(username) {
    this.database.open();
    const row = this.database
      .prepare('SELECT * FROM users WHERE username = ?')
      .get(username);
    this.database.close();
    return row?.id ? UserModel.fromDatabase(row) : null;
  }

  /**
   * Returns a user from the database by email
   *
   * @param {string} email
   * @returns {UserModel}
   */
  findByEmail(email) {
    this.database.open();
    const row = this.database
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email);
    this.database.close();
    return row?.id ? UserModel.fromDatabase(row) : null;
  }
}
