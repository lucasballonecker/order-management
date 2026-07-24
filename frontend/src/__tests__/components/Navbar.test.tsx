import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';

const mockLogout = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { email: 'user@email.com', role: 'USER' },
    isAuthenticated: true,
    logout: mockLogout,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o título do sistema', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Order Management')).toBeInTheDocument();
  });

  it('deve chamar logout() ao clicar no botão "Sair"', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /sair/i });
    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('deve chamar navigate("/login") após logout', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /sair/i });
    await user.click(logoutButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});

