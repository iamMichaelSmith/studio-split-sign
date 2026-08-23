# Proxmox Local Copy

This folder is for running Split Sheet Studio as a local Proxmox LXC copy.

Current local target:

- Proxmox SSH alias: `proxmox-host`
- LXC VMID: `103`
- LXC hostname: `split-sheet-studio`
- LAN URL: `http://192.168.1.237:5050`
- App path in LXC: `/opt/split-sheet-studio`

## Deploy Current Repo

From Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy\proxmox\deploy-to-lxc.ps1 -SyncLocalEnv
```

The script:

- archives the current repo without `.git`, `node_modules`, `data`, `.env`, or VST build output
- preserves the existing LXC `/opt/split-sheet-studio/data` folder
- optionally copies your local `.env` into the LXC when `-SyncLocalEnv` is passed
- sets `PUBLIC_BASE_URL=http://192.168.1.237:5050` inside the LXC
- rebuilds and starts Docker Compose
- checks `http://192.168.1.237:5050/health`

## Useful Commands

```powershell
ssh proxmox-host "pct status 103"
ssh proxmox-host "pct start 103"
ssh proxmox-host "pct exec 103 -- bash -lc 'cd /opt/split-sheet-studio && docker compose ps'"
ssh proxmox-host "pct exec 103 -- bash -lc 'cd /opt/split-sheet-studio && docker compose logs --tail=100'"
```

## Notes

- This Proxmox copy is a same-code local replica of the public app, but it uses local LAN infrastructure instead of AWS.
- Public production uses AWS-managed services for database, sessions, PDF storage, and email. Mirroring production data locally requires a separate backup/import flow for Postgres and S3 artifacts.
- The VST can point at this copy by using `http://192.168.1.237:5050` as the API base URL.
- Keep `.env` out of git. It contains the owner login, session secret, and email settings.
