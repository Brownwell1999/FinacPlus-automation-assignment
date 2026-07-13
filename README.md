## QA Automation Assignment

**Known, deliberate deviation from the literal spec:** the "get user details" API test validates a fixed reqres.in seed user (id `2`) instead of the just-created user. This is not an oversight — `/api/users` on reqres.in is a read-only demo endpoint that never actually persists created records, so `GET` against a freshly created id always returns 404 (confirmed by direct API calls; `PUT`/`PATCH` always echo `200` regardless of id, which is why the update step *can* target the real created id). Full detail below and in `tests/api/testData.js`.

Playwright + JavaScript automation for:

1. **UI** — demoqa.com Book Store, split across three files:
   - `tests/ui/login.spec.js` — login, validate username + logout button, saves the authenticated session to `playwright/.auth/user.json`.
   - `tests/ui/search.spec.js` — reuses the saved session (no re-login), clicks Book Store, searches a book, validates the result.
   - `tests/ui/print.spec.js` — reuses the saved session, writes the book's Title/Author/Publisher to `output/book-details.txt`, then logs out.
   - Page objects live in `Page/` (`LoginPage.js`, `ProfilePage.js`, `BookStorePage.js`).
2. **API** — reqres.in, split across two files:
   - `tests/api/createUser.spec.js` — creates a user, validates the status code, stores the returned `userId` in `playwright/.data/userId.json`.
   - `tests/api/updateUser.spec.js` — gets user details and validates them, then updates the user's name and validates it.

> `/api/users` on reqres.in is a read-only demo endpoint: POST returns a fake id that is never actually persisted, so GET against a freshly created id always 404s (PUT/PATCH always echo back 200 regardless of id). To keep the "get user details" step meaningful, it validates against one of reqres's built-in seed users (id `2`) instead of the just-created id - see `tests/api/testData.js` for details. The update step still targets the real created `userId`.

### Setup

```bash
npm install
npx playwright install chromium
```

Copy `.env.example` to `.env` and fill in:

```
DEMOQA_USERNAME=<your demoqa.com Book Store username>
DEMOQA_PASSWORD="<your password>"   # quote it if it contains # or other special chars
REQRES_API_KEY=<free key from https://app.reqres.in/api-keys>
```

> The demoqa.com user must be created manually first (registration is intentionally not automated per the assignment).

### Run

```bash
npm run test        # everything
npm run test:ui     # Book Store UI flow only
npm run test:api    # reqres.in API flow only
npm run report      # open the last HTML report
```

### Output

- `output/book-details.txt` — Title/Author/Publisher of the searched book, written by the UI test.
- `playwright-report/` — HTML test report.
