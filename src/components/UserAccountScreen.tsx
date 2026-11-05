import React, { useState } from 'react';
import { UserProfile, FinanceItem } from '../types/finance';
import {
  ShieldCheck,
  User,
  Users,
  Mail,
  Home,
  Calendar,
  LogOut,
  Download,
  RotateCcw,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
} from 'lucide-react';

interface UserAccountScreenProps {
  user: UserProfile;
  items: FinanceItem[];
  onUpdateUser: (updatedUser: UserProfile) => void;
  onLogout: () => void;
  onExportBackup: () => void;
  onResetDefaults: () => void;
}

export const UserAccountScreen: React.FC<UserAccountScreenProps> = ({
  user,
  items,
  onUpdateUser,
  onLogout,
  onExportBackup,
  onResetDefaults,
}) => {
  const [nome, setNome] = useState(user.nome);
  const [nomeFamilia, setNomeFamilia] = useState(user.nomeFamilia);
  const [papel, setPapel] = useState(user.papel);
  const [novoMorador, setNovoMorador] = useState('');
  const [moradores, setMoradores] = useState<string[]>(user.moradores || ['Lucas Silva']);
  const [isSavedToast, setIsSavedToast] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      nome: nome.trim() || user.nome,
      nomeFamilia: nomeFamilia.trim() || user.nomeFamilia,
      papel: papel.trim() || user.papel,
      moradores: moradores,
    };
    onUpdateUser(updated);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleAddMorador = () => {
    if (!novoMorador.trim()) return;
    if (moradores.includes(novoMorador.trim())) return;
    setMoradores([...moradores, novoMorador.trim()]);
    setNovoMorador('');
  };

  const handleRemoveMorador = (m: string) => {
    if (moradores.length <= 1) return;
    setMoradores(moradores.filter((item) => item !== m));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Toast Alert */}
      {isSavedToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Alterações da conta salvas com sucesso no seu perfil!</span>
        </div>
      )}

      {/* Top Profile Card with Google Auth Connection Badge */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-stone-100">
          
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar with Google badge */}
            <div className="relative shrink-0">
              <img
                src={user.avatarUrl}
                alt={user.nome}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-emerald-50 shadow-xs"
              />
              {user.provider === 'google' && (
                <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-xs border border-stone-200">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                </span>
              )}
            </div>

            {/* Profile Info */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  {user.nome}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Google Conectado</span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <span>{user.email}</span>
                <span>·</span>
                <Home className="w-3.5 h-3.5 text-stone-400" />
                <span>{user.nomeFamilia}</span>
              </div>

              <p className="text-xs text-stone-400 mt-0.5">
                Membro desde {user.conectadoDesde} · {user.papel}
              </p>
            </div>
          </div>

          {/* Sair / Logout */}
          <button
            onClick={onLogout}
            className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Desconectar Conta</span>
          </button>

        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
          <h3 className="text-sm font-bold text-stone-900">
            Dados do Perfil e da Família
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Seu Nome
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Nome da Casa / Família
              </label>
              <input
                type="text"
                value={nomeFamilia}
                onChange={(e) => setNomeFamilia(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Seu Papel no Lar
              </label>
              <input
                type="text"
                value={papel}
                onChange={(e) => setPapel(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800"
              />
            </div>
          </div>

          {/* Moradores da Residência */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-stone-600 mb-1.5">
              Moradores e Membros da Casa (para atribuir responsáveis)
            </label>
            <div className="flex flex-wrap gap-2 mb-2.5">
              {moradores.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-stone-700 text-xs font-medium rounded-lg"
                >
                  <User className="w-3 h-3 text-stone-400" />
                  <span>{m}</span>
                  {moradores.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMorador(m)}
                      className="text-stone-400 hover:text-rose-600 ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                value={novoMorador}
                onChange={(e) => setNovoMorador(e.target.value)}
                placeholder="Adicionar morador (ex: Mariana)"
                className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-stone-800"
              />
              <button
                type="button"
                onClick={handleAddMorador}
                className="px-3 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 cursor-pointer"
              >
                + Adicionar
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1b5e3a] hover:bg-[#154a2e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Salvar Dados da Conta
            </button>
          </div>
        </form>
      </div>

      {/* Account Preferences & Data Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
        <h3 className="text-sm font-bold text-stone-900 mb-1">
          Backup e Gerenciamento de Dados
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          Todas as movimentações e categorias estão armazenadas no seu navegador. Você pode baixar uma cópia de segurança a qualquer momento.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onExportBackup}
            className="px-4 py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-stone-600" />
            <span>Exportar Backup Completo (JSON)</span>
          </button>

          <button
            onClick={onResetDefaults}
            className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-stone-500" />
            <span>Restaurar Dados de Exemplo da Família</span>
          </button>
        </div>
      </div>

    </div>
  );
};
