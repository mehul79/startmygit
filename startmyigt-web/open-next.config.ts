import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// ponytail: defaults only — add R2 incremental cache etc. when ISR/caching matters.
export default defineCloudflareConfig();
