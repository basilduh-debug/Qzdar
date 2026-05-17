# Qzdar Backend

Node.js + Express + Mongoose + JWT backend.
Covers lectures: **L10 NodeNpm, L11 Express, L12 Middleware, L13 JWT, L14 Mongoose**.

## Setup

```
cd backend
npm install
```

Make sure MongoDB is running on `mongodb://127.0.0.1:27017` (or change `.env`).

```
npm start
```

Runs on `http://localhost:5000`.

## API endpoints

### Auth
- `POST /api/auth/signup` — `{ username, password, role }`
- `POST /api/auth/signin` — `{ username, password }`

### Stadiums (some require Bearer token in `Authorization` header)
- `GET  /api/stadiums?location=...` — list stadiums (public)
- `GET  /api/stadiums/:id` — one stadium (public)
- `GET  /api/stadiums/mine` — my stadiums (owner)
- `POST /api/stadiums` — add stadium (owner) — `{ name, description, location, photos }`

### Slots
- `GET  /api/slots/stadium/:id` — slots of a stadium
- `GET  /api/slots/mine` — my reservations (user)
- `GET  /api/slots/stats` — owner stats
- `GET  /api/slots/search?date=&location=`
- `POST /api/slots` — owner adds a slot (must be within next 7 days)
- `PUT  /api/slots/:id/reserve` — user reserves
- `PUT  /api/slots/:id/cancel` — user cancels

### Messages
- `POST /api/messages` — `{ to, text }`
- `GET  /api/messages/inbox`
- `GET  /api/messages/with/:userId`

## Folder structure

```
backend/
  server.js         entry point
  .env              MONGO_URI, PORT, JWT_SECRET
  models/           Mongoose schemas (L14)
  middleware/       JWT auth middleware (L12 + L13)
  routes/           Express routers (L11)
```
