# Contributing to tududi

Thank you for your interest in contributing to tududi! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Database Changes](#database-changes)
- [Translations](#translations)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

Please be respectful and constructive in all interactions. We want to foster an inclusive and welcoming community.

## Getting Started

### Prerequisites

- Node.js (v22 or higher recommended)
- Bun
- Git

### Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/jeanbispo/tududi-mcp.git
   cd tududi-mcp
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start the development server**
   ```bash
   bun dev
   ```

## Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation changes
- `test/description` - Test additions or fixes

### Before You Start

1. **Check existing issues and discussions** to avoid duplicate work
2. **Create or comment on an issue** describing what you plan to work on
3. **Create a new branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Commands

```bash
# Start development server
bun dev
```

## Code Standards

### General Rules

- **TypeScript** for all new code
- **ESLint** is configured - run before committing:
  ```bash
  bun lint:fix
  ```
- Follow existing code style and patterns
- Write meaningful variable and function names
- Add comments for complex logic

### Security

- **Never** commit secrets, API keys, or credentials
- Validate and sanitize all user input
- Follow Model Context Protocol best practices

## Testing

### Requirements

- **Bug fixes** must include a test that would have caught the bug
- **New features** should include relevant tests

## Pull Request Process

### Before Submitting

1. **Update your branch** with latest `main`
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```

2. **Run the pre-push checks**
   ```bash
   npm run pre-push
   ```
   This runs linting, formatting, and tests.

3. **Test your changes thoroughly**
   - Manual testing in terminal using curl

### Creating the PR

1. **Push your branch**
   ```bash
   git push origin your-branch
   ```

2. **Create Pull Request** on GitHub

3. **Fill out the PR template** with:
   - Clear description of changes
   - Related issue numbers (use `Fixes #123`)
   - Testing steps
   - Screenshots (if UI changes)

4. **Wait for review** - maintainers will review and may request changes

### PR Requirements

- ✅ All tests passing
- ✅ Code follows style guidelines
- ✅ No linting errors
- ✅ Meaningful commit messages
- ✅ Documentation updated (if needed)
- ✅ Migrations included (if database changes)

## Questions?

- **General questions**: Use [GitHub Discussions](https://github.com/chrisvel/tududi/discussions)
- **Bug reports**: Create an [issue](https://github.com/jeanbispo/tududi-mcp/issues)
- **Feature requests**: Start a [discussion](https://github.com/chrisvel/tududi/discussions/categories/feature-requests)

---

Thank you for contributing to tududi! 🎉