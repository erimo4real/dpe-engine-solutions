const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 }
const currentLevel = LEVELS[process.env.LOG_LEVEL] ?? LEVELS.info

function ts() {
  return new Date().toISOString()
}

export const logger = {
  debug: (...args) => { if (currentLevel <= 0) console.debug(`[${ts()}] [DEBUG]`, ...args) },
  info: (...args) => { if (currentLevel <= 1) console.log(`[${ts()}] [INFO]`, ...args) },
  warn: (...args) => { if (currentLevel <= 2) console.warn(`[${ts()}] [WARN]`, ...args) },
  error: (...args) => { if (currentLevel <= 3) console.error(`[${ts()}] [ERROR]`, ...args) },
}
