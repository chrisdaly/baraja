// Test Lambda Function URL from Browser Console
// 1. Open any webpage (or your Amplify site)
// 2. Open DevTools Console (F12)
// 3. Copy and paste this entire script
// 4. Press Enter

const LAMBDA_URL = 'https://wkyu3twg5htcnt4yvzwuturjoe0xxrmh.lambda-url.us-east-1.on.aws/';

console.log('🧪 Testing Lambda Function URL...');
console.log('URL:', LAMBDA_URL);

fetch(LAMBDA_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 30,
    messages: [
      { role: 'user', content: 'Say hola' }
    ]
  })
})
.then(response => {
  console.log('✅ Response Status:', response.status);
  console.log('📋 Response Headers:');
  console.log('  Access-Control-Allow-Origin:', response.headers.get('access-control-allow-origin'));
  console.log('  Content-Type:', response.headers.get('content-type'));
  return response.json();
})
.then(data => {
  console.log('✅ Response Data:', data);
  if (data.content && data.content[0]) {
    console.log('🎉 Claude said:', data.content[0].text);
  }
})
.catch(error => {
  console.error('❌ Error:', error);
  console.error('This might be a CORS issue if you see "CORS policy" in the error');
});
