type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDevelopment = process.env.NODE_ENV === 'development';

function formatMessage(level: LogLevel, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
}

export const logger = {
  debug: (message: string, ...optionalParams: unknown[]) => {
    if (isDevelopment) {
      console.debug(formatMessage('debug', message), ...optionalParams);
    }
  },
  info: (message: string, ...optionalParams: unknown[]) => {
    console.info(formatMessage('info', message), ...optionalParams);
  },
  warn: (message: string, ...optionalParams: unknown[]) => {
    console.warn(formatMessage('warn', message), ...optionalParams);
  },
  error: (message: string, ...optionalParams: unknown[]) => {
    console.error(formatMessage('error', message), ...optionalParams);
  },
};
