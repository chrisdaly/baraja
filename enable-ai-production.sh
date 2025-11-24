#!/bin/bash

# Script to enable AI extraction in production
# This replaces src/lib/claude.js with the production-ready version

echo "🤖 Enabling AI Extraction for Production"
echo ""
echo "This will replace src/lib/claude.js with the production-ready version"
echo "that supports both local development AND production (with Lambda URL)."
echo ""

# Backup current file
if [ -f "src/lib/claude.js" ]; then
    echo "📦 Backing up current claude.js to claude.js.dev-only..."
    cp src/lib/claude.js src/lib/claude.js.dev-only
fi

# Replace with production version
echo "✅ Installing production-ready claude.js..."
cp src/lib/claude.production.js src/lib/claude.js

echo ""
echo "✅ Done! AI extraction is now ready for production."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Set up Lambda function (or use Railway/Render)"
echo "   See: ENABLE-AI-PRODUCTION.md for full guide"
echo ""
echo "2. Add Lambda URL to Amplify environment variables:"
echo "   - Go to Amplify Console → Environment variables"
echo "   - Add: VITE_CLAUDE_API_URL = <your-lambda-url>"
echo ""
echo "3. Commit and push:"
echo "   git add src/lib/claude.js"
echo "   git commit -m 'feat: enable AI extraction in production'"
echo "   git push"
echo ""
echo "4. Wait for Amplify to redeploy (~2-3 minutes)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "To revert back to dev-only mode:"
echo "  cp src/lib/claude.js.dev-only src/lib/claude.js"
echo ""
