import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://<username>:<password>@db.prisma.io:5432/<database_name>-production";
export const PORT = process.env.PORT || 3001;
export const JWT_SECRET = process.env.JWT_SECRET;
export const CORS_ORIGIN = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:5173"];
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
export const R2_ENDPOINT = process.env.R2_ENDPOINT;
export const BUCKET_NAME = process.env.BUCKET_NAME;
export const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
export const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

export function validateRequiredSecrets() {
  const requiredEnv = ["DATABASE_URL", "JWT_SECRET"];
  requiredEnv.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environmental variable: ${key}`);
    }
  });
}
