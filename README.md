# Raj Enterprises — Water Purifier Website (MERN)

Business website and admin panel for **Raj Enterprises**, a domestic RO water purifier
sales, installation, repair and AMC business.

- **Tagline:** Shuddha Paani, Bharosa Pakka — Complete RO Solutions.
- **Phone / WhatsApp:** 8237739994
- **Email:** aquarajenterprises@gmail.com
- **Service Area:** Navi Mumbai

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 18 + Vite 5, React Router 6, Bootstrap 5 (CDN), framer-motion, react-icons, axios |
| Backend  | Node.js + Express 4, Mongoose 8 (MongoDB), JWT, bcryptjs, express-validator, helmet, morgan, cors |
| Database | MongoDB |

## Project Structure

```
Raj Enterprises/
├── backend/
│   ├── config/db.js            # Mongo connection (non-fatal)
│   ├── controllers/            # Route handlers
│   ├── middleware/             # auth, validation, error handler
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routers
│   ├── utils/nodeDemo.js       # Node.js fundamentals demo (Experiment 7)
│   ├── seed.js                 # Database seeder
│   └── server.js               # App entry point
├── frontend/
│   ├── public/images/products/ # Product images
│   └── src/
│       ├── components/         # Reusable UI (WaterPurifier3D, ProductEnquiryForm, ToastProvider usage…)
│       ├── context/            # ThemeContext, LanguageContext, ToastContext
│       ├── i18n/               # translations.js (taglines + locale detection)
│       ├── pages/              # Route pages
│       ├── services/api.js     # Axios API layer
│       └── utils/              # validators, helpers
└── Procfile                    # Single-service deployment
```

## Prerequisites

- Node.js 18+ (developed on Node 22)
- MongoDB running locally (`mongodb://localhost:27017`) **or** a MongoDB Atlas URI

## Environment Variables

Copy the example files and fill in real values. **Never commit `.env`.**

`backend/.env` (see `backend/.env.example`):

```
MONGODB_URI=mongodb://localhost:27017/raj-enterprises
PORT=5000
JWT_SECRET=change_this_to_a_long_random_string
CLIENT_URL=http://localhost:5173,http://localhost:4173
NODE_ENV=development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_this
ADMIN_EMAIL=aquarajenterprises@gmail.com
```

`frontend/.env` (optional, see `frontend/.env.example`):

```
VITE_API_URL=/api
```

In development Vite proxies `/api` to `http://localhost:5000` (see `frontend/vite.config.js`).

## Install & Run

### 1. Backend

