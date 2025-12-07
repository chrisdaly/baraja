/**
 * AWS Lambda Function: Claude API Proxy (Final Version)
 *
 * This version does NOT add CORS headers in the code because
 * the Lambda Function URL handles CORS automatically.
 *
 * Make sure Function URL has CORS enabled with:
 * - Allow origin: *
 * - Allow headers: content-type, sec-ch-ua, sec-ch-ua-mobile, sec-ch-ua-platform, user-agent
 * - Allow methods: POST
 * - Max age: 86400
 */

export const handler = async (event) => {
  console.log('Request received');

  // Parse the request body
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON in request body' })
    };
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not configured');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' })
    };
  }

  try {
    console.log('Calling Claude API...');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: `Claude API error: ${response.status}`,
          details: errorText
        })
      };
    }

    const data = await response.json();
    console.log('Claude API success');

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error proxying Claude API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
