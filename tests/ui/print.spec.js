const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { BookStorePage } = require('../../Page/BookStorePage');

const SEARCH_TERM = 'Learning JavaScript Design Patterns';
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'output');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'book-details.txt');

test.describe('Book Store - Print details & Logout', () => {
  test('print Title, Author, Publisher to a file and logout', async ({ page }) => {
    const bookStorePage = new BookStorePage(page);

    await test.step(`Search "${SEARCH_TERM}"`, async () => {
      await bookStorePage.goto();
      await bookStorePage.search(SEARCH_TERM);
      await expect(bookStorePage.bookRowByTitle(SEARCH_TERM)).toBeVisible();
    });

    await test.step('Print Title, Author and Publisher into a file', async () => {
      const details = await bookStorePage.getBookDetails(SEARCH_TERM);

      expect(details.title).toBe(SEARCH_TERM);
      expect(details.author).not.toBe('');
      expect(details.publisher).not.toBe('');

      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      const content = `Title: ${details.title}\nAuthor: ${details.author}\nPublisher: ${details.publisher}\n`;
      fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');

      expect(fs.existsSync(OUTPUT_FILE)).toBe(true);
    });

    await test.step('Click on log out', async () => {
      await bookStorePage.logout();
      await expect(page).toHaveURL(/.*\/login/);
    });
  });
});
