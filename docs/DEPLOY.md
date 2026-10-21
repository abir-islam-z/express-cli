# Deploy documentation (GitHub Pages)

The site lives in `docs/`. GitHub Actions uploads that folder on each deploy.

From the repo root:

```bash
chmod +x scripts/deploy-docs.sh
./scripts/deploy-docs.sh
```

The script uses the GitHub CLI (`gh`) to:

1. Enable Pages with `build_type=workflow` if needed
2. `git push` the current branch
3. `gh workflow run` for `Deploy GitHub Pages`
4. `gh run watch` until the job finishes

One-time in the GitHub UI: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Manual trigger without the script:

```bash
gh workflow run "Deploy GitHub Pages" --ref main
gh run watch
```
