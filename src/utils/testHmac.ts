// Test utility for HMAC Authentication
// This can be used to verify the authentication is working correctly

import { generateTimestamp, generateHMAC, generateAuthHeaders, logAuthDetails } from './hmacAuth';

// Test function to verify HMAC generation
export const testHMACGeneration = async () => {
  console.log('🧪 Testing HMAC Authentication Generation...');
  console.log('==========================================');
  
  const timestamp = generateTimestamp();
  console.log(`📅 Generated Timestamp: ${timestamp}`);
  
  // Test all HTTP methods
  const methods: Array<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'> = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  
  for (const method of methods) {
    console.log(`\n🔐 Testing ${method} method:`);
    await logAuthDetails(method);
    
    const headers = await generateAuthHeaders(method);
    console.log(`   Headers generated:`, headers);
  }
  
  console.log('\n✅ HMAC Authentication test completed!');
};

// Function to compare with DevOps team's JavaScript output
export const compareWithDevOpsOutput = async () => {
  console.log('🔍 Comparing with DevOps team output...');
  
  // This should match the output from the HTML file
  const timestamp = generateTimestamp();
  const id = 'SustainibilityPortal'; // Fixed ID
  const key = '0KEX8P1I7U9NJHKV1L7XHCVH6QI9XXCS'; // Current HMAC key (may change)
  
  console.log(`\n📊 Comparison Results:`);
  console.log(`   Timestamp: ${timestamp}`);
  console.log(`   Fixed ID: ${id} (will not change)`);
  console.log(`   HMAC Key: ${key} (may change per environment)`);
  
  const methods = ['GET', 'POST', 'PUT', 'DELETE'];
  for (const method of methods) {
    const dataString = `${method}${id}${timestamp}`;
    console.log(`   ${method} Data String: ${dataString}`);
    
    try {
      const hash = await generateHMAC(method, timestamp);
      console.log(`   ${method} Generated Hash: ${hash}`);
    } catch (error) {
      console.log(`   ${method} Error: ${error}`);
    }
  }
  
  console.log('\n💡 To verify:');
  console.log('   1. Open the HTML file in browser');
  console.log('   2. Click generateHash()');
  console.log('   3. Compare the output with console logs above');
  console.log('\n⚠️  Note: HMAC key may change, but ID and API key are fixed');
};

// Export for use in development
export default {
  testHMACGeneration,
  compareWithDevOpsOutput
};
