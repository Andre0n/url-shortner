import database from '../../utils/database.js';

import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';

const user_repository = new UserRepository(database);
export const user_service = new UserService(user_repository);
