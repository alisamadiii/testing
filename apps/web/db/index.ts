import "dotenv/config";

import { drizzle } from "drizzle-orm/neon-http";

export const db = drizzle(
  "postgresql://neondb_owner:npg_l6V2mwrJhbAM@ep-aged-dust-a670n4ov-pooler.us-west-2.aws.neon.tech/neondb?sslmode=require" as string
);
