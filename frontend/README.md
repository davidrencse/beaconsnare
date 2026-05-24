# BeaconSnare Frontend

React + Vite + TypeScript control panel for the BeaconSnare backend API.

## Run locally

```bash
npm install
VITE_API_BASE_URL=http://localhost:3000 npm run dev
```

If `VITE_API_BASE_URL` is not set, the app uses `http://localhost:3000`. Authenticated or session-aware API calls are sent with `credentials: include`.

## Build

```bash
npm run build
```

The Vite base path is configured as `/beaconsnare/` for GitHub Pages deployment.
