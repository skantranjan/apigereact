// Test utility for HMAC Authentication
// This can be used to verify the authentication is working correctly

import { generateAllHashes, generateHashOutput, logAuthDetails, generateAuthHeaders } from './hmacAuth';

// Test function to verify HMAC generation (matches DevOps HTML format)
export const testHMACGeneration = async () => {
  console.log('🧪 Testing HMAC Authentication Generation...');
  console.log('==========================================');
  
  try {
    // Generate all hashes at once (like DevOps HTML)
    const hashes = await generateAllHashes();
    
    console.log(`\n📅 Generated Timestamp: ${hashes.timestamp}`);
    console.log(`🔐 All hashes generated with SAME timestamp:`);
    console.log(`   GET: ${hashes.getHash}`);
    console.log(`   POST: ${hashes.postHash}`);
    console.log(`   PUT: ${hashes.putHash}`);
    console.log(`   DELETE: ${hashes.deleteHash}`);
    
    // Test individual method authentication
    const methods: Array<'GET' | 'POST' | 'PUT' | 'DELETE'> = ['GET', 'POST', 'PUT', 'DELETE'];
    
    for (const method of methods) {
      console.log(`\n🔐 Testing ${method} method authentication:`);
      await logAuthDetails(method);
      
      // Show the actual headers that will be sent to API
      const headers = await generateAuthHeaders(method);
      console.log(`   📤 Headers to be sent to API:`);
      console.log(`      'x-apikey': '${headers['x-apikey']}'`);
      console.log(`      'requestid': '${headers['requestid']}'`);
      console.log(`      'timestamp': '${headers['timestamp']}'`);
      console.log(`      'Origin': '${headers['Origin']}'`);
    }
    
    console.log('\n✅ HMAC Authentication test completed!');
    console.log('💡 All hashes use the SAME timestamp for consistency');
    
  } catch (error) {
    console.error('❌ Error during HMAC testing:', error);
  }
};

// Function to compare with DevOps team's JavaScript output
export const compareWithDevOpsOutput = async () => {
  console.log('🔍 Comparing with DevOps team output...');
  console.log('==========================================');
  
  try {
    // Generate output in exact DevOps HTML format
    const output = await generateHashOutput();
    
    console.log('\n📊 DevOps HTML Output Format:');
    console.log('----------------------------------------');
    console.log(output);
    console.log('----------------------------------------');
    
    console.log('\n💡 To verify:');
    console.log('   1. Open the HTML file in browser');
    console.log('   2. Click generateHash() button');
    console.log('   3. Compare the output above with HTML output');
    console.log('   4. Timestamps should match (or be very close)');
    console.log('   5. Hashes should be different for each method');
    
    console.log('\n⚠️  Important Notes:');
    console.log('   - Same timestamp used for all methods');
    console.log('   - Different hash for each HTTP method');
    console.log('   - API key is fixed for all requests');
    
  } catch (error) {
    console.error('❌ Error during comparison:', error);
  }
};

// Test the exact DevOps HTML functionality
export const testDevOpsFunctionality = async () => {
  console.log('🚀 Testing DevOps HTML Functionality...');
  console.log('==========================================');
  
  try {
    // This simulates the exact generateHash() function from HTML
    const hashes = await generateAllHashes();
    
    console.log('\n📋 Simulating DevOps HTML generateHash() function:');
    console.log(`Timestamp: ${hashes.timestamp}`);
    console.log(`hmacstringfor Get: ${hashes.getHash}`);
    console.log(`hmacstringfor Post: ${hashes.postHash}`);
    console.log(`hmacstringfor Put: ${hashes.putHash}`);
    console.log(`hmacstringfor Delete: ${hashes.deleteHash}`);
    
    console.log('\n✅ DevOps functionality test completed!');
    console.log('🎯 This output should match your HTML file exactly');
    
  } catch (error) {
    console.error('❌ Error during DevOps functionality test:', error);
  }
};

// NEW: Show complete API headers for each method
export const showAPIHeaders = async () => {
  console.log('📤 Showing Complete API Headers...');
  console.log('==========================================');
  
  try {
    const methods: Array<'GET' | 'POST' | 'PUT' | 'DELETE'> = ['GET', 'POST', 'PUT', 'DELETE'];
    
    for (const method of methods) {
      console.log(`\n🔐 ${method} Request Headers:`);
      console.log('----------------------------------------');
      
      const headers = await generateAuthHeaders(method);
      
      // Show headers in the exact format you requested
      console.log(`'x-apikey': '${headers['x-apikey']}'`);
      console.log(`'requestid': '${headers['requestid']}'`);
      console.log(`'timestamp': '${headers['timestamp']}'`);
      console.log(`'Origin': '${headers['Origin']}'`);
      
      if (headers['Content-Type']) {
        console.log(`'Content-Type': '${headers['Content-Type']}'`);
      }
      
      console.log('----------------------------------------');
    }
    
    console.log('\n✅ API Headers display completed!');
    console.log('💡 These are the exact headers sent to Haleon API');
    
  } catch (error) {
    console.error('❌ Error showing API headers:', error);
  }
};

// Export for use in development
export default {
  testHMACGeneration,
  compareWithDevOpsOutput,
  testDevOpsFunctionality,
  showAPIHeaders
};
