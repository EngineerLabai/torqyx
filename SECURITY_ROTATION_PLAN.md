# Security Rotation Plan

This document lists the exposed secrets found in the repository and provides step-by-step rotation and verification instructions per provider. Follow these steps in order and coordinate with collaborators before performing destructive repo history edits.

## Exposed items identified
- `OPENAI_API_KEY` — referenced in `.env` and `.env.local.example`
- `VERCEL_OIDC_TOKEN` — present in `.env.local`
- `DATABASE_URL` (Postgres/Supabase style) — present in `.env`
- `NEXTAUTH_SECRET` — present in `.env`
- `FIREBASE_ADMIN_PRIVATE_KEY` — referenced by `utils/firebase-admin.ts` (ensure no JSON file committed)

## High-level sequence
1. Rotate provider keys immediately (see per-provider steps below).
2. Update all hosting/CI environment variables with new secrets.
3. Redeploy and run smoke tests (unit + Playwright).
4. Once secrets are rotated and deployments verified, run git history purge to remove secrets from repository history.
5. Inform collaborators to re-clone the repository after purge.

## Per-provider rotation steps

### OpenAI
1. Revoke the exposed key in OpenAI Dashboard → API keys.
2. Create a new key.
3. Update `OPENAI_API_KEY` in Vercel (or your host) and in local `.env.local` (do not commit).
4. Redeploy and verify with a quick request:
```bash
curl -s -X POST https://api.openai.com/v1/models \
  -H "Authorization: Bearer $NEW_OPENAI_KEY" | jq .
```

### Vercel token / OIDC
1. Revoke the leaked token in Vercel Dashboard → Settings → Tokens.
2. Create a new token and update Vercel project Environment Variables or Integrations.
3. If token was used by CI locally, update local machines and secrets stores.

### Database (Postgres / Supabase)
1. Change the database user's password in the provider console.
2. Update `DATABASE_URL` in Vercel / host and local `.env.local`.
3. Restart services / redeploy and run migrations and smoke tests.

### NextAuth (`NEXTAUTH_SECRET`)
1. Generate a new secret locally:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
2. Replace `NEXTAUTH_SECRET` in all env locations and redeploy.

### Firebase service account
1. In Firebase Console → Project Settings → Service accounts: revoke exposed key(s).
2. Create a new private key and store it in your host secrets as `FIREBASE_ADMIN_PRIVATE_KEY` (base64 or literal depending on your code).
3. Redeploy and exercise admin flows to verify.

## Updating CI/CD and local dev
- Update environment variables in Vercel / Netlify / GitHub Actions.
- Remove any committed `.env` files (already removed from index). Use `.env.example` as template.

## Verifications
- Run unit tests: `npm test` or `pnpm test`.
- Run Playwright smoke tests: `npx playwright test`.
- Hit endpoints that use external providers to confirm correct integration.

## Git history purge (destructive)
Use the repository helper `scripts/history-purge.sh`. This will:
- Clone a mirrored copy of the repository to `repo-mirror.git`.
- Run `git filter-repo` to remove the listed files from history.
- It will **not** push by default; after inspection push with `git push --force --all` and `git push --force --tags`.

Recommended commands (on Git Bash / WSL):
```bash
# Dry run (shows intended commands):
bash scripts/history-purge.sh

# Real run (destructive):
RUN=1 bash scripts/history-purge.sh

# After pushing cleaned history, instruct collaborators to re-clone:
git clone <repo-url>
```

## Communication
- Announce rotation + purge schedule to all collaborators with exact timestamp.
- Instruct collaborators to: pull any local unpushed branches, back up work, and re-clone after the forced push.

## Checklist
- [ ] Rotate OpenAI API key
- [ ] Rotate Vercel tokens
- [ ] Rotate DB credentials
- [ ] Replace NEXTAUTH_SECRET
- [ ] Rotate Firebase service account
- [ ] Update host/CI envs
- [ ] Redeploy + run tests
- [ ] Run destructive git history purge
- [ ] Notify collaborators

---
Last updated: 2026-05-07
