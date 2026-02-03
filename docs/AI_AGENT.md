# AI Agent Integration - Agentic Platform Feature

## Overview

The Agentic Fiscal Policy Intelligence Platform now includes an AI-powered assistant that provides role-based help, technical guidance, and data analysis capabilities. The agent is fully integrated into the dashboard and can be configured to use multiple LLM providers.

## Features

### 🤖 AI Chat Interface
- **Floating Bot Button**: Always accessible in bottom-right corner
- **Modal Chat Interface**: Full-screen chat experience
- **Message History**: Conversation persistence within session
- **Typing Indicators**: Visual feedback during AI responses
- **Responsive Design**: Works on mobile and desktop

### 👥 Role-Based Agents

#### 1. **Researcher** 🔬
**Purpose**: Data analysis and research assistance

**Access Level**:
- Dashboard (/)
- Analytics (/analytics)
- Data Sources (/data-sources)
- Taxonomies (/taxonomies)
- Reports (/reports)
- Documentation (/docs)

**Capabilities**:
- Analyze economic and fiscal policy data
- Interpret data visualizations
- Answer research questions
- Explain economic indicators
- Help with taxonomy classifications
- Generate insights from datasets

**System Prompt**: Configured to focus on research methodologies, data interpretation, and economic policy analysis.

#### 2. **Developer** 💻
**Purpose**: Technical assistance and platform improvements

**Access Level**:
- **Full Platform Access** (all menus and components)
- Architecture diagrams
- Codebase structure
- Cloud components (GCP)
- Infrastructure configuration

**Capabilities**:
- Review and suggest architecture improvements
- Help with code debugging
- Optimize performance
- GCP service integration guidance
- Infrastructure as Code (Terraform)
- Database optimization
- API endpoint design
- Security best practices

**System Prompt**: Includes full tech stack details:
- Frontend: Next.js 14, React, TypeScript, Tailwind CSS
- Backend: FastAPI, Python 3.11, SQLAlchemy
- Database: MariaDB, Cloud SQL, BigQuery
- Infrastructure: GKE, Cloud Run, Terraform
- AI/ML: Vertex AI, PaLM 2, Gemini

#### 3. **Data Analyst** 📊
**Purpose**: Analytics and reporting assistance

**Access Level**:
- Dashboard (/)
- Analytics (/analytics)
- Reports (/reports)
- Data Sources (/data-sources)
- Documentation (/docs)

**Capabilities**:
- Create data visualizations
- Generate statistical analyses
- Interpret trends and patterns
- Build custom reports
- Query optimization
- Data quality assessment
- Dashboard design recommendations

**System Prompt**: Focused on analytics tools, statistical methods, and data visualization best practices.

## Supported LLM Providers

### 1. **X.AI (Grok)** - Default
- **Model**: grok-3
- **Endpoint**: https://api.x.ai/v1/chat/completions
- **Best For**: Fast responses, coding assistance
- **Configuration**: Requires X.AI API key

### 2. **OpenAI**
- **Model**: gpt-4
- **Endpoint**: https://api.openai.com/v1/chat/completions
- **Best For**: General purpose, high quality responses
- **Configuration**: Requires OpenAI API key

### 3. **Anthropic (Claude)**
- **Model**: claude-3-sonnet-20240229
- **Endpoint**: https://api.anthropic.com/v1/messages
- **Best For**: Detailed analysis, safety-focused responses
- **Configuration**: Requires Anthropic API key

### 4. **Google (Gemini)**
- **Model**: gemini-pro
- **Endpoint**: https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent
- **Best For**: Integration with GCP, multimodal capabilities
- **Configuration**: Requires Google API key

## Setup Instructions

### 1. Configure API Keys

Navigate to **Settings** → **AI Agent** tab:

1. Select your preferred LLM provider (X.AI, OpenAI, Anthropic, or Google)
2. Enter your API key for the selected provider
3. Click "Save" to store the configuration
4. API keys are stored securely in browser localStorage

### 2. Get API Keys

#### X.AI (Grok)
```
1. Visit: https://console.x.ai
2. Create account or sign in
3. Navigate to API Keys
4. Create new API key
5. Copy and paste into AFPI Settings
```

#### OpenAI
```
1. Visit: https://platform.openai.com
2. Sign in to your account
3. Go to API Keys section
4. Create new secret key
5. Copy and paste into AFPI Settings
```

#### Anthropic
```
1. Visit: https://console.anthropic.com
2. Sign in to your account
3. Navigate to API Keys
4. Create new key
5. Copy and paste into AFPI Settings
```

#### Google (Gemini)
```
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Create API key
4. Copy and paste into AFPI Settings
```

### 3. Start Using the Agent

1. **Click the Bot Icon** 🤖 in the bottom-right corner
2. **Select a Role**:
   - Researcher (for data analysis)
   - Developer (for technical help)
   - Data Analyst (for analytics)
3. **Start Chatting**: Ask questions or request assistance
4. **Change Roles**: Click the settings icon in chat to switch roles

## Use Cases

