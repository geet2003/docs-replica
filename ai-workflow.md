# AI Workflow Note

## Tools Used

- **Claude (claude-sonnet-4-6 via Claude Code CLI)** — primary coding assistant throughout

---

## Where AI Materially Sped Up the Work

- **Boilerplate elimination** — writing Prisma schema, seed file, and all API route scaffolding would have taken ~45 minutes manually. AI produced solid first drafts in seconds.
- **TipTap toolbar wiring** — the `onMouseDown + preventDefault` pattern for toolbar buttons (to prevent editor blur before toggling) is easy to forget. AI got it right immediately.
- **Parallel file generation** — being able to write 5-6 files simultaneously (API routes, components, context) compressed what would normally be sequential work.
- **Vitest config debugging** — the ESM/CJS conflict with `@vitejs/plugin-react` was caught and fixed in one iteration rather than a 20-minute debug cycle.

---

## What AI-Generated Output I Changed or Rejected

- **Rejected real-time collab scaffolding** — AI initially suggested adding Yjs. I rejected it as out of scope for the timebox.
- **Revised the access control approach** — AI's first pass put access checks inside Prisma queries (using `where` clauses). I changed it to explicit checks at the route level so the logic is readable and auditable.
- **Simplified the editor component** — the first draft included `@tiptap/extension-placeholder` and `@tiptap/extension-character-count`. I removed them — not needed, and they added install complexity.
- **Removed `.docx` upload** — mammoth was installed but the AI-generated conversion produced inconsistent HTML for complex documents. I scoped it to `.txt`/`.md` only and stated this clearly in the UI.

---

## How I Verified Correctness, UX Quality, and Reliability

- **Ran all 11 unit tests** after each logic change — `npm test` was the gate.
- **Manual end-to-end testing** of the full user flow: create doc → edit with all formatting options → upload a file → share with Bob → switch to Bob → verify the shared doc appears → edit as Bob → switch back to Alice → verify content persisted.
- **Read every generated file** before accepting it — no file was written without being reviewed for correctness, security (no injection vectors, proper access checks), and UI coherence.
- **TypeScript** caught several type mismatches in the editor and API routes at compile time before they could become runtime errors.

---

## Evaluation Note

AI was used for speed, not judgment. Every prioritization decision, architecture choice, and scope cut was mine. The AI wrote code; I decided what to build.
