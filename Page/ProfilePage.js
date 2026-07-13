class ProfilePage {
  constructor(page) {
    this.page = page;
    this.usernameValue = page.locator('#userName-value');
    this.logoutButton = page.getByRole('button', { name: 'Logout', exact: true });
    this.goToBookStoreButton = page.locator('#gotoStore');
  }

  async goToBookStore() {
    await this.goToBookStoreButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}

module.exports = { ProfilePage };
