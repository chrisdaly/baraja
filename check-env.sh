#!/bin/bash

# Check if Supabase environment variables are configured correctly

echo "🔍 Checking Supabase Configuration..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "   Create one by copying .env.example:"
    echo "   cp .env.example .env"
    exit 1
fi

# Load .env file
source .env

# Check VITE_SUPABASE_URL
if [ -z "$VITE_SUPABASE_URL" ]; then
    echo "❌ VITE_SUPABASE_URL is not set in .env"
    HAS_ERROR=1
else
    echo "✅ VITE_SUPABASE_URL is set:"
    echo "   $VITE_SUPABASE_URL"
fi

echo ""

# Check VITE_SUPABASE_ANON_KEY
if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ VITE_SUPABASE_ANON_KEY is not set in .env"
    HAS_ERROR=1
else
    echo "✅ VITE_SUPABASE_ANON_KEY is set:"
    echo "   ${VITE_SUPABASE_ANON_KEY:0:20}... (truncated for security)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -n "$HAS_ERROR" ]; then
    echo "❌ Configuration incomplete!"
    echo ""
    echo "To fix:"
    echo "1. Open .env file"
    echo "2. Add your Supabase project URL and anon key"
    echo "3. Get them from: https://app.supabase.com/project/_/settings/api"
    exit 1
else
    echo "✅ Local configuration looks good!"
    echo ""
    echo "📋 To add these to AWS Amplify:"
    echo "1. Go to: https://console.aws.amazon.com/amplify/"
    echo "2. Click your app → Environment variables"
    echo "3. Add both variables (copy from .env)"
    echo "4. Redeploy"
    echo ""
    echo "See AMPLIFY-FIX.md for detailed instructions"
fi
