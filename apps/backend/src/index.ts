import express, { Express } from "express";
import cors from "cors";
import {
  DATABASE_URL,
  PORT,
  CORS_ORIGIN,
  validateRequiredSecrets,
} from "./secrets";
import { errorHandler } from "./middleware/errorHandler";
import rootRouter from "./routes";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { logger, requestLogger } from "./middleware/logger";

validateRequiredSecrets();

const app: Express = express();

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Private-Network", "true");
  next();
});
app.use("/", rootRouter);
app.use(requestLogger);
app.use(errorHandler);

const connectionString = DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
export const prismaClient = new PrismaClient({ adapter });

app.listen(PORT, () => {
  logger.info(`App Working on port ${String(PORT)}!`);
});
