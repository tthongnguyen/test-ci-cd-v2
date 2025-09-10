import * as Sentry from "@sentry/nextjs";

// Safe to call at module load; SDK is a no-op without DSN
Sentry.init({
	dsn: process.env.SENTRY_DSN || undefined,
	tracesSampleRate: process.env.SENTRY_TRACES_SAMPLE_RATE
		? Number(process.env.SENTRY_TRACES_SAMPLE_RATE)
		: 0,
	profilesSampleRate: process.env.SENTRY_PROFILES_SAMPLE_RATE
		? Number(process.env.SENTRY_PROFILES_SAMPLE_RATE)
		: 0,
	environment: process.env.SENTRY_ENV || process.env.NODE_ENV || "development",
});

export { Sentry };
