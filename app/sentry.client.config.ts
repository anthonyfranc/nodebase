import * as Sentry from "@sentry/nuxt";

Sentry.init({
  dsn: "https://feb68ea236db32a59638c46b5f1d1f85@o4507958643064832.ingest.us.sentry.io/4507958644375552",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});
