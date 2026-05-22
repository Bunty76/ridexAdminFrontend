import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import tripReducer from '../store/slices/tripSlice';
import driverReducer from '../store/slices/driverSlice';
import authReducer from '../store/slices/authSlice';
import Trips from '../pages/Trips';
import { BrowserRouter } from 'react-router-dom';

const renderWithProviders = (ui, { initialState } = {}) => {
  const store = configureStore({
    reducer: { 
      trips: tripReducer,
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

describe('Trips Page', () => {
  const mockInitialState = {
    auth: { token: 'mock_token', isAuthenticated: true, user: { name: 'Admin' } }
  };

  it('loads and displays trips table', async () => {
    renderWithProviders(<Trips />, { initialState: mockInitialState });
    
    expect(screen.getByRole('heading', { name: /Trips/i, level: 2 })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
  });

  it('opens dispatch trip modal on button click', async () => {
    renderWithProviders(<Trips />, { initialState: mockInitialState });
    
    const dispatchBtn = screen.getByRole('button', { name: /Dispatch Trip/i });
    fireEvent.click(dispatchBtn);

    expect(screen.getByText(/Create New Trip/i)).toBeInTheDocument();
  });
});