```bash
cd backend
npm install
npm run seed      # populate products, AMC plans, admin user (needs MongoDB)
npm run dev       # http://localhost:5000  (nodemon)
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

### 3. Production (single service)

Build the frontend, then start the backend with `NODE_ENV=production`.
Express serves `frontend/dist` and falls back to `index.html` for client routes.

```bash
cd frontend
npm run build
cd ../backend
$env:NODE_ENV="production"; npm start      # PowerShell
# NODE_ENV=production npm start            # bash
```

The root `Procfile` (`web: node backend/server.js`) supports PaaS platforms. Set the
build command to install both packages and run `npm run build` in `frontend`.

## API Overview

Base URL: `/api`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | – | Service + DB status |
| GET | `/products` | – | List products (`category`, `search`, `sort`, `minPrice`, `maxPrice`, `limit`, `page`) |
| GET | `/products/:id` | – | Single product |
| POST/PUT/DELETE | `/products` | JWT | Admin product CRUD |
| POST | `/services` | – | Create service request (returns `ticketId`, e.g. `RAJ-1234`) |
| POST | `/services/track` | – | Track by `ticketId` + `mobile` |
| GET | `/services` | JWT | List service requests |
| PUT/DELETE | `/services/:id` | JWT | Update status / assign technician / delete |
| POST | `/enquiries` | – | Create enquiry (contact / product page) |
| GET | `/enquiries` | JWT | List enquiries |
| PUT/DELETE | `/enquiries/:id` | JWT | Update / delete enquiry |
| GET | `/amc` | – | List active AMC plans |
| GET | `/amc/:id` | – | Single AMC plan |
| POST/PUT/DELETE | `/amc` | JWT | Admin AMC CRUD |
| GET | `/reviews` | optional JWT | Public shows approved reviews; admin sees all |
| POST | `/reviews/public` | – | Submit review (saved unapproved) |
| POST/PUT/DELETE | `/reviews` | JWT | Admin review moderation |
| GET | `/customers` | JWT | List customers |
| DELETE | `/customers/:id` | JWT | Delete customer |
| POST | `/admin/login` | – | Returns JWT `token` |
| GET | `/admin/dashboard` | JWT | Dashboard counters |

Admin: open `/admin/login` and use the credentials from `backend/.env`
(defaults `admin` / `admin123` when seeded with no overrides — change in production).

## Node.js Fundamentals Demo (Experiment 7)

```bash
cd backend
npm run demo      # runs utils/nodeDemo.js directly
```

## Deployment Notes

- Build `frontend/dist` before starting the backend in production.
- Set `NODE_ENV=production`, `PORT`, `MONGODB_URI`, `JWT_SECRET` and `CLIENT_URL`
  (your deployed frontend origin) as environment variables on the host.
- MongoDB Atlas is recommended for hosting.

### Running MongoDB locally without installing it

A portable MongoDB 8.0.32 is extracted at
`D:\mongodb-dev\mongodb-win32-x86_64-windows-8.0.32` (nothing installed on `C:`).
It is already running against `D:\mongodb-dev\data`. To start it again after a reboot:

```powershell
New-Item -ItemType Directory -Force -Path "D:\mongodb-dev\data" | Out-Null
& "D:\mongodb-dev\mongodb-win32-x86_64-windows-8.0.32\bin\mongod.exe" `
    --dbpath "D:\mongodb-dev\data" --port 27017 --bind_ip 127.0.0.1 `
    --logpath "D:\mongodb-dev\mongod.log"
```

Then in another shell: `cd backend; npm run seed`

Confirm it is up with `GET /api/health` -> `"db": "connected"`.

Alternatively point `MONGODB_URI` at a free MongoDB Atlas cluster.

## Frontend Redesign Decisions

These were explicit owner decisions. Please don't undo them without asking.

| Area | Decision |
|------|----------|
| Cursor | Custom cursor **removed**. `CustomCursor.jsx` was deleted along with its CSS, its import in `App.jsx` and the `body { cursor: none }` rule. The native system cursor is used everywhere. |
| Language | **No switcher.** `LanguageContext.jsx` detects the visitor's browser language on mount (`mr-*` → `hi-*` → `en` fallback) and sets `html lang`. Nothing is persisted to `localStorage`. `LanguageSwitcher.jsx` was deleted. |
| Localisation | **Only the tagline** is translated — the rest of the hero stays English. See `src/i18n/translations.js` for the three native taglines. |
| Accent colours | Picker offers **exactly two blues**: Ocean Blue `#0077b6` and Deep Blue `#1d4ed8`. The contrast machinery still works for any hex (see below). |
| Hero visual | The old photo `<img>` chain was replaced by `WaterPurifier3D.jsx`, a self-contained animated SVG (no image assets). |
| Product enquiries | The product page has **no WhatsApp enquiry CTA** — it uses `ProductEnquiryForm.jsx`, which POSTs to `/api/enquiries` with `source: 'product-page'` and `productName`. Site-level hero and floating WhatsApp links still exist. |
| Message panels | The WhatsApp / SMS / call / copy panels were removed from contact and booking. `MessageActions.jsx` was deleted; both forms now confirm via toast. |
| Admin access | A low-key `/admin/login` link sits in the footer. |
| Animations | Reduced to native-cursor-friendly, professional motion: hero grid/aurora, button shine and hover lift, purifier animation, toast slide-in. All gated behind `prefers-reduced-motion`. |

