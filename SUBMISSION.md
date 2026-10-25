# SUBMISSION.md

## What Is Included

| Item                        | Location                          |
|-----------------------------|-----------------------------------|
| Source code                 | `docs-app/` (this directory)      |
| Setup & run instructions    | `README.md`                       |
| Architecture note           | `architecture.md`                 |
| AI workflow note            | `ai-workflow.md`                  |
| Live deployment URL         | See below                         |
| Walkthrough video URL       | See `video.txt`                   |

---

## Live URL

> _Add your Vercel deployment URL here._

---

## Test Accounts

| User  | Email          | Notes                            |
|-------|----------------|----------------------------------|
| Alice | alice@demo.com | Owns the sample "Welcome" doc     |
| Bob   | bob@demo.com   | Has access to Alice's sample doc |
| Carol | carol@demo.com | No documents initially            |

Switch users via the avatar dropdown (top-right). No password required.

---

## What Is Working

- Document creation, rename, delete
- Rich-text editing: bold, italic, underline, H1/H2/H3, bullet and numbered lists
- Auto-save (debounced, 800ms)
- File upload: `.txt` and `.md` → new editable document
- Sharing: owner shares with another user, shared docs appear under "Shared with me"
- Owned vs shared document distinction (visual badge)
- Full persistence via PostgreSQL

---

## What Is Incomplete / Intentionally Excluded

- **Real-time collaborative editing** (two cursors simultaneously) — excluded; auto-save is the right tradeoff for this timebox
- **Real authentication** — replaced with a user switcher dropdown; demonstrates the sharing model clearly without the overhead
- **`.docx` upload** — mammoth is installed but excluded due to inconsistent HTML output; only `.txt`/`.md` supported
- **Viewer vs editor permissions** — all shares currently grant edit access; a read-only mode would be the next iteration
- **Version history** — TipTap provides undo (⌘Z) but no snapshot history

---

## What I Would Build Next (with 2-4 more hours)

1. **Permission levels** — viewer vs editor on shares
2. **Inline comments** — TipTap supports comment marks
3. **Document version snapshots** — save a copy on each major save
4. **Search** — full-text search across owned + shared documents
5. **`.docx` import** — with better HTML sanitization post-mammoth
