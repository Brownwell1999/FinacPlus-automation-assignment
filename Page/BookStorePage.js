class BookStorePage {
  constructor(page) {
    this.page = page;
    this.searchBox = page.locator('#searchBox');
    this.usernameValue = page.locator('#userName-value');
    this.logoutButton = page.getByRole('button', { name: 'Log out', exact: true });
    this.resultRows = page.locator('table tbody tr');
  }

  async goto() {
    await this.page.goto('/books');
  }

  async search(term) {
    await this.searchBox.fill(term);
  }

  bookRowByTitle(title) {
    return this.resultRows.filter({ has: this.page.getByRole('link', { name: title, exact: true }) });
  }

  async getBookDetails(title) {
    const row = this.bookRowByTitle(title);
    const cells = row.locator('td');
    const count = await cells.count();
    const texts = await Promise.all(
      Array.from({ length: count }, (_, i) => cells.nth(i).innerText())
    );
    return {
      title: texts[1].trim(),
      author: texts[2].trim(),
      publisher: texts[3].trim(),
    };
  }

  async logout() {
    await this.logoutButton.click();
  }
}

module.exports = { BookStorePage };
