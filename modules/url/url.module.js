import database from '../../utils/database.js';
import { UrlRepository } from './url.repository.js';
import { UrlService } from './url.service.js';

const url_repository = new UrlRepository(database);
const url_service = new UrlService(url_repository);

export { url_service };
