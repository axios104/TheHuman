import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.signup({
        email: formData.email,
        full_name: formData.full_name,
        password: formData.password,
      });
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden p-4" style={{ backgroundColor: '#101012' }}>
      <div className="flex w-full max-w-md flex-col items-center justify-center space-y-8 px-4 py-12">
        
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="size-8 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">HUMAN</h2>
        </div>

        {/* Header */}
        <div className="text-center w-full">
          <h1 style={{ color: '#F5F5F5' }} className="tracking-tight text-3xl sm:text-4xl font-bold leading-tight">
            Begin Your Transformation
          </h1>
          <p style={{ color: '#888888' }} className="text-base font-normal leading-normal pt-2">
            Unlock your potential with AI-driven insights. It's free to start.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171' }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-5">
          
          {/* Name Input */}
          <label className="flex flex-col w-full">
            <p style={{ color: '#F5F5F5' }} className="text-base font-medium leading-normal pb-2">Name</p>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full rounded-lg h-12 px-4 text-base font-normal transition-all"
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                color: '#F5F5F5',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.border = '1px solid #0df2f2'}
              onBlur={(e) => e.target.style.border = '1px solid #2a2a2a'}
              placeholder="Enter your full name"
            />
          </label>

          {/* Email Input */}
          <label className="flex flex-col w-full">
            <p style={{ color: '#F5F5F5' }} className="text-base font-medium leading-normal pb-2">Email</p>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg h-12 px-4 text-base font-normal transition-all"
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                color: '#F5F5F5',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.border = '1px solid #0df2f2'}
              onBlur={(e) => e.target.style.border = '1px solid #2a2a2a'}
              placeholder="Enter your email address"
            />
          </label>

          {/* Password Input */}
          <label className="flex flex-col w-full">
            <p style={{ color: '#F5F5F5' }} className="text-base font-medium leading-normal pb-2">Password</p>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-lg h-12 px-4 text-base font-normal transition-all"
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                color: '#F5F5F5',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.border = '1px solid #0df2f2'}
              onBlur={(e) => e.target.style.border = '1px solid #2a2a2a'}
              placeholder="Create a secure password (min 6 characters)"
            />
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg h-12 px-6 text-base font-bold leading-normal transition-opacity hover:opacity-90 mt-4 disabled:opacity-50"
            style={{ backgroundColor: '#0df2f2', color: '#000000' }}
          >
            {loading ? 'Creating Account...' : 'Unlock Instant Access'}
          </button>
        </form>

        {/* Trust Badges */}
        <div className="w-full flex flex-col items-center gap-6 pt-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-4" style={{ color: '#888888' }}>
            <div className="flex items-center gap-2">
              <span className="text-xl">🔒</span>
              <span className="text-sm font-normal">256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span className="text-sm font-normal">Instant Access</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">💳</span>
              <span className="text-sm font-normal">No Credit Card Required</span>
            </div>
          </div>

          {/* Terms & Login Link */}
          <div className="text-center pt-2 space-y-3">
            <p className="text-xs" style={{ color: '#888888' }}>
              By creating an account, you agree to our{' '}
              <a className="underline hover:opacity-80 transition-opacity" style={{ color: '#F5F5F5' }} href="#">
                Terms of Service
              </a>{' '}
              and{' '}
              <a className="underline hover:opacity-80 transition-opacity" style={{ color: '#F5F5F5' }} href="#">
                Privacy Policy
              </a>.
            </p>
            <p className="text-sm" style={{ color: '#888888' }}>
              Already have an account?{' '}
              <Link to="/login" className="hover:underline font-medium" style={{ color: '#0df2f2' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;
