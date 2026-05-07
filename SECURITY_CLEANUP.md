# Security cleanup and secret rotation steps

This repository contained committed secrets (.env, .env.local). Follow these steps to fully remediate and rotate secrets.

1. Rotate compromised secrets immediately:
   - OpenAI API keys: revoke the exposed key in the OpenAI dashboard and create a new key.
   - Vercel/Git/CI tokens: revoke the token shown in `.env.local` and create a new one.
   - NextAuth secret: generate a new 64+ char random secret and update your deployment env.
   - Firebase service account / private key: revoke the old service account key and create a new one.

2. Remove secrets from the repository history (recommended):
   - Use `git filter-repo` (preferred) or BFG to scrub secrets from history.
   - Example using `git filter-repo`:
     ```bash
     pip install git-filter-repo
     git clone --mirror <repo-url> repo.git
     cd repo.git
     git filter-repo --invert-paths --path .env --path .env.local
     git push --force
     ```
   - Or BFG:
     ```bash
     bfg --delete-files .env repo.git
     git reflog expire --expire=now --all && git gc --prune=now --aggressive
     git push --force
     ```

3. Ensure `.gitignore` blocks env files (this repo already contains `.env*` patterns). Add `.env.example` for reference.

4. Update deployment environments with new secrets and test deployments.

5. Revoke old tokens in third-party dashboards to ensure leaked values can't be used.

6. Optional: create an incident note in your team's tracker with rotated keys and a timeline.

If you want, I can run the history-scrubbing commands here (requires credentials and time). Let me know which keys you've rotated and whether you want me to proceed with history purge.

--

Detailed checklist and next steps (recommended, follow in order):

1) Immediate rotation (do this now using provider dashboards)
  - OpenAI: Revoke the exposed key and create a new API key in https://platform.openai.com/account/api-keys.
  - Vercel: Revoke any tokens shown in `.env.local` and re-create project tokens under Vercel dashboard -> Settings -> Tokens.
  - Database (Supabase/Postgres): Rotate user passwords or connection strings in the DB provider panel and update `DATABASE_URL` accordingly.
  - NextAuth / app secrets: Generate a new `NEXTAUTH_SECRET` (random 64+ chars) and set it in your deployment platform.

2) Local repo hygiene (already mostly done)
  - Ensure `.gitignore` contains `.env*` (this repo already does).
  - Remove any remaining tracked env files from the index (example):
    ```bash
    git rm --cached .env .env.local .vercel -r || true
    git add -A
    git commit -m "chore(security): remove committed env and cache files from index"
    ```

3) Update deployment environments
  - Use your hosting provider's environment variable UI (Vercel, Netlify, Cloud Run, etc.) or CLI to add the new secrets.
  - Vercel CLI example:
    ```bash
    vercel env add OPENAI_API_KEY production
    vercel env add NEXTAUTH_SECRET production
    vercel env add DATABASE_URL production
    ```

4) Confirm services work
  - Redeploy the application after setting new secrets and run smoke tests or basic flows that use API keys and DB connections.

5) Optional: scrub git history (only if you need to permanently remove leaked values)
  - I can prepare and run a safe, documented `git filter-repo` or BFG workflow for you, but it requires force-pushing to remote and coordination with collaborators.

6) Post-rotation tasks
  - Record rotated keys and timestamps in your incident tracker (ticket, slack channel, or internal doc).
  - Consider enabling stronger secrets policies: short-lived tokens, limited-scoped tokens, and auditing alerts.

Helper automation I can add to the repo (no secrets written):
 - `scripts/prepare-env-local.ps1` — copies `.env.local.example` to `.env.local` and opens it for manual editing locally.
 - `scripts/history-purge.sh` — template script to run `git filter-repo` or BFG (requires confirmation before running).

If you'd like, I will add the helper scripts to the repo now so you can rotate later; otherwise I will just expand this doc and stop. You said you will not update keys now — shall I add the helper scripts for when you're ready?
