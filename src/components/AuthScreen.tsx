import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { UserProfile } from '../types/finance';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  // Google Sign-In Simulation
  const handleGoogleSignIn = () => {
    setIsLoadingGoogle(true);
    setTimeout(() => {
      setIsLoadingGoogle(false);
      const googleUser: UserProfile = {
        id: 'usr-google-lucas',
        nome: 'Lucas Silva',
        email: 'nkvspl@gmail.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        provider: 'google',
        nomeFamilia: 'Família Silva',
        papel: 'Administrador do Lar',
        conectadoDesde: '07/07/2023',
        moradores: ['Lucas Silva', 'Mariana Silva', 'Enzo Silva'],
      };
      onLoginSuccess(googleUser);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const customUser: UserProfile = {
      id: `usr-${Date.now()}`,
      nome: nome.trim() || email.split('@')[0] || 'Lucas Silva',
      email: email.trim(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      provider: 'email',
      nomeFamilia: 'Família Silva',
      papel: 'Membro da Família',
      conectadoDesde: new Date().toLocaleDateString('pt-BR'),
      moradores: [nome.trim() || 'Usuário'],
    };
    onLoginSuccess(customUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-stone-50 to-emerald-50/40 flex items-center justify-center p-4">
      {/* Login Card matching Screen 2 and 7 */}
      <div className="bg-white rounded-3xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 border border-stone-200 shadow-xl flex flex-col items-center">
        
        {/* Brand Logo Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandLogo size="lg" />
          <p className="text-xs text-stone-500 mt-2">
            Controle financeiro simples para toda a casa
          </p>
        </div>

        {/* Continue with Google Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoadingGoogle}
          className="w-full py-3 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-700 text-sm font-semibold flex items-center justify-center gap-3 shadow-2xs transition-all cursor-pointer hover:border-stone-400 group"
        >
          {/* Official Google G Logo */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>
            {isLoadingGoogle ? 'Conectando ao Google...' : 'Continue with Google'}
          </span>
        </button>

        {/* Divider "or" */}
        <div className="w-full flex items-center my-6">
          <div className="flex-1 border-t border-stone-200"></div>
          <span className="px-3 text-xs text-stone-400 lowercase">or</span>
          <div className="flex-1 border-t border-stone-200"></div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-3.5">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Nome completo
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Lucas Silva"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="lucas@familia.com"
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800"
            />
          </div>

          {/* Green Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 bg-[#1b5e3a] hover:bg-[#154a2e] active:bg-[#0f3621] text-white rounded-xl text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isSignUp ? 'Sign Up' : 'Sign Up / Entrar'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch mode */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-stone-500 hover:text-emerald-800 transition-colors"
          >
            {isSignUp ? (
              <span>Já possui conta? <strong className="font-semibold text-emerald-700">Entrar</strong></span>
            ) : (
              <span>Não tem conta? <strong className="font-semibold text-emerald-700">Criar agora</strong></span>
            )}
          </button>
        </div>

        {/* Fast Preview Tip */}
        <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-stone-400 flex items-center gap-1.5 text-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Clique em <strong>"Continue with Google"</strong> para acesso imediato ao painel.</span>
        </div>

      </div>
    </div>
  );
};
