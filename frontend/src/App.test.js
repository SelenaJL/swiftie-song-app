import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock AlbumPage, LoginPage, SignupPage to avoid their internal logic/API calls
jest.mock('./components/AlbumPage', () => () => <div>Album Page Mock</div>);
jest.mock('./components/LoginPage', () => () => <div>Login Page Mock</div>);
jest.mock('./components/SignupPage', () => () => <div>Signup Page Mock</div>);

describe('App Routing', () => {
  test('renders Welcome message on default route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Welcome to the Swiftie Song App!/i)).toBeInTheDocument();
  });

  test('renders LoginPage on /login route', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Login Page Mock/i)).toBeInTheDocument();
  });

  test('renders SignupPage on /signup route', () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Signup Page Mock/i)).toBeInTheDocument();
  });

  test('renders AlbumPage on /albums/:albumId route', () => {
    render(
      <MemoryRouter initialEntries={['/albums/123']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Album Page Mock/i)).toBeInTheDocument();
  });
});