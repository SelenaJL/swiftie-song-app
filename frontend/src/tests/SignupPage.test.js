// frontend/src/tests/SignupPage.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SignupPage from '../components/SignupPage';
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

describe('SignupPage', () => {
  beforeEach(() => {
    axios.post.mockReset();
    mockedUsedNavigate.mockReset();
    localStorageMock.setItem.mockReset();
  });

  test('renders signup form', () => {
    render(
      <Router>
        <SignupPage />
      </Router>
    );
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  test('handles successful signup and automatic login', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'User created successfully' } });
    axios.post.mockResolvedValueOnce({ data: { token: 'mock_token', user: { id: 1, email: 'test@example.com' } } });

    render(
      <Router>
        <SignupPage />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(2);
    });

    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_BASE_URL}/register`,
      {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        password_confirmation: 'password',
      }
    );
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_BASE_URL}/login`,
      { email: 'test@example.com', password: 'password' }
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock_token');
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/albums/1');
    expect(screen.getByText('User created successfully')).toBeInTheDocument();
  });

  test('displays error on failed signup', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { errors: ['Email has already been taken'] } },
    });

    render(
      <Router>
        <SignupPage />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText('Email has already been taken')).toBeInTheDocument();
    });
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });
});