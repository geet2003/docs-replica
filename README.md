# Docs — Lightweight Collaborative Document Editor

A Google Docs-inspired document editor built with Next.js, PostgreSQL, and TipTap.

---

## Live Demo

> Add your Vercel URL here after deployment.

**Test accounts (seeded):**

| Name  | Email           |
|-------|-----------------|
| Alice | alice@demo.com  |
| Bob   | bob@demo.com    |
| Carol | carol@demo.com  |

Switch the active user via the avatar dropdown in the top-right corner.

---

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL (local or Docker)

### 1. Install dependencies

```bash
cd docs-app
npm install
```

### 2. Configure environment

```bash
cp .env .env.local
```

Edit `.env.local`:
```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/docsreplica"
```

### 3. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Run Tests

```bash
npm test
```

11 unit tests covering document validation, access control logic, file upload validation, and text-to-HTML conversion.

---

## Supported File Upload Types

Only `.txt` and `.md` files are supported. The file content is converted to basic HTML and opened directly as a new editable document.

---

## Features

- **Create documents** — click "New document"
- **Rename** — click the title in the editor, or use the ⋮ menu on the dashboard
- **Rich-text editing** — bold, italic, underline, H1/H2/H3, bullet and numbered lists
- **Auto-save** — saves 800ms after you stop typing; "Saved ✓" indicator in the toolbar
- **File upload** — upload a `.txt` or `.md` file to create a new document
- **Sharing** — owners can share with other users; shared docs appear under "Shared with me" with a badge
- **User switcher** — switch between 3 seeded users to demo the sharing flow
- **Delete** — owners can delete their own documents
