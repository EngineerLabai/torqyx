#!/bin/bash
# Provider Secret Rotation Checklist
# Run each step manually and verify before moving to the next.
# This script guides you through the rotation sequence.

set -euo pipefail

STEP=0

step() {
  STEP=$((STEP + 1))
  echo
  echo "════════════════════════════════════════════════════════════════════"
  echo "STEP $STEP: $1"
  echo "════════════════════════════════════════════════════════════════════"
  echo
}

verify() {
  local prompt="$1"
  echo "⚠️  ACTION REQUIRED:"
  echo "$prompt"
  echo
  read -p "Press Enter when done, or Ctrl+C to abort: "
}

step "OpenAI API Key Rotation"
echo "1. Go to: https://platform.openai.com/account/api-keys"
echo "2. Find the exposed key and click 'Delete' or 'Revoke'"
echo "3. Create a new API key"
echo "4. Copy the new key"
verify "Have you created a new OpenAI API key? Paste it into your host's environment variables (Vercel/Netlify) as OPENAI_API_KEY"
echo "✓ OpenAI key rotated"

step "Vercel Token / OIDC Token Rotation"
echo "1. Go to: https://vercel.com/account/settings/tokens (or Project Settings → Integrations)"
echo "2. Find and revoke the exposed token"
echo "3. Create a new token or update integration"
echo "4. Copy the new token"
verify "Have you created a new Vercel token? Update your CI/CD secrets and environment variables"
echo "✓ Vercel token rotated"

step "Database Credentials Rotation (Postgres/Supabase)"
echo "1. Go to your database provider (e.g., Supabase console, AWS RDS, etc.)"
echo "2. Locate the database user/password settings"
echo "3. Change the password or reset credentials"
echo "4. Update DATABASE_URL with the new credentials"
verify "Have you updated DATABASE_URL in your host and local .env.local?"
echo "✓ Database credentials rotated"

step "NextAuth Secret Rotation"
echo "1. Generate a new secret locally:"
echo "   node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
echo "2. Copy the output"
verify "Have you generated and updated NEXTAUTH_SECRET in your host environment variables?"
echo "✓ NextAuth secret rotated"

step "Firebase Service Account Rotation"
echo "1. Go to: https://console.firebase.google.com/ → Project Settings → Service Accounts"
echo "2. Revoke the exposed private key"
echo "3. Generate a new private key (JSON)"
echo "4. Store as FIREBASE_ADMIN_PRIVATE_KEY in your host secrets"
verify "Have you rotated the Firebase service account and updated the environment variable?"
echo "✓ Firebase account rotated"

step "Update All Environment Variables"
echo "Summary of environment variables to update in your host (Vercel, Netlify, GitHub Actions, etc.):"
echo "  - OPENAI_API_KEY"
echo "  - VERCEL_OIDC_TOKEN (if applicable)"
echo "  - DATABASE_URL"
echo "  - NEXTAUTH_SECRET"
echo "  - FIREBASE_ADMIN_PRIVATE_KEY"
verify "Have you updated all environment variables in your hosting platform?"
echo "✓ All environment variables updated"

step "Deploy and Test"
echo "Deploying with new secrets..."
echo "1. Trigger a new deployment in your host (Vercel will auto-deploy on push)"
echo "2. Run smoke tests to verify integrations work"
echo "3. Check API responses from external services"
verify "Is the deployment complete and working correctly?"
echo "✓ Deployment verified"

step "Final Secret Scan"
echo "Scanning repository for any remaining secrets..."
echo "Command: grep -r 'sk-' . --include='*.ts' --include='*.tsx' --include='*.js' --include='*.json'"
echo "Expected: No matches (only documentation/placeholders)"
verify "Have you confirmed no real secrets in the repository?"
echo "✓ Secret scan passed"

echo
echo "════════════════════════════════════════════════════════════════════"
echo "✨ ALL ROTATION STEPS COMPLETED!"
echo "════════════════════════════════════════════════════════════════════"
echo
echo "Post-rotation checklist:"
echo "  ✓ All provider keys rotated"
echo "  ✓ Environment variables updated"
echo "  ✓ Deployment tested"
echo "  ✓ Secret scan passed"
echo "  ✓ Collaborators notified to re-clone"
echo
echo "You may now safely delete .env and .env.local from your local machine"
echo "and re-create them from .env.example for local development."
echo
