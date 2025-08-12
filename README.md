## UnifyPDF — Web

Next.js web app for uploading, reordering, merging, previewing, and downloading PDFs. Built with a trust-first UI and no server-side storage of files.

### Features
- **Upload & reorder**: Drag-and-drop or file picker; move items up/down.
- **Merge PDFs**: Sends PDFs to the backend merge endpoint and returns a single file.
- **Preview & download**: Inline preview of the merged PDF; download or open in a new tab.
- **Privacy-first**: Files are processed in-memory; no server-side storage.
- **Theming**: Light/Dark/System toggle via `next-themes`.

### Tech stack
- **Next.js App Router** 15, **React** 19, **TypeScript**
- **Tailwind CSS v4** with custom CSS variables in `app/globals.css`
- **shadcn/ui primitives** (Radix UI) and **lucide-react** icons
- **next-themes** for theme switching

---

## Prerequisites
- Node.js 18+ (LTS) or 20+
- pnpm (recommended), npm, yarn, or bun
- A running backend (NestJS) providing the merge endpoint

---

## How it works
- The UI queues up to 20 PDFs (≤ 25 MB each) and maintains order.
- On Merge, the app POSTs to `${NEXT_PUBLIC_API_BASE_URL}/pdf/merge` with `multipart/form-data` under `files`.
- The backend merges in-memory and returns `application/pdf`.
- The UI previews the resulting Blob via `URL.createObjectURL` and lets the user download.
- If the queue is cleared, preview and related actions are hidden.

---

## Theming
- Provided by `next-themes` using the `class` attribute.
- Toggle component lives in `components/ThemeToggle.tsx` and uses shadcn/ui + Radix Dropdown.
- Design tokens (colors, radii) are defined in `app/globals.css` using Tailwind v4 and CSS variables (light/dark palettes).

---

## Privacy
Files are processed in-memory only and not stored server-side.

