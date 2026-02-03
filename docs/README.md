# AFPI Documentation

This directory contains comprehensive documentation for the Agentic Fiscal Policy Intelligence Platform.

## Documentation Structure

### Getting Started
- [README.md](../README.md) - Project overview and quick start
- [QUICKSTART.md](QUICKSTART.md) - Fast setup guide for development
- [BUILD_SUMMARY.md](BUILD_SUMMARY.md) - Build system documentation

### Architecture & Design
- [SCALING_ARCHITECTURE.md](SCALING_ARCHITECTURE.md) - Scaling strategy from Cloud Run to GKE+GPU
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment procedures and infrastructure
- [AUTHENTICATION.md](AUTHENTICATION.md) - Authentication and authorization system

### Platform Features
- [AI_AGENT.md](AI_AGENT.md) - AI Platform Assistant documentation
  - Role-based agents (Researcher, Developer, Data Analyst)
  - Multi-LLM provider support (X.AI, OpenAI, Anthropic, Google)
  - Configuration and usage guide

### Production
- [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md) - Production deployment checklist
- [PRODUCTION.md](PRODUCTION.md) - Production configuration and operations

## Quick Links

### For Developers
1. [Quick Start Guide](QUICKSTART.md)
2. [Architecture Overview](SCALING_ARCHITECTURE.md)
3. [AI Agent Documentation](AI_AGENT.md)

### For DevOps
1. [Deployment Guide](DEPLOYMENT.md)
2. [Production Readiness](PRODUCTION_READINESS.md)
3. [Scaling Strategy](SCALING_ARCHITECTURE.md)

### For Product/Business
1. [Feature Overview](../README.md#key-features)
2. [AI Assistant Capabilities](AI_AGENT.md)
3. [Scaling & Cost Analysis](SCALING_ARCHITECTURE.md)

## Accessing Documentation in the Platform

All documentation is accessible through the **Documentation** menu in the AFPI dashboard:
- Navigate to `/docs` in the application
- Browse by category: AI Assistant, Architecture, Deployment, API Reference, User Guides

## Contributing to Documentation

When adding new documentation:
1. Place `.md` files in this `/docs` directory
2. Update this index file
3. Add links to frontend documentation page if user-facing
4. Use clear headings and code examples
5. Include diagrams for architecture documentation

## Version

Last Updated: January 30, 2026  
Version: 1.0.0
