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
