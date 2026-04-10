import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock } from 'lucide-react';
import { useApp } from '../App';
import { createClient } from '../src/utils/supabase/client';

const supabase = createClient();

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useApp();
  const [formData, setFormData] = useState({ email: '', password: '' });
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
    if (!formData.email || !formData.password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  if (session) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-amber-500/20 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-syne font-black uppercase tracking-tighter mb-4 bg-gradient-to-r from-white to-zinc-200 bg-clip-text text-transparent">
            SIGN IN
          </h1>
          <p className="text-zinc-400 font-medium text-lg max-w-sm mx-auto">
            Access your account and continue shopping
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/10 dark:bg-zinc-900/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          {error && (
            <div className="text-red-400 text-sm font-bold uppercase tracking-widest bg-red-500/10 p-4 rounded-xl border border-red-500/30">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-zinc-800/50 dark:bg-zinc-900/50 border border-zinc-600/50 rounded-2xl pl-12 pr-4 py-4 text-white font-bold placeholder-zinc-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-zinc-800/50 dark:bg-zinc-900/50 border border-zinc-600/50 rounded-2xl pl-12 pr-4 py-4 text-white font-bold placeholder-zinc-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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
                : 'bg-amber-500 text-black hover:bg-white hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In <ArrowRight size={20} />
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-zinc-400 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="font-black text-white hover:text-amber-400 transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-zinc-500 uppercase tracking-widest font-black">
          © TRIBE DESIGNS. Secure login powered by you.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

