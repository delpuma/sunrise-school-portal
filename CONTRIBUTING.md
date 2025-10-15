# Contributing to Sunrise School Portal

Thank you for your interest in contributing to the Sunrise School Portal project!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/sunrise-school-portal.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit: `git commit -m "Add your feature"`
7. Push: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Set up Supabase:
   - Create a Supabase project
   - Run migrations from `supabase/migrations/`
   - Add your Supabase credentials to `.env.local`

4. Run development server:
   ```bash
   npm run dev
   ```

## Code Standards

- **TypeScript**: All new code should be TypeScript
- **Formatting**: Use Prettier (runs automatically)
- **Linting**: Fix all ESLint warnings
- **Testing**: Add tests for new features
- **Accessibility**: Ensure WCAG 2.2 AA compliance
- **Security**: Follow security best practices

## Commit Messages

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/config changes

Example: `feat: add student profile editing`

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers

## Testing

Run tests before submitting:

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Accessibility tests
npm run test:a11y
```

## Code Review

All submissions require review. We'll review:
- Code quality and style
- Test coverage
- Documentation
- Security implications
- Accessibility compliance

## Questions?

Open an issue or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the project's license.
