import winston from "winston";
import { env } from "../config/environment";

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, errors, json, colorize } = format;

// Define your custom format
const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level.toUpperCase()}] ${message}`;

  if (Object.keys(metadata).length > 0 && metadata.stack) {
    // If it's an error with a stack trace
    msg += `\n${metadata.stack}`;
  } else if (Object.keys(metadata).length > 0) {
    // For other metadata
    msg += ` ${JSON.stringify(metadata, null, 2)}`;
  }

  return msg;
});

// Create the logger instance
const logger = createLogger({
  level: env.NODE_ENV === "development" ? "debug" : "info",
  defaultMeta: { service: "journal-app" },
  format: combine(
    errors({ stack: true }), // Capture stack traces
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    json()
  ),
  transports: [
    // Write all errors to error.log
    new transports.File({
      filename: "logs/error.log",
      level: "error",
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        customFormat
      ),
    }),
    // Write all logs to combined.log
    new transports.File({
      filename: "logs/combined.log",
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        customFormat
      ),
    }),
  ],
  // Handle uncaught exceptions
  exceptionHandlers: [new transports.File({ filename: "logs/exceptions.log" })],
  // Handle unhandled promise rejections
  rejectionHandlers: [new transports.File({ filename: "logs/rejections.log" })],
});

// Add console transport in non-production environments
if (env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        customFormat
      ),
    })
  );
}

// Define types for metadata
type LogMetadata = Record<string, unknown>;

// Create a wrapper for the logger that conditionally logs based on environment
const isDevelopment = env.NODE_ENV === "development";

const conditionalLogger = {
  error: (message: string, meta?: LogMetadata) => logger.error(message, meta),
  warn: (message: string, meta?: LogMetadata) => logger.warn(message, meta),
  info: (message: string, meta?: LogMetadata) => {
    if (isDevelopment) {
      logger.info(message, meta);
    }
  },
  debug: (message: string, meta?: LogMetadata) => {
    if (isDevelopment) {
      logger.debug(message, meta);
    }
  },
};

export default conditionalLogger;
