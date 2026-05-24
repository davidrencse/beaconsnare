# BeaconSnare Backend

Node.js, Express, and TypeScript REST API for BeaconSnare.

## Run

```bash
npm install
npm run build
npm run dev
```

Default port is `4000`. Set `PORT` to change it. Set `PUBLIC_BASE_URL` to the externally reachable backend URL used when generated beacon URLs are displayed.

## Persistence

This MVP uses durable file-backed JSON storage in `backend/data/store.json` and export artifacts in `backend/data/exports/`. The project plan references PostgreSQL/Prisma for a production deployment; the storage boundary is intentionally compact so it can be replaced by a database implementation later.

## Core routes

- `GET /api/health`
- `GET /api/config`
- CRUD-style target and campaign management under `/api/targets` and `/api/campaigns`
- Event, session, audit, and export browsing under `/api/events`, `/api/sessions`, `/api/audit`, and `/api/exports`
- Metadata-only callback ingestion at `/ingest/http/:beaconToken`, `/ingest/webhook/:beaconToken`, and `/ingest/doh/:beaconToken`

Request bodies are size-limited and callback bodies are stored only as bounded previews plus metadata.