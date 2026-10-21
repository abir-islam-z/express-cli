#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

WORKFLOW_FILE=".github/workflows/pages.yml"
WORKFLOW_NAME="Deploy GitHub Pages"

if ! command -v gh >/dev/null 2>&1; then
  echo "Install GitHub CLI: https://cli.github.com/"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Run: gh auth login"
  exit 1
fi

REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
BRANCH="$(git branch --show-current)"

echo "Repository: $REPO"
echo "Branch: $BRANCH"

if ! gh api "repos/${REPO}/pages" >/dev/null 2>&1; then
  echo "Enabling GitHub Pages (GitHub Actions build)..."
  gh api -X POST "repos/${REPO}/pages" -f build_type=workflow
else
  echo "GitHub Pages is already enabled."
fi

echo "Pushing branch $BRANCH..."
git push -u origin "$BRANCH"

echo "Running workflow: $WORKFLOW_NAME"
if ! gh workflow run "$WORKFLOW_NAME" --ref "$BRANCH"; then
  gh workflow run "$WORKFLOW_FILE" --ref "$BRANCH"
fi

sleep 2
RUN_ID="$(gh run list --workflow="$WORKFLOW_FILE" --branch="$BRANCH" --limit 1 --json databaseId -q '.[0].databaseId')"
gh run watch "$RUN_ID" --exit-status

URL="$(gh api "repos/${REPO}/pages" -q .html_url)"
echo "Deployed: $URL"
