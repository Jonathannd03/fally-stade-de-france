import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import PrototypeBanner from '@/app/components/PrototypeBanner';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const messages = {
  prototypeBanner: {
    title: '⚠️ Test Prototype - Not Official',
    description: 'This is a test prototype application.',
    dismiss: 'Dismiss',
  },
};

describe('PrototypeBanner', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('renders the banner when not dismissed', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <PrototypeBanner />
      </NextIntlClientProvider>
    );

    expect(screen.getByText(/Test Prototype - Not Official/i)).toBeInTheDocument();
    expect(screen.getByText(/This is a test prototype application/i)).toBeInTheDocument();
  });

  it('does not render when previously dismissed', () => {
    localStorageMock.getItem.mockReturnValue('true');

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <PrototypeBanner />
      </NextIntlClientProvider>
    );

    expect(screen.queryByText(/Test Prototype - Not Official/i)).not.toBeInTheDocument();
  });

  it('dismisses the banner when close button is clicked', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <PrototypeBanner />
      </NextIntlClientProvider>
    );

    const dismissButton = screen.getByLabelText('Dismiss');
    fireEvent.click(dismissButton);

    expect(localStorageMock.setItem).toHaveBeenCalledWith('prototype-banner-dismissed', 'true');
    expect(screen.queryByText(/Test Prototype - Not Official/i)).not.toBeInTheDocument();
  });

  it('has proper warning icon', () => {
    const { container } = render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <PrototypeBanner />
      </NextIntlClientProvider>
    );

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders as a centered modal with backdrop', () => {
    const { container } = render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <PrototypeBanner />
      </NextIntlClientProvider>
    );

    // Check for backdrop overlay
    const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/60');
    expect(backdrop).toBeInTheDocument();

    // Check for modal with border
    const modal = container.querySelector('.border-4.border-orange-500');
    expect(modal).toBeInTheDocument();
  });

  it('dismisses when clicking backdrop', () => {
    const { container } = render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <PrototypeBanner />
      </NextIntlClientProvider>
    );

    const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/60') as HTMLElement;
    fireEvent.click(backdrop);

    expect(localStorageMock.setItem).toHaveBeenCalledWith('prototype-banner-dismissed', 'true');
  });
});
