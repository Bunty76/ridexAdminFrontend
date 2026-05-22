import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import driverReducer from '../store/slices/driverSlice';
import authReducer from '../store/slices/authSlice';
import Drivers from '../pages/Drivers';
import { BrowserRouter } from 'react-router-dom';

const renderWithProviders = (ui, { initialState } = {}) => {
  const store = configureStore({
    reducer: { 
      drivers: driverReducer,
      auth: authReducer 
    },
    preloadedState: initialState,
  });
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe('Drivers Page', () => {
  const mockInitialState = {
    auth: { token: 'mock_token', isAuthenticated: true, user: { name: 'Admin' } }
  };

  it('loads and displays drivers list', async () => {
    renderWithProviders(<Drivers />, { initialState: mockInitialState });
    
    // Check for loading state or content
    expect(screen.getByText(/Drivers/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('shows driver status correctly', async () => {
    renderWithProviders(<Drivers />, { initialState: mockInitialState });
    
    await waitFor(() => {
      expect(screen.getByText('Approved')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });
});
