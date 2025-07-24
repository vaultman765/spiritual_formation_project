import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Navbar from '@/components/common/Navbar';
import { useAuth } from '@/context/authContext';

jest.mock('@/context/authContext', () => ({
  useAuth: jest.fn(),
}));

describe('Navbar', () => {
  it('renders navigation links', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, logout: jest.fn() });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText('My Journey')).toBeInTheDocument();
    expect(screen.getByText('How to Pray')).toBeInTheDocument();
    expect(screen.getByText('My Notes')).toBeInTheDocument();
  });

  it('renders user links when logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { username: 'testuser' },
      logout: jest.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Welcome, testuser')).toBeInTheDocument();
    expect(screen.getByLabelText('Logout')).toBeInTheDocument();
  });

  it('renders auth links when logged out', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, logout: jest.fn() });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Register')).toBeInTheDocument();
  });

  it('calls logout function when logout button is clicked', () => {
    const mockLogout = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      user: { username: 'testuser' },
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logoutButton = screen.getByLabelText('Logout');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

   it('shows an alert if logout fails', async () => {
    const mockLogout = jest.fn().mockRejectedValue(new Error('Logout failed'));
    global.alert = jest.fn(); // Mock alert function
    (useAuth as jest.Mock).mockReturnValue({
      user: { username: 'testuser' },
      logout: mockLogout,
    });
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logoutButton = await screen.findByLabelText('Logout');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
    await screen.findByLabelText('Logout'); // Ensure re-render if needed
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Failed to log out. Please try again.');
    });
  });
});