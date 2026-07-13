const { test, expect } = require('@playwright/test');
const fs = require('fs');
const { CREATED_USER, USER_ID_FILE, SEED_USER_ID_FOR_GET } = require('./testData');

const API_KEY = process.env.REQRES_API_KEY ?? '';
const UPDATED_NAME = 'morpheus-updated';

function readUserId() {
  if (!fs.existsSync(USER_ID_FILE)) return '';
  const { userId } = JSON.parse(fs.readFileSync(USER_ID_FILE, 'utf-8'));
  return userId;
}

test.describe('reqres.in Users API - Get & Update', () => {
  const userId = readUserId();

  // reqres.in's /api/users is a read-only demo endpoint: the id returned by POST is never
  // actually persisted, so GET against it 404s. We validate the "get user" flow against one
  // of reqres's built-in seed users (id 2) instead - see testData.js for details.
  test('Get the created user details and validate', async ({ request }) => {
    test.skip(!userId, 'userId not found - run createUser.spec.js first');

    const response = await request.get(`/api/users/${SEED_USER_ID_FOR_GET}`, {
      headers: { 'x-api-key': API_KEY },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data).toHaveProperty('id', SEED_USER_ID_FOR_GET);
    expect(body.data).toHaveProperty('email');
  });

  test("Update user's name and validate", async ({ request }) => {
    test.skip(!userId, 'userId not found - run createUser.spec.js first');

    const response = await request.put(`/api/users/${userId}`, {
      headers: { 'x-api-key': API_KEY },
      data: { name: UPDATED_NAME, job: CREATED_USER.job },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.name).toBe(UPDATED_NAME);
    expect(body).toHaveProperty('updatedAt');
  });
});
