const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'ui-login',
      testDir: './tests/ui',
      testMatch: 'login.spec.js',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://demoqa.com' },
    },
    {
      name: 'ui',
      testDir: './tests/ui',
      testMatch: ['search.spec.js', 'print.spec.js'],
      dependencies: ['ui-login'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://demoqa.com',
        storageState: 'playwright/.auth/user.json',
      },
    },
    {
      name: 'api-create',
      testDir: './tests/api',
      testMatch: 'createUser.spec.js',
      use: { baseURL: 'https://reqres.in' },
    },
    {
      name: 'api',
      testDir: './tests/api',
      testMatch: 'updateUser.spec.js',
      dependencies: ['api-create'],
      use: { baseURL: 'https://reqres.in' },
    },
  ],
});
