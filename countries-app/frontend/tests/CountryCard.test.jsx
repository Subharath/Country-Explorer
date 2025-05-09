import { render, screen } from '@testing-library/react';
import { AuthContext } from '../src/context/AuthContext';
import CountryCard from '../src/components/CountryCard';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock window.alert
window.alert = vi.fn();

const mockCountry = {
  cca3: 'USA',
  name: { common: 'United States' },
  capital: ['Washington, D.C.'],
  population: 331000000,
  region: 'Americas',
  flags: { png: 'https://flagcdn.com/us.png' },
};

const mockUser = { userId: '123', token: 'mock-token' };

describe('CountryCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders country details correctly', () => {
    render(
      <BrowserRouter>
        <CountryCard country={mockCountry} />
      </BrowserRouter>
    );

    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Capital: Washington, D.C.')).toBeInTheDocument();
    expect(screen.getByText('Population: 331,000,000')).toBeInTheDocument();
    expect(screen.getByText('Region: Americas')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'United States' })).toHaveAttribute('src', mockCountry.flags.png);
  });

  it('shows favorite button for logged-in user', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user: mockUser }}>
          <CountryCard country={mockCountry} />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Favorite')).toBeInTheDocument();
  });

  it('does not show favorite button for logged-out user', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user: null }}>
          <CountryCard country={mockCountry} />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.queryByText('Favorite')).not.toBeInTheDocument();
  });
});
