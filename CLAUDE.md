# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Two **independent** npm projects in one repo — there is no root `package.json` or
workspace, so install and run each separately:

- `Backend/` — Express 5 REST API, MongoDB via Mongoose, JWT-cookie auth, Google
  Gemini for AI. ESM (`"type": "module"`; relative imports need the `.js` extension).
- `Frontend/` — React 19 SPA, Vite 7, react-router 7, axios, plain CSS.

## Commands

Backend (from `Backend/`):
- `npm install`
- `npm run dev` — start the API with nodemon (listens on `process.env.PORT`)
- No tests or lint (`npm test` is a placeholder that exits 1).

Frontend (from `Frontend/`):
- `npm install`
- `npm run dev` — Vite dev server on port 5173
- `npm run build` — production build; **use this to validate changes**, there are no unit tests
- `npm run lint` — ESLint
- `npm run preview` — serve the build

## Backend env (`Backend/.env`, loaded by dotenv)

`PORT` (see port coupling), `MONGO_URI`, `JWT_SECRET`, `GOOGLE_GENAI_API_KEY`,
and `NODE_ENV` (`production` turns on the `secure` cookie flag).

### Port coupling (easy to break)
The frontend axios `baseURL` is hardcoded to `http://localhost:3000`
(`Frontend/src/features/*/services/*.api.js`) and the backend CORS `origin` is
hardcoded to `http://localhost:5173` with `credentials: true` (`Backend/src/app.js`).
Auth cookies only flow if the **backend runs on 3000 and the frontend on 5173**.
Change both sides together.

## Backend architecture

Boot: `server.js` (dotenv → `connectToDB()` → `app.listen`) → `src/app.js`
(json, cookie-parser, cors; mounts `/api/auth` and `/api/interview`).

Per-request layering: `routes/` → `controllers/` → `services/` + `models/`, with
`middlewares/`:
- `authUser` (`middlewares/auth.middleware.js`) reads the JWT from the **httpOnly
  `token` cookie**, rejects it if present in the blacklist collection, and sets
  `req.user`. There is no Authorization-header path.
- `upload` (`middlewares/file.middleware.js`) is multer **memoryStorage**, 3MB
  cap, used as `upload.single("resume")` — the resume is processed from a buffer,
  never written to disk.

Auth model: register/login set a JWT in an httpOnly cookie. **Logout is
server-side** — the token is inserted into `tokenBlacklistModel` and the cookie
cleared; `authUser` checks that blacklist. This is why the frontend authenticates
via the cookie (`withCredentials`) rather than a token held in JS.

All Gemini usage lives in `services/ai.service.js` and uses **structured
output**: a Zod schema → `zodToJsonSchema()` → passed as `responseSchema` (with
`responseMimeType: "application/json"`), then `JSON.parse(response.text)`. To
change what the AI returns, edit the Zod schema + prompt — there is no
post-processing. Constraints already encoded: the question arrays are
`.length(10)`, and `matchScore` is deliberately defined **after** `skillGaps`
and constrained to an int 0–100 so the model analyzes before scoring. Model id:
`gemini-3.1-flash-lite`.

Two AI flows:
1. **Interview report** — `POST /api/interview/` (multipart: `resume` file +
   `jobDescription` + `selfDescription`). The controller validates (jobDescription
   required; resume *or* selfDescription required), extracts resume text with
   `pdf-parse` (`PDFParse`), calls `generateInterviewReport`, and stores the
   result spread onto a doc tied to `req.user.id`. `interviewReportModel` nests
   question/skillGap/prep sub-schemas.
2. **Tailored resume PDF** — `POST /api/interview/resume/pdf/:interviewReportId`
   → `generateResumePdf` asks Gemini for resume **HTML**, then
   `generatePdfFromHtml` renders it to an A4 PDF with **puppeteer**, streamed back
   as an attachment.

## Frontend architecture

Entry: `main.jsx` → `App.jsx` nests `AuthProvider` > `InterviewProvider` and
renders `<CursorGlow/>` (global cursor effect) alongside `<RouterProvider/>`.

Routing (`app.routes.jsx`, createBrowserRouter): `/login` and `/register` are
public; `/`, `/profile`, and `/interview/:interviewId` are wrapped in
`<Protected>` (`features/auth/components/Protected.jsx`), which redirects to
`/login` while `user` is null.

Feature-based: `src/features/{auth,interview}/` each hold `pages/`, `hooks/`,
`services/`, a `*.context.jsx`, and CSS. State is **React Context, not Redux**:
- `AuthContext` holds `{user, loading}`; `useAuth` exposes
  `handleLogin/handleRegister/handleLogout` and runs `getMe()` on mount to
  hydrate the session from the cookie.
- `InterviewContext` holds `{loading, report, reports}`; `useInterview` exposes
  `generateReport/getReportById/getReports/getResumePdf` (memoized with
  `useCallback`).

API layer: `features/*/services/*.api.js` create axios instances with the
hardcoded `baseURL` and `withCredentials: true`. The `user` object shape
throughout is `{ id, username, email }`.

Styling: plain CSS, no Tailwind/CSS-in-JS. A **design-token system** lives in
`src/style.css` (`:root` custom properties — dark emerald/teal theme; Inter +
Sora fonts loaded in `index.html`). Feature stylesheets consume those tokens —
prefer `var(--…)` over new hardcoded colors. Shared UI is in `src/components/`
(`CursorGlow`, `AvatarButton`).
