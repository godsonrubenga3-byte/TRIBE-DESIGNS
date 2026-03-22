import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, User, Phone } from 'lucide-react';
import { useApp } from '../App';
import { createClient } from '../src/utils/supabase/client';
import { supabaseService } from '../services/supabaseService';

const supabase = createClient();

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, updateUser } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signupError) throw signupError;
      
      if (data.user) {
        // Create profile in Supabase database
        await supabaseService.saveProfile({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
          avatar: '',
          address: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: 'India'
          }
        });
      }

      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  if (session) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-zinc-900 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-syne font-black uppercase tracking-tighter mb-4 bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent">
            JOIN TRIBE
          </h1>
          <p className="text-zinc-300 font-medium text-lg max-w-sm mx-auto">
            Create your account. Unlock custom designs & 54 Street.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          {error && (
            <div className="text-red-400 text-sm font-bold uppercase tracking-widest bg-red-500/10 p-4 rounded-xl border border-red-500/30">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-300">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-zinc-800/50 border border-zinc-600/50 rounded-2xl pl-12 pr-4 py-4 text-white font-bold placeholder-zinc-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="Kwame Nkrumah"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-zinc-800/50 border border-zinc-600/50 rounded-2xl pl-12 pr-4 py-4 text-white font-bold placeholder-zinc-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-300">
                Phone (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-zinc-800/50 border border-zinc-600/50 rounded-2xl pl-12 pr-4 py-4 text-white font-bold placeholder-zinc-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-zinc-800/50 border border-zinc-600/50 rounded-2xl pl-12 pr-4 py-4 text-white font-bold placeholder-zinc-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-300">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-zinc-800/50 border border-zinc-600/50 rounded-2xl pl-12 pr-4 py-4 text-white font-bold placeholder-zinc-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-xl flex items-center justify-center gap-3 transition-all shadow-2xl ${
              loading
                ? 'bg-zinc-600 text-zinc-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-amber-500 hover:text-black hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account <ArrowRight size={20} />
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-zinc-300 text-sm">
              Already a member?{' '}
              <Link to="/login" className="font-black text-white hover:text-amber-400 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-zinc-400 uppercase tracking-widest font-black">
          By joining, you agree to our Terms & Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

