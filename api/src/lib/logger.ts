import { createLogger } from '@redwoodjs/api/logger'

/**
 * Creates a logger with RedwoodJS's logger.
 *
 * By default this logs to stdout and stderr (console.log/console.error) as JSON.
 */
export const logger = createLogger({})