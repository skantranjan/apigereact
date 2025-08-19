// HMAC Authentication Configuration
// Update these values based on your environment

// IMPORTANT NOTES:
// - API_KEY is FIXED and will NOT change across environments
// - HMAC KEY (used for generating requestid) may change per environment
// - ID ('SustainibilityPortal') is also fixed
// - BASE_URL changes per environment

export const HMAC_CONFIG = {
  // Development Environment
  DEV: {
    ID: 'SustainibilityPortal',
    KEY: '0KEX8P1I7U9NJHKV1L7XHCVH6QI9XXCS',
    API_KEY: 'bGMxYSqsNUb6F88L9rTY3OOMCynzZKAF',
    BASE_URL: 'https://haleon-api-dev.apigee.net/Sustainibility-portal-channel/v1'
  },
  
  // Staging Environment (if you have one)
  STAGING: {
    ID: 'SustainibilityPortal',
    KEY: 'YOUR_STAGING_HMAC_KEY_HERE', // Replace with actual staging HMAC key
    API_KEY: 'bGMxYSqsNUb6F88L9rTY3OOMCynzZKAF', // Same fixed API key across environments
    BASE_URL: 'https://haleon-api-staging.apigee.net/Sustainibility-portal-channel/v1'
  },
  
  // Production Environment (if you have one)
  PRODUCTION: {
    ID: 'SustainibilityPortal',
    KEY: 'YOUR_PRODUCTION_HMAC_KEY_HERE', // Replace with actual production HMAC key
    API_KEY: 'bGMxYSqsNUb6F88L9rTY3OOMCynzZKAF', // Same fixed API key across environments
    BASE_URL: 'https://haleon-api-prod.apigee.net/Sustainibility-portal-channel/v1'
  }
};

// Current environment - change this based on your deployment
export const CURRENT_ENV = 'DEV';

// Get current configuration
export const getCurrentConfig = () => {
  return HMAC_CONFIG[CURRENT_ENV as keyof typeof HMAC_CONFIG];
};

// Environment-specific configuration
export const getConfigForEnvironment = (env: string) => {
  const envKey = env.toUpperCase() as keyof typeof HMAC_CONFIG;
  return HMAC_CONFIG[envKey] || HMAC_CONFIG.DEV;
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
