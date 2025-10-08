import { AppConfig } from '@/app/config/AppConfig';
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: AppConfig.getInstance().database.url,
  },
});
