// server/indexnow-submitter.js
const https = require('https');

const submitToIndexNow = (urls) => {
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
      'Content-Length': data.length
    }
  };

  console.log('📤 Submitting URLs to IndexNow...');
  console.log('URLs:', urls);

  const req = https.request(options, (res) => {
    console.log(`✅ Status: ${res.statusCode}`);
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('🎉 URLs submitted successfully to IndexNow!');
      } else {
        console.log('❌ Submission failed. Response:', responseData);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error:', error);
  });

  req.write(data);
  req.end();
};

// Export for use in Django
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { submitToIndexNow };
}

// Manual test if run directly
if (require.main === module) {
  submitToIndexNow([
    'https://www.pristineprimier.com/',
    'https://www.pristineprimier.com/buy',
    'https://www.pristineprimier.com/rent',
    'https://www.pristineprimier.com/sell',
    'https://www.pristineprimier.com/manage',
    'https://www.pristineprimier.com/about',
    'https://www.pristineprimier.com/property/houses-for-sale/',
    'https://www.pristineprimier.com/property/apartments-for-rent/'
  ]);
}