"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppConfig_1 = require("@/app/config/app.config");
require("dotenv/config");
const drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    out: './drizzle',
    schema: './src/db/schema/index.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: AppConfig_1.AppConfig.getInstance().database.url,
    },
});
//# sourceMappingURL=drizzle.config.js.map