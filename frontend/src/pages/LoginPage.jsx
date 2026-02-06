import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/home');
    }
  };

  // const demoCredentials = [
  //   { email: 'john@example.com', name: 'John Doe' },
  //   { email: 'jane@example.com', name: 'Jane Smith' },
  //   { email: 'mike@example.com', name: 'Mike Wilson' },
  // ];

  const fillDemoCredentials = (email) => {
    setEmail(email);
    setPassword('password123');
    toast.success('Demo credentials filled!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-slow"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-slow animation-delay-400"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-slow animation-delay-600"></div>
      </div>

      <div className="w-full max-w-md relative animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-8 h-2 bg-gradient-primary rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">LearnHub</h1>
          <p className="text-gray-600">Welcome back! Log in to continue learning</p>
        </div>

        {/* Login Card */}
        <div className="card p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="spinner border-white"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Log In</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Signup Link */}
          <Link
            to="/signup"
            className="w-full btn-secondary flex items-center justify-center space-x-2"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;