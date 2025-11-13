import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ThemeToggle from '@/app/components/ThemeToggle';
import { ThemeProvider } from '@/app/contexts/ThemeContext';

describe('ThemeToggle', () => {
  it('renders light mode button initially', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('toggles theme when clicked', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');

    // Click to toggle theme
    fireEvent.click(button);

    // Wait for theme to update
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  it('toggles back to light mode', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');

    // Toggle to dark
    fireEvent.click(button);
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    // Toggle back to light
    fireEvent.click(button);
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  it('has hover effects', () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = container.querySelector('button');
    expect(button?.className).toContain('hover:');
  });

  it('is accessible with aria attributes', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
  });
});
