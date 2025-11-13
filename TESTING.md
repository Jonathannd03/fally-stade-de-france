# Testing Documentation

This document provides information about the testing setup and how to run tests for the Fally Ipupa Setlist Voting application.

## Testing Stack

- **Jest**: Testing framework
- **React Testing Library**: For testing React components
- **@testing-library/user-event**: For simulating user interactions
- **next/jest**: Jest configuration for Next.js applications

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

```
__tests__/
├── components/          # Component tests
│   ├── PrototypeBanner.test.tsx
│   └── ThemeToggle.test.tsx
├── lib/                 # Utility function tests
│   └── deezer.test.ts
└── api/                 # API route tests
    ├── admin-login.test.ts
    └── votes.test.ts
```

## Test Coverage

### Components

**PrototypeBanner Component**
- Renders banner when not dismissed
- Hides when previously dismissed
- Dismisses on button click
- Saves dismissal state to localStorage
- Displays warning icon and gradient styling

**ThemeToggle Component**
- Renders light/dark mode toggle
- Toggles theme when clicked
- Persists theme preference
- Has hover effects and accessibility attributes

### API Routes

**Votes API (`/api/votes`)**
- GET: Returns aggregated vote counts
- POST: Successfully creates new votes
- DELETE: Removes votes
- Validates required fields
- Handles database errors gracefully

**Admin Login API (`/api/admin/login`)**
- Authenticates valid credentials
- Rejects invalid username/password
- Rejects inactive admin users
- Validates required fields
- Returns user data without password hash

### Utility Functions

**Deezer API Functions (`lib/deezer.ts`)**
- `searchArtist`: Finds artist by name
- `getArtistAlbums`: Fetches artist's albums
- `getAlbumTracks`: Retrieves tracks from an album
- Handles API errors appropriately
- Returns empty arrays when no data found

## Mocking

### Global Mocks (jest.setup.js)

- **localStorage**: Mocked for banner dismissal and user ID storage
- **IntersectionObserver**: For components using scroll detection
- **matchMedia**: For theme detection and dark mode

### Per-Test Mocks

- **fetch**: For Deezer API tests
- **bcryptjs**: For password hashing in admin login tests
- **Supabase clients**: For database operations

## Writing New Tests

### Component Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import YourComponent from '@/app/components/YourComponent';

const messages = {
  // Your translations
};

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <YourComponent />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### API Route Tests

```typescript
import { GET, POST } from '@/app/api/your-route/route';
import { NextRequest } from 'next/server';

describe('Your API Route', () => {
  it('handles requests correctly', async () => {
    const request = new NextRequest('http://localhost:3000/api/your-route', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.success).toBe(true);
  });
});
```

### Utility Function Tests

```typescript
import { yourFunction } from '@/lib/your-util';

describe('yourFunction', () => {
  it('performs expected operation', () => {
    const result = yourFunction('input');
    expect(result).toBe('expected output');
  });
});
```

## Known Limitations

1. **API Route Tests**: Some Next.js-specific features may require additional mocking
2. **E2E Tests**: Currently only unit and integration tests are implemented
3. **Coverage Goals**: Aim for >80% coverage on critical paths

## Continuous Integration

Tests should be run on every pull request. Add this to your CI pipeline:

```yaml
- name: Run tests
  run: npm test -- --passWithNoTests --coverage
```

## Troubleshooting

### "Request is not defined" Error
This occurs when testing Next.js API routes. Ensure you're using proper mocks for Supabase and other external dependencies.

### "window.matchMedia is not a function"
This is fixed by the matchMedia mock in `jest.setup.js`. If you still see this, ensure the setup file is being loaded.

### Transform errors with next-intl
The jest.config.js includes `transformIgnorePatterns` to handle next-intl. If you add new ESM dependencies, add them to this pattern.

## Future Improvements

- [ ] Add E2E tests with Playwright or Cypress
- [ ] Increase coverage to 90%+ on all modules
- [ ] Add visual regression testing
- [ ] Implement snapshot testing for complex components
- [ ] Add performance benchmarks

---

Last Updated: 2024
