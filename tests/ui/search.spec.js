const { test, expect } = require('@playwright/test');
const { BookStorePage } = require('../../Page/BookStorePage');

const SEARCH_TERM = 'Learning JavaScript Design Patterns';

test.describe('Book Store - Search', () => {
  test('click on Book Store button and search for a book', async ({ page }) => {
    const bookStorePage = new BookStorePage(page);

    await test.step('Click on Book Store button', async () => {
      await bookStorePage.goto();
      await expect(page).toHaveURL(/.*\/books/);
    });

    await test.step(`Search "${SEARCH_TERM}"`, async () => {
      await bookStorePage.search(SEARCH_TERM);
      await expect(bookStorePage.bookRowByTitle(SEARCH_TERM)).toBeVisible();
    });

    await test.step('Validate the search result contains this book', async () => {
      await expect(bookStorePage.resultRows).toHaveCount(1);
      await expect(bookStorePage.bookRowByTitle(SEARCH_TERM)).toContainText(SEARCH_TERM);
    });
  });
});
