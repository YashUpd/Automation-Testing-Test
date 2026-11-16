import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const email = process.env.USER_EMAIL || process.env.EMAIL || '';
const password = process.env.USER_PASSWORD || process.env.PASSWORD || '';
const baseURL = process.env.BASE_URL || 'http://122.160.80.98:9001/shell/index.html?ccode=MC4Q&lang=en#/home';

export const envConfig = {
  baseURL,
  credentials: {
    email,
    password,
  },
  timeouts: {
    testTimeout: parseInt(process.env.TEST_TIMEOUT || '60000', 10),
    actionTimeout: parseInt(process.env.ACTION_TIMEOUT || '15000', 10),
    navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || '30000', 10),
  },
  isCI: !!process.env.CI,
  headless: process.env.HEADLESS !== 'false',

  /**
   * Validates that required environment secrets are present
   */
  validate() {
    const missing = [];
    if (!this.credentials.email) missing.push('USER_EMAIL (or EMAIL)');
    if (!this.credentials.password) missing.push('USER_PASSWORD (or PASSWORD)');
    if (missing.length > 0) {
      throw new Error(
        `[Environment Error] Missing required secrets in .env file: ${missing.join(', ')}.\n` +
        `Please copy .env.example to .env and configure your credentials.`
      );
    }
  },
};

// Validate environment on load
envConfig.validate();

export default envConfig;
