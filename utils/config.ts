import dotenv from 'dotenv';

// Load values from .env (if the file exists). Anything already set in the
// environment, e.g. by the CI pipeline, takes priority over the file.
dotenv.config({ quiet: true });

export const config = {
  baseUrl: process.env.BASE_URL || 'http://jupiter.cloud.planittesting.com',
  headless: process.env.HEADLESS !== 'false',
  retries: Number(process.env.RETRIES || 0),
  workers: Number(process.env.WORKERS || 2),
  submitTimeout: Number(process.env.SUBMIT_TIMEOUT || 60000),
  contactRuns: Number(process.env.CONTACT_RUNS || 5),
};
