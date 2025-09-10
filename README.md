Vercel CI/CD template with Next.js, ESLint, Jest, and GitHub Actions.

Scripts
- dev: Run local dev server `npm run dev`
- lint: Lint all files `npm run lint`
- test: Run unit tests `npm test`
- test:ci: CI tests with JUnit report `npm run test:ci`
- build: Build Next.js app `npm run build`

Deployment via GitHub Actions
- Workflow: `.github/workflows/ci-vercel.yml:1`
- Add GitHub secret `VERCEL_TOKEN` to enable deploy steps.
- Optionally configure Vercel linking with `.vercel/project.json`.
# test-ci-cd-v2
