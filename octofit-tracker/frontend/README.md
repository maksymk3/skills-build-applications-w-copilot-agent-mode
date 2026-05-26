# OctoFit Tracker Frontend

## Environment variable setup

Set `VITE_CODESPACE_NAME` before running the frontend in Codespaces-aware mode.

Example in `.env.local`:

```env
VITE_CODESPACE_NAME=your-codespace-name
```

When `VITE_CODESPACE_NAME` is set, the frontend calls:

- `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/`
- `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
- `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
- `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
- `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`

If `VITE_CODESPACE_NAME` is unset, the app safely falls back to `http://localhost:8000/api/...`.
