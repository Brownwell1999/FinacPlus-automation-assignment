const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../Page/LoginPage');
const { ProfilePage } = require('../../Page/ProfilePage');

const USERNAME = process.env.DEMOQA_USERNAME ?? '';
const PASSWORD = process.env.DEMOQA_PASSWORD ?? '';
const AUTH_FILE = 'playwright/.auth/user.json';

test.describe('Book Store - Login', () => {
  test('login using the newly created user and validate username + logout button', async ({ page }) => {
    expect(USERNAME, 'DEMOQA_USERNAME must be set in .env').not.toBe('');
    expect(PASSWORD, 'DEMOQA_PASSWORD must be set in .env').not.toBe('');

    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);

    await test.step('Login using the newly created user', async () => {
      await loginPage.goto();
      await loginPage.login(USERNAME, PASSWORD);
      await expect(page).toHaveURL(/.*\/profile/);
    });

    await test.step('Validate username and logout button', async () => {
      await expect(profilePage.usernameValue).toHaveText(USERNAME);
      await expect(profilePage.logoutButton).toBeVisible();
      await expect(profilePage.logoutButton).toHaveText(/Logout/i);
    });

    // Save the authenticated session so search.spec.js / print.spec.js don't need to log in again.
    await page.context().storageState({ path: AUTH_FILE });
  });
});
