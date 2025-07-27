// frontend/src/components/SignupPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../AuthPages.css';

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/register`, {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(response.data.message || 'Registration successful!');
      // Automatically log the user in after registration
      const loginResponse = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, { email, password });
      localStorage.setItem('token', loginResponse.data.token);
      localStorage.setItem('name', response.data.user.name);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err.response || err);
      setError(err.response?.data?.errors?.join(', ') || 'Registration failed.');
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Swiftie Song Analysis</h1>
      <div className="auth-form-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="form-group">
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required />
          </div>
          <button type="submit" className="auth-button">Sign Up</button>
        </form>
        <p className="auth-link-text">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default SignupPage;