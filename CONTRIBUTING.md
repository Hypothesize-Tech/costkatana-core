# Contributing to CostKatana Core

Thank you for your interest in contributing to CostKatana Core! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/Hypothesize-Tech/costkatana-core.git
cd costkatana-core

# Install dependencies
npm install

# Build the project
npm run build
```

## Code Quality Standards

### Linting and Formatting

We use ESLint and Prettier to maintain code quality and consistency. **All commits must pass linting checks.**

#### Pre-commit Hooks
The project uses Husky and lint-staged to automatically:
- Run ESLint with auto-fix on staged TypeScript files
- Format code with Prettier
- Run tests before commits

This happens automatically when you commit. If linting errors are found, the commit will be blocked.

#### Manual Linting

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting (used in CI)
npm run ci:format
```

#### ESLint Configuration

Our ESLint setup:
- **Errors**: Will fail builds and block commits
  - Unused variables (except prefixed with `_`)
  - Formatting issues
  - Console statements (except `console.warn`, `console.error`, `console.info`)
  
- **Warnings**: Won't block builds but should be addressed
  - Usage of `any` types (prefer proper typing)
  - Unsafe type operations
  - Non-null assertions

#### Current Status
- ✅ **0 errors** - All blocking issues resolved
- ⚠️ **732 warnings** - TypeScript `any` usage (being gradually improved)

### TypeScript

- Use strict TypeScript typing
- Avoid `any` types when possible (currently showing as warnings)
- Prefer interfaces over type aliases for object shapes
- Use proper type guards and assertions

## Development Workflow

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Write clear, concise code
- Follow existing code patterns
- Add tests for new features

### 3. Test Your Changes
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### 4. Lint and Format
```bash
# This happens automatically on commit, but you can run manually:
npm run lint:fix
npm run format
```

### 5. Commit Changes
```bash
git add .
git commit -m "feat: your descriptive commit message"
```

**Note**: Pre-commit hooks will automatically:
- Fix lint errors
- Format code
- Run tests

If any step fails, the commit will be blocked and you'll need to fix the issues.

### 6. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Commit Message Guidelines

Follow conventional commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

**Examples:**
```
feat(gateway): add support for Cortex optimization
fix(pricing): correct AWS Bedrock token calculation
docs(readme): update installation instructions
chore(deps): update typescript to 5.3.3
```

## Testing

### Writing Tests
- Place tests in `__tests__` directories or name them `*.test.ts`
- Aim for high coverage of new features
- Test edge cases and error scenarios

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode (for development)
npm run test:watch
```

## Continuous Integration

Our CI pipeline runs on every push and PR:

1. ✅ **Linting** - ESLint checks (must pass, no errors allowed)
2. ✅ **Formatting** - Prettier checks  
3. ✅ **Tests** - Jest test suite
4. ✅ **Build** - TypeScript compilation
5. ✅ **Coverage** - Test coverage reports

All checks must pass before merging.

## Release Process

Releases are automated via GitHub Actions:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a git tag: `git tag v2.0.9`
4. Push tag: `git push --tags`
5. GitHub Actions will automatically publish to npm

## Project Structure

```
costkatana-core/
├── src/
│   ├── index.ts           # Main entry point
│   ├── gateway/           # Gateway client
│   ├── providers/         # AI provider implementations
│   ├── trace/             # Tracing and monitoring
│   ├── types/             # TypeScript type definitions
│   ├── config/            # Configuration and pricing
│   ├── optimizers/        # Cost optimization logic
│   └── utils/             # Utility functions
├── tests/                 # Test files
├── .husky/                # Git hooks
├── .github/workflows/     # CI/CD pipelines
└── dist/                  # Build output (generated)
```

## Getting Help

- 📖 [README](./README.md) - Project overview and usage
- 🐛 [Issues](https://github.com/Hypothesize-Tech/costkatana-core/issues) - Report bugs or request features
- 💬 [Discussions](https://github.com/Hypothesize-Tech/costkatana-core/discussions) - Ask questions

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

