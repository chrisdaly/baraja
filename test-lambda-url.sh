#!/bin/bash

# Test Lambda Function URL for CORS and functionality

LAMBDA_URL="https://wkyu3twg5htcnt4yvzwuturjoe0xxrmh.lambda-url.us-east-1.on.aws/"

echo "🧪 Testing Lambda Function URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "URL: $LAMBDA_URL"
echo ""

# Test 1: OPTIONS (CORS Preflight)
echo "📋 Test 1: CORS Preflight (OPTIONS request)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X OPTIONS "$LAMBDA_URL" \
  -H "Origin: https://main.dznaqgrttmci3.amplifyapp.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -i -s | head -20
echo ""
echo ""

# Test 2: POST with Simple Request
echo "📋 Test 2: POST Request (Simple Test)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X POST "$LAMBDA_URL" \
  -H "Content-Type: application/json" \
  -H "Origin: https://main.dznaqgrttmci3.amplifyapp.com" \
  -d '{"model":"claude-sonnet-4-20250514","max_tokens":30,"messages":[{"role":"user","content":"Say hola in one word"}]}' \
  -i -s
echo ""
echo ""

echo "✅ Tests Complete!"
echo ""
echo "🔍 What to look for:"
echo "  ✓ OPTIONS response should have Access-Control-Allow-Origin: *"
echo "  ✓ OPTIONS response should have Access-Control-Allow-Methods: POST, OPTIONS"
echo "  ✓ POST response should have statusCode: 200"
echo "  ✓ POST response should have Access-Control-Allow-Origin: *"
echo "  ✓ POST response body should contain Claude's response"
