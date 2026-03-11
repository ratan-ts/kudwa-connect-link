# Integrations App

A simple Next.js app with one page listing integrations (Wafeq and QuickBooks). Clicking an integration starts an OAuth flow via **your backend**: the app calls your APIs to get the authorization URL and to complete the callback; tokens are stored on your backend.

## Backend API

The app expects your backend at `BACKEND_URL` (e.g. `http://localhost:8000`) with:

1. **POST /oauth/initiate**
   - Headers: `Content-Type: application/json`, `api-key: <OAUTH_API_KEY>`
   - Body: `{ "integration_name": "QUICKBOOKS_SANDBOX" | "WAFEQ", "company_id": "user123" }`
   - Response: `{ "success": true, "data": { "authorization_url": "...", "state": "..." } }`

2. **POST /oauth/callback**
   - Headers: `Content-Type: application/json`, `api-key: <OAUTH_API_KEY>`
   - Body: `{ "authorization_code": "<code>", "state": "<state>", "variables": { "organization_id": "..." } }` (variables optional)

Your backend must use redirect_uri **`http://localhost:3000/oauth/callback`** (or your `NEXT_PUBLIC_APP_URL` + `/oauth/callback`) when initiating OAuth so the provider redirects back to this app.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `env.example` to `.env.local` and set:

   - `NEXT_PUBLIC_APP_URL` – frontend URL (e.g. `http://localhost:3000`); must match the redirect_uri your backend uses.
   - `BACKEND_URL` – your OAuth backend (e.g. `http://localhost:8000`).
   - `OAUTH_API_KEY` – API key for your backend (`api-key` header).

3. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Click an integration to start OAuth; your backend returns the authorization URL, then the user is redirected back to `/oauth/callback` and this app calls your backend with the code and state.

## Optional: company_id

The start link is `/api/oauth/start?integration=quickbooks` (or `wafeq`). You can pass `company_id` in the query, e.g. `/api/oauth/start?integration=quickbooks&company_id=user123`; it defaults to `user123` if omitted.

## Optional: organization_id on callback

If your backend expects `variables.organization_id` in the callback, you can pass it as a query param when the provider redirects (if the provider supports it). This app forwards `?organization_id=...` from the callback URL into `variables.organization_id` when calling your backend.

## Routes

- **`/`** – Integrations list; each card links to start OAuth.
- **`/api/oauth/start?integration=quickbooks|wafeq&company_id=user123`** – Calls your backend `/oauth/initiate`, then redirects to the returned `authorization_url`.
- **`/oauth/callback`** – OAuth redirect target; calls your backend `/oauth/callback` with `authorization_code` and `state`, then redirects to `/` with success or error.
