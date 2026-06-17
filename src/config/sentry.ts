import * as Sentry from "@sentry/node";
import { env } from "@/config/env.js";

Sentry.init({
  dsn: env.sentryDns,
  sendDefaultPii: true,
});
