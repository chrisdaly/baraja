# Fix Amplify Deployment - Add Supabase Environment Variables

## Problem
Your live Amplify app shows: `⚠️ Supabase not configured, using mock data`

This is because the Supabase environment variables are missing from Amplify.

## Solution

### Step 1: Get Your Supabase Credentials

Open your local `.env` file:
```bash
cat /Users/chrisdaly/Github/baraja/.env
```

You need these two values:
- `VITE_SUPABASE_URL` - Your Supabase project URL (looks like: https://xxxxx.supabase.co)
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key (long string starting with eyJ...)

### Step 2: Add to AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click on your **baraja** app
3. In the left sidebar, click **Environment variables** (under "Hosting")
4. Click **Manage variables** button
5. Add two variables:

   | Variable | Value |
   |----------|-------|
   | `VITE_SUPABASE_URL` | Paste your URL from .env |
   | `VITE_SUPABASE_ANON_KEY` | Paste your key from .env |

6. Click **Save**

### Step 3: Redeploy

After saving environment variables, Amplify will automatically trigger a new build. If not:

1. Go to the app overview page
2. Click **Redeploy this version** on the latest build
3. Wait for build to complete (~2-3 minutes)

### Step 4: Verify the Fix

1. Open your live app URL
2. Open browser DevTools (F12) → Console tab
3. You should now see:
   - ✅ `📚 SRS loaded: X cards due` (instead of "Supabase not configured")
   - ✅ No "using mock data" warnings
4. Try reviewing a card - it should progress to the next card!

## Alternative: Using Amplify CLI

If you have Amplify CLI installed:

```bash
amplify env pull
amplify env add-vars VITE_SUPABASE_URL VITE_SUPABASE_ANON_KEY
amplify push
```

## Troubleshooting

**If you still see "Supabase not configured" after redeploying:**
- Check that variable names are EXACTLY: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (case-sensitive)
- Verify the build completed successfully in Amplify
- Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+F5)
- Check for typos in the values

**If you see RPC errors after fixing:**
- Run the `fix-stuck-app.sql` in Supabase SQL Editor
- This will fix any database permission issues
