import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import Login from '../pages/Login';
import { BrowserRouter } from 'react-router-dom';

const renderWithProviders = (ui, { initialState } = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: initialState,
  });
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe('Authentication Flow', () => {
  it('renders login page correctly', () => {
    renderWithProviders(<Login />);
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/admin@ridex.com/i)).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    renderWithProviders(<Login />);
    
    fireEvent.change(screen.getByPlaceholderText(/admin@ridex.com/i), {
      target: { value: 'admin@ridex.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      // Since we mock jwt-decode and use localStorage, we check if it tries to redirect or store is updated
      // In a real test we'd check if useNavigate was called or state changed
      expect(localStorage.getItem('token')).toBe('mock_token');
    });
  });

  it('shows error on failed login', async () => {
    renderWithProviders(<Login />);
    
    fireEvent.change(screen.getByPlaceholderText(/admin@ridex.com/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'wrongpass' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
    });
  });
});
