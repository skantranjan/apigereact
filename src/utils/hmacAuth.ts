import { getCurrentConfig, FIXED_CONFIG } from '../config/hmacConfig';

// Get current HMAC configuration
const getConfig = () => getCurrentConfig();

// Generate UTC timestamp in required format
export const generateTimestamp = (): string => {
  const date = new Date();
  const utcString = date.toISOString();
  return utcString.replace('Z', '[Z]');
};

// Convert string to Uint8Array
const stringToUint8Array = (str: string): Uint8Array => {
  const encoder = new TextEncoder();
  return encoder.encode(str);
};

// Convert ArrayBuffer to Base64 string
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// Generate HMAC hash for specific HTTP method using browser's crypto.subtle
export const generateHMAC = async (httpMethod: string, timestamp: string): Promise<string> => {
  const config = getConfig();
  const data = `${httpMethod}${FIXED_CONFIG.ID}${timestamp}`; // ID is fixed
  
  try {
    // Convert the HMAC key to Uint8Array
    const keyBuffer = stringToUint8Array(config.KEY);
    const dataBuffer = stringToUint8Array(data);
    
    // Import the HMAC key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    // Sign the data
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
    
    // Convert to Base64
    return arrayBufferToBase64(signature);
  } catch (error) {
    console.error('Error generating HMAC:', error);
    throw new Error('Failed to generate HMAC signature');
  }
};

// Generate all authentication headers for a specific HTTP method
export const generateAuthHeaders = async (httpMethod: string, contentType?: string): Promise<Record<string, string>> => {
  const config = getConfig();
  const timestamp = generateTimestamp();
  const requestId = await generateHMAC(httpMethod, timestamp);
  
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
export const getHeaders = async (httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', contentType?: string) => {
  return generateAuthHeaders(httpMethod, contentType);
};

// Log authentication details for debugging
export const logAuthDetails = async (httpMethod: string) => {
  const config = getConfig();
  const timestamp = generateTimestamp();
  const requestId = await generateHMAC(httpMethod, timestamp);
  
  console.log(`🔐 HMAC Authentication for ${httpMethod}:`);
  console.log(`   Environment: ${config === getCurrentConfig() ? 'DEV' : 'CUSTOM'}`);
  console.log(`   Timestamp: ${timestamp}`);
  console.log(`   Request ID: ${requestId}`);
  console.log(`   Data String: ${httpMethod}${FIXED_CONFIG.ID}${timestamp}`);
  console.log(`   API Key: ${FIXED_CONFIG.API_KEY.substring(0, 8)}... (Fixed)`);
};
