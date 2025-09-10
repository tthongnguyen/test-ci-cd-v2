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

Sentry (optional)
- Install is configured via `@sentry/nextjs` in `package.json`.
- Runtime init: `src/sentry.js:1` (no-op if `SENTRY_DSN` is not set).
- API handlers wrapped with `withSentry` for error capture.
- Set env vars in Vercel/GitHub: `SENTRY_DSN`, `SENTRY_ENV`, `SENTRY_TRACES_SAMPLE_RATE` (e.g. 0.1), `SENTRY_PROFILES_SAMPLE_RATE` (e.g. 0.1).
- Source map uploads are not enabled (kept simple). If needed later, we can enable `withSentryConfig` in `next.config.js` and set Sentry org/project/auth token.
# test-ci-cd-v2
