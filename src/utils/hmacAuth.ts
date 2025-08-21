import { getCurrentConfig, FIXED_CONFIG } from '../config/hmacConfig';

// Get current HMAC configuration
const getConfig = () => getCurrentConfig();

// Store generated hashes and timestamp
let generatedHashes: {
  timestamp: string;
  getHash: string;
  postHash: string;
  putHash: string;
  deleteHash: string;
} | null = null;

// Generate UTC timestamp in required format (exactly like DevOps HTML)
export const generateTimestamp = (): string => {
  const date = new Date();
  // Format: YYYY-MM-DDTHH:mm:ssZ (no milliseconds, no square brackets)
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
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

// Generate HMAC hash for specific data string
const generateHMACForData = async (data: string, key: string): Promise<string> => {
  try {
    const keyBuffer = stringToUint8Array(key);
    const dataBuffer = stringToUint8Array(data);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
    return arrayBufferToBase64(signature);
  } catch (error) {
    console.error('Error generating HMAC:', error);
    throw new Error('Failed to generate HMAC signature');
  }
};

// Main function: Generate all 4 hashes at once (like DevOps HTML)
export const generateAllHashes = async (): Promise<{
  timestamp: string;
  getHash: string;
  postHash: string;
  putHash: string;
  deleteHash: string;
}> => {
  // If we already have hashes, return them
  if (generatedHashes) {
    return generatedHashes;
  }

  const config = getConfig();
  const timestamp = generateTimestamp();
  const id = FIXED_CONFIG.ID;
  const key = config.KEY;

  // Validate that the HMAC key is defined
  if (!key) {
    throw new Error('HMAC key is not configured. Please check your environment variables.');
  }

  console.log('🔐 Generating all HMAC hashes...');
  console.log(`   Timestamp: ${timestamp}`);
  console.log(`   ID: ${id}`);
  console.log(`   Key: ${key.substring(0, 8)}...`);

  // Generate all 4 hashes with the same timestamp
  const [getHash, postHash, putHash, deleteHash] = await Promise.all([
    generateHMACForData(`GET${id}${timestamp}`, key),
    generateHMACForData(`POST${id}${timestamp}`, key),
    generateHMACForData(`PUT${id}${timestamp}`, key),
    generateHMACForData(`DELETE${id}${timestamp}`, key)
  ]);

  // Store the generated hashes
  generatedHashes = {
    timestamp,
    getHash,
    postHash,
    putHash,
    deleteHash
  };

  console.log('✅ All hashes generated:');
  console.log(`   GET: ${getHash}`);
  console.log(`   POST: ${postHash}`);
  console.log(`   PUT: ${putHash}`);
  console.log(`   DELETE: ${deleteHash}`);

  return generatedHashes;
};

// Get the appropriate hash for a specific HTTP method
export const getHashForMethod = async (httpMethod: string): Promise<string> => {
  const hashes = await generateAllHashes();
  
  switch (httpMethod.toUpperCase()) {
    case 'GET':
      return hashes.getHash;
    case 'POST':
      return hashes.postHash;
    case 'PUT':
      return hashes.putHash;
    case 'DELETE':
      return hashes.deleteHash;
    default:
      throw new Error(`Unsupported HTTP method: ${httpMethod}`);
  }
};

// Get the current timestamp (same for all methods)
export const getCurrentTimestamp = async (): Promise<string> => {
  const hashes = await generateAllHashes();
  return hashes.timestamp;
};

// Generate all authentication headers for a specific HTTP method
export const generateAuthHeaders = async (httpMethod: string, contentType?: string): Promise<Record<string, string>> => {
  const requestId = await getHashForMethod(httpMethod);
  const timestamp = await getCurrentTimestamp();
  
  const headers: Record<string, string> = {
    'x-apikey': FIXED_CONFIG.API_KEY, // Fixed API key for all requests
    'requestid': requestId,            // Hash based on HTTP method
    'timestamp': timestamp,            // Same timestamp for all methods
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
  const requestId = await getHashForMethod(httpMethod);
  const timestamp = await getCurrentTimestamp();
  
  console.log(`🔐 HMAC Authentication for ${httpMethod}:`);
  console.log(`   Timestamp: ${timestamp}`);
  console.log(`   Request ID: ${requestId}`);
  console.log(`   Data String: ${httpMethod}${FIXED_CONFIG.ID}${timestamp}`);
  console.log(`   API Key: ${FIXED_CONFIG.API_KEY.substring(0, 8)}... (Fixed)`);
};

// Function to match DevOps HTML output format exactly
export const generateHashOutput = async (): Promise<string> => {
  const hashes = await generateAllHashes();
  
  const output = `${hashes.timestamp}\n` +
    `hmacstringfor Get: ${hashes.getHash}\n` +
    `hmacstringfor Post: ${hashes.postHash}\n` +
    `hmacstringfor Put: ${hashes.putHash}\n` +
    `hmacstringfor Delete: ${hashes.deleteHash}`;
  
  console.log('📋 DevOps HTML Output Format:');
  console.log(output);
  
  return output;
};