### Research Use Cases
```
User: "What are the employment trends in Q4 2025?"
Agent: Analyzes available data and provides insights

User: "Explain the relationship between inflation and GDP"
Agent: Provides economic analysis and data correlations
```

### Developer Use Cases
```
User: "How can we optimize the BigQuery queries?"
Agent: Reviews current implementation and suggests improvements

User: "What's the best way to deploy to GKE?"
Agent: Provides step-by-step deployment guide with code examples
```

### Data Analyst Use Cases
```
User: "Create a visualization comparing fiscal quarters"
Agent: Suggests chart types and provides implementation guidance

User: "Generate a summary report of tax revenue trends"
Agent: Helps structure the report and identifies key metrics
```

## Context Awareness

### Developer Role Context
```json
{
  "platform": "AFPI",
  "user": "Admin User (admin)",
  "access": "Full platform (all components)",
  "frontend": "http://localhost:3000",
  "backend": "http://localhost:8000",
  "api_docs": "http://localhost:8000/api/v1/docs",
  "database": "MariaDB (local), Cloud SQL (production)",
  "permissions": "Architecture modifications, code improvements"
}
```

### Researcher/Analyst Role Context
```json
{
  "platform": "AFPI",
  "user": "Policy Analyst (analyst)",
  "access": "Analytics, Data Sources, Reports",
  "permissions": "Read data, generate insights, create reports"
}
```

## Security Considerations

### API Key Storage
- ✅ Stored in browser localStorage
- ✅ Not transmitted to backend
- ✅ Per-user configuration
- ⚠️ **Production**: Should use secure backend storage
- ⚠️ **Production**: Implement encryption at rest

### Role-Based Access
- Each role has limited context based on user permissions
- Developer role only available to users with appropriate access
- System prompts prevent unauthorized actions

### Best Practices
1. **Never share API keys** in chat messages
2. **Rotate keys regularly** (monthly recommended)
3. **Use separate keys** for development and production
4. **Monitor usage** through provider dashboards
5. **Set spending limits** on provider accounts

## Technical Architecture

### Components

```
frontend/src/
├── contexts/
│   └── agent-context.tsx       # LLM configuration state
├── components/
│   └── ai/
│       ├── ai-floating-button.tsx   # Bot button
│       └── ai-chat-modal.tsx        # Chat interface
└── app/
    └── settings/
        └── page.tsx            # AI Agent configuration
```

### State Management

**AgentContext** provides:
- `llmConfig`: Current provider and API keys
- `currentRole`: Active agent role
- `updateLLMConfig()`: Update configuration
- `setApiKey()`: Save API key for provider
- `setCurrentRole()`: Switch agent role

### API Integration Flow

```
1. User sends message
2. Modal retrieves current role and provider
3. Builds context based on role permissions
4. Calls appropriate LLM API with:
   - System prompt (role-specific)
   - User context (permissions, current view)
   - User message
5. Receives and displays response
6. Maintains conversation history
```

## Future Enhancements

### Planned Features
- [ ] **Voice Input**: Speech-to-text for queries
- [ ] **Code Execution**: Developer role can run commands
- [ ] **Data Visualization**: Generate charts inline
- [ ] **Multi-turn Reasoning**: Complex query breakdown
- [ ] **Knowledge Base**: RAG with platform documentation
- [ ] **Suggested Actions**: Button-based quick actions
- [ ] **Export Conversations**: Save chat history
- [ ] **Collaborative Agents**: Multiple roles in one chat

### Integration Opportunities
- **Vertex AI**: Direct GCP integration
- **Function Calling**: Execute platform actions
- **BigQuery Access**: Direct database queries
- **Cloud Functions**: Trigger workflows
- **Monitoring Integration**: Real-time alerts

## Troubleshooting

### Common Issues

**Agent not responding**:
- Check API key is configured correctly
- Verify internet connection
- Check provider status page
- Look for errors in browser console

**"API key not configured" error**:
- Go to Settings → AI Agent
- Select provider and enter API key
- Click "Save" button

**Slow responses**:
- Large context may slow responses
- Try switching to faster provider (X.AI)
- Check API rate limits

**Invalid or expired key**:
- Generate new API key from provider
- Update in Settings → AI Agent
- Test with simple query

## Cost Considerations

### Estimated Costs (Monthly)

**Light Usage** (100 queries/month):
- X.AI: ~$2-5
- OpenAI GPT-4: ~$5-10
- Anthropic Claude: ~$5-8
- Google Gemini: ~$3-6

**Medium Usage** (500 queries/month):
- X.AI: ~$10-20
- OpenAI GPT-4: ~$25-40
- Anthropic Claude: ~$20-35
- Google Gemini: ~$15-25

**Heavy Usage** (2000+ queries/month):
- Consider enterprise plans
- Set up usage monitoring
- Implement rate limiting

## Support

For issues or questions:
1. Check Settings → AI Agent for configuration
2. Review API provider documentation
3. Check browser console for errors
4. Contact platform administrators

---

**Version**: 1.0.0  
**Last Updated**: January 30, 2026  
**Status**: Production Ready
