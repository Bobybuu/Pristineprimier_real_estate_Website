// server/indexnow-submitter.js
const https = require('https');

const submitToIndexNow = (urls) => {
  return new Promise((resolve, reject) => {
    // Validate inputs
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      reject(new Error('URL list must be a non-empty array'));
      return;
    }

    const apiKey = "9c1ca04b3551417d81709c81070429a8";
    
    const data = JSON.stringify({
      host: "www.pristineprimier.com",
      key: apiKey,
      keyLocation: `https://www.pristineprimier.com/${apiKey}.txt`,
      urlList: urls
    });

    const options = {
      hostname: 'api.indexnow.org',
      port: 443,
      path: '/IndexNow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(data)
      },
      timeout: 30000 // 30 second timeout
    };

    console.log('📤 Submitting URLs to IndexNow...');
    console.log('Number of URLs:', urls.length);
    console.log('Sample URLs:', urls.slice(0, 3));

    const req = https.request(options, (res) => {
      console.log(`✅ Status Code: ${res.statusCode}`);
      
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('🎉 URLs submitted successfully to IndexNow!');
          resolve({
            success: true,
            statusCode: res.statusCode,
            message: 'URLs submitted successfully',
            urlsCount: urls.length
          });
        } else {
          const errorMsg = `Submission failed with status ${res.statusCode}: ${responseData}`;
          console.log('❌', errorMsg);
          reject(new Error(errorMsg));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Network Error:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('❌ Request timeout');
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(data);
    req.end();
  });
};

// Export for use in Django - FIXED EXPORT
module.exports = { submitToIndexNow };

// Manual test if run directly
if (require.main === module) {
  console.log('🧪 Testing IndexNow submission...');
  submitToIndexNow([
    'https://www.pristineprimier.com/',
    'https://www.pristineprimier.com/buy',
    'https://www.pristineprimier.com/rent'
  ])
  .then(result => {
    console.log('Test completed:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });
}