### Theme and contrast architecture

`ThemeContext.jsx` derives every accent-dependent shade from the user's chosen colour
instead of hard-coding them, and writes them as CSS custom properties on `<html>`:

| Variable | Purpose |
|----------|---------|
| `--accent-color` | Filled backgrounds (buttons, borders) — kept dark enough for white text. |
| `--accent-text` | Accent on the *worst-case* surface. |
| `--accent-ink` | Accent used as foreground directly on `--bg-primary`. This is the one that matters in dark mode, where the brand blue only reached ~2.8:1 on the navy surfaces. |
| `--accent-on` | Ink placed **on** a filled accent background. |
| `--accent-hover` | Hover shade. |

Light and dark each declare their own base values in `src/index.css` under
`[data-theme='dark']`.

### Accessibility note

`ScrollReveal.jsx` offsets (`left`/`right` = 52px) are clamped to the vertical offset
below 768px. A sideways transform on a full-width block extends past the viewport and
gives the whole page a horizontal scrollbar, which is what caused a 40px overflow on
mobile. `html { overflow-x: hidden }` is also set as a safety net.

## Verification

There is **no test runner, linter or ESLint config in this repo** — `npm run build`
is the only automated check available. Functional and visual verification was done with
throwaway Chrome DevTools Protocol scripts (written to the OS temp directory, so they are
deliberately *not* committed). If you need to re-verify, recreate them rather than
looking for them here.

What was last confirmed:

- **Contrast:** 17 route × theme × accent combinations, zero WCAG AA failures.
- **Locale detection:** 8 unit cases plus live `en-IN` / `hi-IN` / `mr-IN` runs confirming
  `html lang`, the correct native tagline, Noto Sans Devanagari actually loading, and no overflow.
- **Forms:** product enquiry (including validation and blocked empty submit), contact and
  booking all submit, toast, and persist to MongoDB with the correct `source` / `productName` /
  `ticketId`.
- **Tracking:** `POST /api/services/track` returns the ticket, a wrong mobile is rejected
  with 404, and the UI renders ticket and status.
- **Mobile:** 390px horizontal overflow is 0.

Two gotchas worth remembering if you rebuild those harnesses:

1. `Page.reload` intermittently leaves `readyState` stuck at `loading` because the ~479KB
   JS bundle request never completes. Seed `localStorage` *first*, then navigate.
2. Never measure after a fixed sleep — the bundle is slow enough that React may mount
   after it, and you will audit an un-themed page while believing it is themed. Poll until
   `documentElement[data-theme]` and the body background have actually settled.

Also note `GET /api/enquiries` is admin-authenticated, so verify enquiry persistence by
querying MongoDB directly rather than through the API. The database name is
`raj-enterprises` (hyphen), not `raj_enterprises`.

## Known Limitations

- The site runs without MongoDB (health endpoint reports `db: disconnected`), but all
  data-backed APIs require a running database. Some public pages fall back to bundled
  sample data with a warning when the API is unavailable.
- Content imported from the original project (product descriptions, certifications,
  prices) must be verified against supplier/business records before launch.
- **Notifications are in-app only.** Contact, booking and product enquiries persist and
  show a toast, but nothing is emailed or messaged automatically — that needs SMTP
  credentials or the WhatsApp Business/Cloud API. WhatsApp links only open a prefilled
  draft in the visitor's own client.
- **No verified office address,** so the contact-page map is centred on Navi Mumbai,
  Maharashtra rather than an exact pin. Update it once the real address is confirmed.
- Product seed prices, specifications and certifications still need owner verification
  before launch.
- The 3D purifier SVG and the overall styling have not had a visual sign-off from the
  owner; all checks so far are DOM/CDP based and cannot judge aesthetics.
