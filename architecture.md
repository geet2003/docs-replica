# Architecture Note

## Stack

| Layer      | Choice                        | Reason                                                              |
|------------|-------------------------------|---------------------------------------------------------------------|
| Framework  | Next.js 14 (App Router)       | Full-stack in one project; API routes co-located with UI            |
| Database   | PostgreSQL (Railway)          | Relational fits docs + shares naturally; free tier available        |
| ORM        | Prisma                        | Type-safe queries, easy migrations, great DX                        |
| Editor     | TipTap                        | Headless, well-documented, easiest modern rich-text editor in React |
| Styling    | Tailwind CSS                  | Fast to iterate without a component library                         |
| Testing    | Vitest                        | Fast, native ESM, zero-config with TypeScript                       |
| Deployment | Vercel + Railway              | Both have free tiers; Vercel deploys Next.js automatically          |

---

## Data Model

```
User
  id, name, email, avatarUrl

Document
  id, title, content (HTML string), ownerId → User, createdAt, updatedAt

DocumentShare
  id, documentId → Document, userId → User
  unique(documentId, userId)
```

Sharing is a simple join table. The owner is tracked on the document. Access control is checked at the API route level on every read and write.

---

## What I Prioritized

1. **Working end-to-end flow first** — create, edit, save, share, switch user, verify shared doc appears. Everything that matters for the demo had to work before polishing.
2. **Auto-save UX** — a document editor with a manual save button feels broken. Debounced auto-save at 800ms makes the experience feel right.
3. **Clear ownership model** — "My documents" vs "Shared with me" separation is immediately understandable without explanation.
4. **File upload as a real workflow step** — uploads open directly in the editor rather than dumping into a list, which is the natural user expectation.

---

## What I Deprioritized

- **Real-time collaboration** — Yjs + WebSockets would double the complexity for a solo-user demo. Auto-save is the right tradeoff here.
- **Real authentication** — NextAuth would add 1-2 hours of setup for no visible UX improvement in a demo. A user switcher communicates the sharing model equally well.
- **Undo history / version history** — TipTap has built-in undo (⌘Z works) but no version snapshots. That's a clear next step.
- **Rich file import** — only `.txt`/`.md` supported. `.docx` via `mammoth` was installed but excluded to keep the conversion quality predictable.
- **Permissions model beyond read/write** — all shares grant edit access. A viewer/editor distinction is the obvious next iteration.

---

## Deployment

1. **Railway** — provision a PostgreSQL service, copy the `DATABASE_URL`
2. **Vercel** — import the `docs-app` directory, set `DATABASE_URL` env var
3. After deploy: `npx prisma migrate deploy && npx prisma db seed` (via Railway shell or Vercel build command)
