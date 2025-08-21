// HMAC Authentication Configuration
// Update these values based on your environment

// IMPORTANT NOTES:
// - API_KEY is FIXED and will NOT change across environments
// - HMAC KEY (used for generating requestid) may change per environment
// - ID ('SustainibilityPortal') is also fixed
// - BASE_URL changes per environment

export const hmacConfig = {
  ID: process.env.REACT_APP_HMAC_ID,
  KEY: process.env.REACT_APP_HMAC_KEY,
  API_KEY: process.env.REACT_APP_API_KEY,
  BASE_URL: process.env.REACT_APP_BASE_URL
};

// Current environment - change this based on your deployment
export const CURRENT_ENV = 'DEV';

// Get current configuration
export const getCurrentConfig = () => {
  return hmacConfig;
};

// Environment-specific configuration
export const getConfigForEnvironment = (env: string) => {
  // For now, return the main config since we're using environment variables
  // You can extend this later for different environment configurations
  return hmacConfig;
};

// Constants that don't change across environments
export const FIXED_CONFIG = {
  API_KEY: 'bGMxYSqsNUb6F88L9rTY3OOMCynzZKAF', // This key is fixed and won't change
  ID: 'SustainibilityPortal' // This ID is also fixed
};

// Helper to get only the variable parts of config
export const getVariableConfig = (env: string = CURRENT_ENV) => {
  const config = getConfigForEnvironment(env);
  return {
    KEY: config.KEY, // HMAC secret key (may change)
    BASE_URL: config.BASE_URL // API base URL (may change)
  };
};
