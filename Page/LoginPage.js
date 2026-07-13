class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await this.page.locator('#userName').fill(username);
    await this.page.locator('#password').fill(password);
    await this.page.locator('#login').click();
  }
}

module.exports = { LoginPage };
