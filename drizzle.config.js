/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: "postgresql://neondb_owner:npg_RiD5r7CsEdgf@ep-dry-sunset-a88sqnce-pooler.eastus2.azure.neon.tech/neondb?sslmode=require",
    }
  }