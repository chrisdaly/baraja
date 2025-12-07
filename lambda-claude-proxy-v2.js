/**
 * AWS Lambda Function: Claude API Proxy (v2 - Better CORS Handling)
 *
 * This version explicitly handles CORS for all request types
 */

export const handler = async (event) => {
  console.log('Request method:', event.requestContext?.http?.method || event.httpMethod || 'UNKNOWN');
  console.log('Event:', JSON.stringify(event, null, 2));

  // CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Access-Control-Allow-Headers': 'Content-Type, sec-ch-ua, sec-ch-ua-mobile, sec-ch-ua-platform, user-agent',
    'Access-Control-Max-Age': '86400',
  };

  // Handle OPTIONS (CORS preflight) - check multiple possible locations
  const method = event.requestContext?.http?.method || event.httpMethod || event.method;

  if (method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: '',
    };
  }

  // Parse the request body
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Invalid JSON in request body' })
    };
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not configured');
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
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
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
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
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error proxying Claude API:', error);
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
