// frontend/src/tests/LoginPage.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from '../components/LoginPage';
import axios from 'axios';

jest.mock('axios');

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const localStorageMock = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('LoginPage', () => {
  beforeEach(() => {
    axios.post.mockReset();
    mockedUsedNavigate.mockReset();
    localStorageMock.setItem.mockReset();
  });

  test('renders login form', () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    axios.post.mockResolvedValueOnce({
      data: { token: 'mock_token', user: { id: 1, email: 'test@example.com' } },
    });

    render(
      <Router>
        <LoginPage />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_BASE_URL}/login`,
        { email: 'test@example.com', password: 'password' }
      );
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock_token');
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/albums/1');
  });

  test('displays error on failed login', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: 'Invalid credentials' } },
    });

    render(
      <Router>
        <LoginPage />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });
});