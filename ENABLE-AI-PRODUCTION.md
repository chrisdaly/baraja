# Enable AI Extraction in Production

The AI flashcard extraction feature requires a backend API to proxy requests to Claude API (to keep your API key secure and avoid CORS issues).

## Option 1: AWS Lambda Function (Recommended for Amplify)

Create a Lambda function in your AWS account and integrate it with Amplify.

### Step 1: Create Lambda Function

1. Go to [AWS Lambda Console](https://console.aws.amazon.com/lambda/)
2. Click **Create function**
3. Choose **Author from scratch**
4. Configure:
   - Function name: `baraja-claude-proxy`
   - Runtime: **Node.js 20.x**
   - Architecture: arm64 (cheaper)
   - Click **Create function**

### Step 2: Add Lambda Code

In the Lambda function code editor, replace the default code with:

```javascript
export const handler = async (event) => {
  // Parse the request body
  const body = JSON.parse(event.body || '{}');

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_API_KEY) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' })
    };
  }

  try {
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
      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: `Claude API error: ${response.status}`,
          details: errorText
        })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error proxying Claude API:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

Click **Deploy**.

### Step 3: Add Environment Variable

1. In your Lambda function, go to **Configuration** → **Environment variables**
2. Click **Edit** → **Add environment variable**
3. Add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key (starts with `sk-ant-api03-...`)
4. Click **Save**

### Step 4: Create Function URL

1. In your Lambda function, go to **Configuration** → **Function URL**
2. Click **Create function URL**
3. Choose:
   - Auth type: **NONE** (we'll handle security at the app level)
   - Configure CORS: ✅ Check this
   - Allowed origins: `*` (or your specific domain: `https://main.dznaqgrttmci3.amplifyapp.com`)
   - Allowed methods: `POST`
   - Allowed headers: `content-type`
4. Click **Save**
5. **Copy the Function URL** (looks like: `https://abc123.lambda-url.us-east-1.on.aws/`)

### Step 5: Update Your App

1. Add the Lambda URL as an environment variable in Amplify:
   - Go to Amplify Console → Your app → Environment variables
   - Add: `VITE_CLAUDE_API_URL` = your Function URL
   - Click **Save**

2. Update `src/lib/claude.js`:

```javascript
const apiUrl = import.meta.env.VITE_CLAUDE_API_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:3001/api/claude'
    : '/api/claude');
```

3. Remove the production check in `extractFlashcardsFromText`:

```javascript
export async function extractFlashcardsFromText(spanishText) {
  // Remove or comment out this check:
  // if (!import.meta.env.DEV) {
  //   throw new Error('AI extraction is only available in development mode...');
  // }

  if (!ANTHROPIC_API_KEY && !import.meta.env.VITE_CLAUDE_API_URL) {
    throw new Error('ANTHROPIC_API_KEY not configured in .env');
  }
  // ... rest of code
}
```

4. Update `isClaudeConfigured`:

```javascript
export function isClaudeConfigured() {
  return !!import.meta.env.VITE_CLAUDE_API_URL || (import.meta.env.DEV && !!ANTHROPIC_API_KEY);
}
```

5. Commit and push to trigger a redeploy

### Cost Estimate

- Lambda: ~$0.20 per 1 million requests (very cheap!)
- Claude API: See [Anthropic pricing](https://www.anthropic.com/pricing)

---

## Option 2: Use a Serverless Platform (Easier)

Deploy the proxy server to a free serverless platform:

### Railway (Recommended - Easy)

1. Go to [Railway.app](https://railway.app)
2. Sign up (free tier available)
3. Click **New Project** → **Deploy from GitHub**
4. Select your `baraja` repo
5. Add these environment variables:
   - `VITE_ANTHROPIC_API_KEY` = your API key
6. Railway will auto-deploy `server.js`
7. Copy the deployed URL (e.g., `https://baraja-production.up.railway.app`)
8. Add to Amplify environment variables:
   - `VITE_CLAUDE_API_URL` = `https://your-app.railway.app/api/claude`

### Render.com (Alternative)

Similar process:
1. Go to [Render.com](https://render.com)
2. New → Web Service → Connect your repo
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variable: `VITE_ANTHROPIC_API_KEY`

---

## Option 3: Keep it Development-Only (Current Setup)

**Pros:**
- No additional setup needed
- No hosting costs
- Secure (API key never leaves your machine)

**Cons:**
- Can't use AI extraction on live site
- Must add cards manually in production

To use:
```bash
# In one terminal
npm run server

# In another terminal
npm run dev

# OR use the combined command
npm run dev:all
```

---

## Recommendation

For your use case, I'd suggest:

1. **Personal use only?** → Option 3 (development-only) is fine
2. **Want AI in production?** → Option 2 (Railway/Render) is easiest
3. **All-in on AWS?** → Option 1 (Lambda) is most integrated

Let me know which option you'd like to implement and I can help set it up! 🚀
