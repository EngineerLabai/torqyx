#!/bin/bash
# Helper for purging sensitive files from git history (DRY-RUN by default).
# WARNING: This is a destructive operation if executed. Review and run only with
# explicit consent and coordination with your team.

set -euo pipefail

REPO_URL=$(git config --get remote.origin.url || echo "<repo-url>")
MIRROR_DIR="repo-mirror.git"
FILES_TO_REMOVE=( ".env" ".env.local" ".vercel" )

echo "Repository remote: $REPO_URL"

echo "This script will:
  1) clone a mirror of the repository to $MIRROR_DIR
  2) run git-filter-repo to remove listed files from history
  3) force-push cleaned refs back to origin
"

echo "Files targeted for removal: ${FILES_TO_REMOVE[*]}"

echo "DRY RUN: no destructive actions will be performed. To run for real, set RUN=1 in the environment and re-run."

if [ "${RUN:-0}" != "1" ]; then
  echo "Dry run mode. To execute for real, set RUN=1 and ensure you have backups and collaborator coordination."
  echo
  echo "Commands that would be executed (for review):"
  echo "git clone --mirror $REPO_URL $MIRROR_DIR"
  echo "cd $MIRROR_DIR"
  echo -n "git filter-repo"
  for f in "${FILES_TO_REMOVE[@]}"; do
    echo -n " --invert-paths --paths $f"
  done
  echo
  echo "git push --force --all && git push --force --tags"
  exit 0
fi

# Real run (only if RUN=1)
if [ -z "$REPO_URL" ] || [ "$REPO_URL" = "<repo-url>" ]; then
  echo "Error: remote.origin.url not set or unknown. Please set REPO remote or update the script." >&2
  exit 1
fi

if [ -d "$MIRROR_DIR" ]; then
  echo "$MIRROR_DIR already exists; remove it before proceeding or change MIRROR_DIR." >&2
  exit 1
fi

# Clone and run git-filter-repo
git clone --mirror "$REPO_URL" "$MIRROR_DIR"
cd "$MIRROR_DIR"

# Build the filter-repo arguments
ARGS=()
for f in "${FILES_TO_REMOVE[@]}"; do
  ARGS+=(--invert-paths --paths "$f")
done

# Run filter-repo
git filter-repo "${ARGS[@]}"

# Finalize and push
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "Ready to push cleaned history. Push command: git push --force --all && git push --force --tags"

echo "Note: After pushing, collaborators will need to re-clone or run recovery steps."
