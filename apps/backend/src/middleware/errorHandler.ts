import { Request, Response, NextFunction } from "express";
import { constants } from "./constants";
import { Prisma } from "../../generated/prisma";
import { logger } from "./logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let title = "Error";

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = constants.NOT_FOUND;
      title = "Not Found";
    }
    if (err.code === "P2002") {
      statusCode = constants.CONFLICT;
      title = "Duplicate Entry";
    }
  }

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      title = "Validation Failed";
      break;
    case constants.UNAUTHORIZED:
      title = "Unauthorized";
      break;
    case constants.FORBIDDEN:
      title = "Forbidden";
      break;
    case constants.NOT_FOUND:
      title = "Not Found";
      break;
    case constants.CONFLICT:
      title = "Conflict / Duplicate Record";
      break;
    case constants.TOO_MANY_REQUESTS:
      title = "Rate Limit Exceeded";
      break;
    default:
      title = "Server Error";
      statusCode = 500;
      break;
  }

  logger.error(`${title}: [${String(statusCode)}] ${err.message}`);
  if (process.env.NODE_ENV !== "production") {
    logger.error(`Stack: ${String(err.stack)}`);
  }

  res.status(statusCode).json({
    title,
    message: err.message,
    stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
