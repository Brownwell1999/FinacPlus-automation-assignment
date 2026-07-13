const path = require('path');

const CREATED_USER = { name: 'morpheus', job: 'leader' };

const DATA_DIR = path.join(__dirname, '..', '..', 'playwright', '.data');
const USER_ID_FILE = path.join(DATA_DIR, 'userId.json');

// reqres.in's /api/users is a read-only demo endpoint: POST returns a fake id but never
// persists the record, so GET only succeeds for the built-in seed users (ids 1-12).
// PUT/PATCH always echo back 200 regardless of id, so updates work against the created id.
const SEED_USER_ID_FOR_GET = 2;

module.exports = { CREATED_USER, USER_ID_FILE, SEED_USER_ID_FOR_GET };
