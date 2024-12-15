import crypto from 'node:crypto';

/**
 * Generate salt
 *
 * @param {number} [salt_rounds=10]
 * @returns {string}
 */
const generate_salt = (salt_rounds = 10) => {
  return crypto.randomBytes(salt_rounds).toString('hex').slice(0, salt_rounds);
};

/**
 * Hash password with salt
 *
 * @param {string} password
 * @param {string} salt
 * @returns {string}
 */
const hash_password = (password, salt) => {
  const iterations = 100000;
  const key_length = 32;
  const algorithm = 'sha512';

  const hash = crypto
    .pbkdf2Sync(password, salt, iterations, key_length, algorithm)
    .toString('hex');

  return hash;
};

/**
 * Hash password with salt
 *
 * @param {string} password
 * @param {number} [salt_rounds=10]
 * @returns {string}
 */
export const hash_sync = (password, salt_rounds = 10) => {
  const salt = generate_salt(salt_rounds);
  const hash = hash_password(password, salt);

  return `${salt_rounds}\$${salt}${hash}`;
};

/**
 * Compare password with hash
 *
 * @param {string} password
 * @param {string} hash
 * @returns {boolean}
 */
export const compare_sync = (password, hash) => {
  const [salt_rounds, rest] = hash.split('$');
  const salt = rest.slice(0, parseInt(salt_rounds));
  const password_hash = rest.slice(parseInt(salt_rounds));

  return hash_password(password, salt) === password_hash;
};
