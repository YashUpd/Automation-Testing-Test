/**
 * Standardized Logger for Test Automation
 */
export class Logger {
  static formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  static info(message) {
    console.log(this.formatMessage('INFO', message));
  }

  static step(stepNumber, description) {
    console.log(this.formatMessage('STEP', `Step ${stepNumber}: ${description}`));
  }

  static warn(message) {
    console.warn(this.formatMessage('WARN', message));
  }

  static error(message, err = null) {
    console.error(this.formatMessage('ERROR', message));
    if (err) {
      console.error(err);
    }
  }

  static success(message) {
    console.log(this.formatMessage('SUCCESS', `✓ ${message}`));
  }
}

export default Logger;

