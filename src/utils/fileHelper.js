import fs from 'fs';
import path from 'path';
import Logger from './logger.js';

export class FileHelper {
  /**
   * Ensures the target directory exists
   * @param {string} dirPath
   */
  static ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      Logger.info(`Created directory: ${dirPath}`);
    }
  }

  /**
   * Verifies downloaded file exists and is not empty
   * @param {string} filePath
   * @param {number} minBytes
   * @returns {boolean}
   */
  static verifyFileExistsAndNotEmpty(filePath, minBytes = 1) {
    if (!fs.existsSync(filePath)) {
      Logger.error(`File does not exist: ${filePath}`);
      return false;
    }
    const stats = fs.statSync(filePath);
    if (stats.size < minBytes) {
      Logger.error(`File is empty or smaller than ${minBytes} bytes: ${filePath} (${stats.size} bytes)`);
      return false;
    }
    Logger.success(`File verified successfully: ${path.basename(filePath)} (${stats.size} bytes)`);
    return true;
  }

  /**
   * Deletes files in a directory matching a pattern
   * @param {string} dirPath
   */
  static cleanDirectory(dirPath) {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        const fullPath = path.join(dirPath, file);
        try {
          fs.unlinkSync(fullPath);
        } catch (e) {
          Logger.warn(`Could not delete file: ${fullPath} - ${e.message}`);
        }
      }
      Logger.info(`Cleaned directory: ${dirPath}`);
    }
  }
}

export default FileHelper;

