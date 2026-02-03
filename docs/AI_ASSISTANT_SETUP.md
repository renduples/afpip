# AI Assistant Setup Guide

## Overview
The AFPI platform includes a powerful **site-wide AI assistant** with full access to all project files, data, and resources. The assistant is available directly in the header of the application.

## Location
**Top Header** - Next to the notifications bell icon  
Look for the button labeled "AI Assistant" with a bot icon ✨

## Quick Setup (3 Steps)

### 1. Get an API Key
Choose your preferred AI provider:

**Recommended: X.AI (Grok)**
- Visit: https://x.ai/api
- Sign up for an API key
- Free tier available, best performance for code and technical tasks

**Alternatives:**
- OpenAI (GPT-4): https://platform.openai.com/api-keys
- Anthropic (Claude): https://console.anthropic.com/
- Google (Gemini): https://ai.google.dev/

### 2. Configure in Settings
1. Click your profile icon → Settings
2. Navigate to "AI Agent" tab
3. Enter your API key in the provider section
4. Click "Save" button
5. Click "Test" to verify connection
6. ✅ You should see "Connection successful"

### 3. Start Using the Assistant
1. Click "AI Assistant" button in the top header
2. Select a role:
   - **🤖 Project Assistant** (Recommended) - Full site-wide access to everything
   - 💻 Developer Mode - Technical focus on code and infrastructure
   - 📊 Data Analyst Mode - Analytics and reporting focus
3. Start chatting!

## Features

### Full Site-Wide Access
The Project Assistant role has access to:
- ✅ All project files and codebase (frontend & backend)
- ✅ Data sources, datasets, and analytics
- ✅ Economic indicators and fiscal policy data
- ✅ Platform architecture and infrastructure
- ✅ GCP resources and deployment configurations
- ✅ User data and system configurations

### Capabilities
- Answer questions about any part of the platform
- Analyze data and generate insights
- Help with development and debugging
- Provide architectural guidance
- Assist with research and analysis
- Manage data sources and taxonomies
- Create reports and visualizations
- Review and improve code

## Tech Stack Context
The assistant is pre-configured with knowledge about:

**Frontend:**
- Next.js 14, React, TypeScript
- Tailwind CSS, Shadcn/ui components
- React Query for data fetching

**Backend:**
- FastAPI, Python 3.11
- SQLAlchemy, Pydantic
- MariaDB (dev), Cloud SQL (prod)

**Infrastructure:**
- Google Cloud Platform (Cloud Run)
- Docker containers
- Vertex AI for ML workloads

## Tips for Best Results

### 1. Be Specific
❌ "Help with the code"  
✅ "Review the authentication middleware in backend/api-gateway/app/middleware/auth.py"

### 2. Provide Context
❌ "This isn't working"  
✅ "The data source API endpoint returns 500 error when I try to create a new connection. Here's the error: [paste error]"

### 3. Ask Follow-up Questions
The assistant maintains conversation context, so you can:
- Ask for clarification
- Request code examples
- Get step-by-step instructions
- Explore alternative approaches

### 4. Use the Right Role
- **General questions, mixed tasks** → Project Assistant
- **Code review, architecture decisions** → Developer Mode
- **Data insights, report generation** → Data Analyst Mode

## Troubleshooting

### "API key not configured"
- Go to Settings → AI Agent
- Enter and save your API key
- Click "Test" to verify connection

### "Connection failed"
- Verify your API key is correct
- Check you have API credits/quota remaining
- Try a different provider
- Check your internet connection

### "I apologize, but I encountered an error"
- This usually means API rate limits or service issues
- Wait a moment and try again
- Check your API provider's status page

## API Key Security

✅ **Safe:**
- API keys are stored locally in your browser (localStorage)
- Keys are never sent to AFPI servers
- Only sent directly to your chosen AI provider

⚠️ **Best Practices:**
- Don't share your API keys
- Use API keys with spending limits
- Rotate keys periodically
- Revoke keys if compromised

## Provider Comparison

| Provider | Best For | Cost | Speed |
|----------|----------|------|-------|
| X.AI (Grok) | Code, technical tasks | $$ | Fast |
| OpenAI (GPT-4) | General purpose | $$$ | Medium |
| Anthropic (Claude) | Long conversations | $$$ | Medium |
| Google (Gemini) | Free tier | $ | Fast |

## Example Use Cases

### Development
- "Review the error handling in the data ingestion pipeline"
- "Suggest improvements to the authentication flow"
- "Help me debug this SQL query performance issue"

### Data Analysis
- "What's the trend in unemployment data over the last 5 years?"
- "Create a visualization strategy for GDP growth by sector"
- "Explain the correlation between inflation and interest rates"

### Platform Navigation
- "How do I add a new data source?"
- "Where is the user management configured?"
- "Show me how to deploy a new version"

### Architecture
- "Review the scalability of our current database setup"
- "Suggest improvements for the API caching strategy"
- "Help plan the migration from SQLite to Cloud SQL"

## Support

If you encounter issues with the AI assistant:
1. Check this guide first
2. Verify API key configuration in Settings
3. Test connection using the "Test" button
4. Try a different AI provider
5. Clear browser cache and retry

---

**Last Updated:** February 3, 2026  
**Version:** 1.0  
**Platform:** AFPI Production (afpip.com)
