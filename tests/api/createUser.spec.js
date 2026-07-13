const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { CREATED_USER, USER_ID_FILE } = require('./testData');

const API_KEY = process.env.REQRES_API_KEY ?? '';
const DATA_DIR = path.dirname(USER_ID_FILE);

test.describe('reqres.in Users API - Create', () => {
  test.beforeAll(() => {
    if (!API_KEY) {
      console.warn('REQRES_API_KEY is not set - get a free key at https://app.reqres.in/api-keys and add it to .env');
    }
  });

  test('Create a user, validate status code and store userId', async ({ request }) => {
    const response = await request.post('/api/users', {
      headers: { 'x-api-key': API_KEY },
      data: CREATED_USER,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.name).toBe(CREATED_USER.name);
    expect(body.job).toBe(CREATED_USER.job);

    const userId = body.id;
    expect(userId).toBeTruthy();

    // Hand the userId off to updateUser.spec.js (separate file/project) via a data file.
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(USER_ID_FILE, JSON.stringify({ userId }), 'utf-8');
  });
});
