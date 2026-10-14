# Raj Enterprises — Water Purifier Website (MERN)

Business website and admin panel for **Raj Enterprises**, a domestic RO water purifier
sales, installation, repair and AMC business.

- **Tagline:** Shuddha Paani, Bharosa Pakka — Complete RO Solutions.
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
│       ├── components/         # Reusable UI (KitchenHero3D, ProductViewer, TicketTracker, ToastProvider usage…)
│       ├── context/            # ThemeContext, LanguageContext, ToastContext
│       ├── i18n/               # translations.js (taglines + locale detection)
│       ├── pages/              # Route pages
│       ├── services/api.js     # Axios API layer
│       └── utils/              # validators, helpers
└── Procfile                    # Single-service deployment
```
