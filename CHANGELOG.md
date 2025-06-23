# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added
- Initial release of AI Cost Tracker
- Multi-provider support (OpenAI, AWS Bedrock, Anthropic, Google, Cohere)
- Real-time cost estimation before API calls
- Automatic usage tracking with configurable storage options
- AI-powered prompt optimization using AWS Bedrock
- Comprehensive usage analytics and reporting
- Cost alerts with configurable thresholds
- Export functionality (JSON, CSV)
- Token counting utilities
- Batching and caching suggestions
- Model comparison and downgrade recommendations
- Custom pricing support
- TypeScript support with full type definitions
- Extensive documentation and examples

### Features
- **Providers**: OpenAI, AWS Bedrock, Anthropic, Google, Cohere
- **Storage Options**: Memory, File, Custom implementations
- **Optimization**: Prompt optimization, model suggestions, batching, caching
- **Analytics**: Usage over time, cost by provider, top expensive prompts
- **Alerts**: Cost and token threshold monitoring
- **Export**: JSON and CSV formats

### Security
- No API keys logged or transmitted
- Configurable data retention policies
- Support for custom secure storage

## [Unreleased]

### Planned
- Additional provider support (Azure OpenAI, Hugging Face)
- GraphQL API for analytics
- Web dashboard interface
- Slack and Discord integrations
- Advanced caching strategies
- Team collaboration features
- Budget management tools
- API rate limit handling
- Streaming support optimization
- Plugin system for extensibility