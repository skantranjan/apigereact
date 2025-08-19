import CryptoJS from 'crypto-js';
import moment from 'moment';
import { getCurrentConfig, FIXED_CONFIG } from '../config/hmacConfig';

// Get current HMAC configuration
const getConfig = () => getCurrentConfig();

// Generate UTC timestamp in required format
export const generateTimestamp = (): string => {
  return moment.utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
};

// Generate HMAC hash for specific HTTP method
export const generateHMAC = (httpMethod: string, timestamp: string): string => {
  const config = getConfig();
  const data = `${httpMethod}${FIXED_CONFIG.ID}${timestamp}`; // ID is fixed
  const hash = CryptoJS.HmacSHA256(data, config.KEY);
  return CryptoJS.enc.Base64.stringify(hash);
};

// Generate all authentication headers for a specific HTTP method
export const generateAuthHeaders = (httpMethod: string, contentType?: string): Record<string, string> => {
  const config = getConfig();
  const timestamp = generateTimestamp();
  const requestId = generateHMAC(httpMethod, timestamp);
  
  const headers: Record<string, string> = {
    'x-apikey': FIXED_CONFIG.API_KEY, // API key is fixed across environments
    'requestid': requestId,
    'timestamp': timestamp,
    'Origin': window.location.origin || 'http://localhost:3000'
  };
  
  if (contentType && contentType !== 'multipart/form-data') {
    headers['Content-Type'] = contentType;
  }
  
  return headers;
};

// Generate headers for specific HTTP methods
export const getHeaders = (httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', contentType?: string) => {
  return generateAuthHeaders(httpMethod, contentType);
};

// Log authentication details for debugging
export const logAuthDetails = (httpMethod: string) => {
  const config = getConfig();
  const timestamp = generateTimestamp();
  const requestId = generateHMAC(httpMethod, timestamp);
  
  console.log(`🔐 HMAC Authentication for ${httpMethod}:`);
  console.log(`   Environment: ${config === getCurrentConfig() ? 'DEV' : 'CUSTOM'}`);
  console.log(`   Timestamp: ${timestamp}`);
  console.log(`   Request ID: ${requestId}`);
  console.log(`   Data String: ${httpMethod}${FIXED_CONFIG.ID}${timestamp}`);
  console.log(`   API Key: ${FIXED_CONFIG.API_KEY.substring(0, 8)}... (Fixed)`);
};
