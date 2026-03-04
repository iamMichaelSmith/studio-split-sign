# Deployment

## Recommended topology
- Private LAN or VPN first
- Reverse proxy (Caddy/Nginx) in front
- HTTPS/TLS required for internet exposure

## Environment
Required before go-live:
- `ADMIN_USER`
- `ADMIN_PASS`
- `SESSION_SECRET`
- `PUBLIC_BASE_URL`
- SMTP credentials for delivery

## Start
```powershell
npm install
npm run test
npm run dev
```

## Health checks
- `GET /health`
- `GET /ready`

## Backup
Back up these paths daily:
- `data/submissions/`
- `data/pdfs/`
