export class UserModel {
  /**
   *
   * @param {string} username
   * @param {string} email
   * @param {string} password
   */
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.created_at = new Date().toISOString();
    this.updated_at = this.created_at;
  }

  /**
   * Returns a new instance of UserModel from a database object
   *
   * @param {object} data
   * @param {string} data.username
   * @param {string} data.email
   * @param {string} data.password
   * @param {number} data.id
   * @param {string} data.created_at
   * @param {string} data.updated_at
   *  @returns {UserModel}
   */
  static fromDatabase(data) {
    const user = new UserModel(data.username, data.email, data.password);
    user.id = data.id;
    user.created_at = data.created_at;
    user.updated_at = data.updated_at;
    return user;
  }
}
