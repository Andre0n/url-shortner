import { UserRepository } from './user.repository.js';

import { hash_sync } from '../../utils/hash.js';

export class UserService {
  /**
   * @param {UserRepository} user_repository
   */
  constructor(user_repository) {
    this.user_repository = user_repository;
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
  create(user) {
    if (this.user_repository.findByUsername(user.username)) {
      throw new Error('Username already exists');
    }

    if (this.user_repository.findByEmail(user.email)) {
      console.log('email already exists');
      throw new Error('Email already exists');
    }

    const salt_rounds = 10;
    const password_hash = hash_sync(user.password, salt_rounds);
    user.password = password_hash;

    return this.user_repository.save(user);
  }
}
