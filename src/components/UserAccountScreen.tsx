import React, { useState, useRef } from 'react';
import { UserProfile, FinanceItem } from '../types/finance';
import { storageService } from '../services/storageService';
import {
  ShieldCheck,
  Mail,
  Home,
  LogOut,
  Download,
  RotateCcw,
  FileSpreadsheet,
  Upload,
  Eye,
  Database,
  Cloud,
  ExternalLink,
  RefreshCw,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface UserAccountScreenProps {
  user: UserProfile;
  items: FinanceItem[];
  categoriesCount: number;
  isDriveConnected: boolean;
  isDriveSyncing: boolean;
  driveFolderUrl?: string;
  driveItemsFileId?: string;
  driveCategoriesFileId?: string;
  lastDriveSync?: string;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onLogout: () => void;
  onExportBackup: () => void;
  onViewCSV: (type: 'items' | 'categories') => void;
  onDownloadCSV: (type: 'items' | 'categories') => void;
  onImportCSVFile: (type: 'items' | 'categories', file: File) => void;
  onConnectDrive: () => void;
  onLoadFromDrive: () => void;
  onTriggerDriveSave: () => void;
}

export const UserAccountScreen: React.FC<UserAccountScreenProps> = ({
  user,
  items,
  categoriesCount,
  isDriveConnected,
  isDriveSyncing,
  driveFolderUrl,
  driveItemsFileId,
  driveCategoriesFileId,
  lastDriveSync,
  onUpdateUser,
  onLogout,
  onExportBackup,
  onViewCSV,
  onDownloadCSV,
  onImportCSVFile,
  onConnectDrive,
  onLoadFromDrive,
  onTriggerDriveSave,
}) => {
  const [nome, setNome] = useState(user.nome);
  const [nomeFamilia, setNomeFamilia] = useState(user.nomeFamilia);
  const [papel, setPapel] = useState(user.papel);
  const [moradores, setMoradores] = useState<string[]>(user.moradores || ['Lucas Silva']);
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Hidden inputs for CSV uploads
  const itemsCsvInputRef = useRef<HTMLInputElement>(null);
  const categoriesCsvInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      nome,
      nomeFamilia,
      papel,
      moradores,
    };
    onUpdateUser(updated);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  const handleAddMorador = () => {
    const novoNome = prompt('Nome do novo morador da casa:');
    if (novoNome && novoNome.trim() && !moradores.includes(novoNome.trim())) {
      setMoradores([...moradores, novoNome.trim()]);
    }
  };

  const handleRemoveMorador = (m: string) => {
    if (moradores.length <= 1) {
      alert('A família precisa ter ao menos um responsável cadastrado.');
      return;
    }
    setMoradores(moradores.filter((item) => item !== m));
  };

  const handleFileUpload = (type: 'items' | 'categories', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onImportCSVFile(type, file);
    if (e.target) e.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Hidden file inputs for CSV import */}
      <input
        type="file"
        ref={itemsCsvInputRef}
        onChange={(e) => handleFileUpload('items', e)}
        accept=".csv,text/csv"
        className="hidden"
      />
      <input
        type="file"
        ref={categoriesCsvInputRef}
        onChange={(e) => handleFileUpload('categories', e)}
        accept=".csv,text/csv"
        className="hidden"
      />

      {/* Toast Alert */}
      {isSavedToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Perfil e preferências da casa atualizados com sucesso!</span>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-stone-100">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.nome}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-50"
              />
              {user.provider === 'google' && (
                <span className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-xs border border-stone-200" title="Autenticado com o Google">
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

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                  {user.nome}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  {user.papel}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                <Home className="w-3.5 h-3.5 text-stone-400" />
                <span>{user.nomeFamilia} · Conectado desde {user.conectadoDesde}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="self-start sm:self-auto px-4 py-2 border border-stone-200 hover:border-rose-200 hover:bg-rose-50 text-stone-600 hover:text-rose-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Desconectar Conta</span>
          </button>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSaveProfile} className="pt-6 space-y-4">
          <h3 className="text-sm font-bold text-stone-900 mb-2">
            Informações do Usuário e Moradia
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nome do Responsável
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nome da Moradia / Família
              </label>
              <input
                type="text"
                value={nomeFamilia}
                onChange={(e) => setNomeFamilia(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-stone-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Papel / Função no Lar
            </label>
            <input
              type="text"
              value={papel}
              onChange={(e) => setPapel(e.target.value)}
              placeholder="Ex: Administrador do Lar, Cônjuge, Morador"
              className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-stone-800"
            />
          </div>

          {/* Household Members */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-700">
                Moradores e Beneficiários Cadastrados
              </label>
              <button
                type="button"
                onClick={handleAddMorador}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                + Adicionar Morador
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {moradores.map((m) => (
                <span
                  key={m}
                  className="px-3 py-1 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-800 font-medium flex items-center gap-2"
                >
                  <span>{m}</span>
                  {moradores.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMorador(m)}
                      className="text-stone-400 hover:text-rose-600 cursor-pointer text-xs"
                      title="Remover morador"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#1b5e3a] hover:bg-[#154a2e] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>

      {/* GOOGLE DRIVE INTEGRATION SECTION (Requested Google Drive Access) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center shrink-0">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900 tracking-tight">
                  Google Drive - Banco de Dados em Nuvem
                </h3>
                {isDriveConnected ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    Conectado
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                    Desconectado
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Os arquivos CSV são lidos e gravados diretamente no seu Google Drive com sua permissão.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isDriveConnected ? (
              <button
                type="button"
                onClick={onConnectDrive}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Cloud className="w-4 h-4" />
                <span>Conectar Google Drive</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onLoadFromDrive}
                  disabled={isDriveSyncing}
                  className="px-3.5 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Ler arquivos mais recentes diretamente do Google Drive"
                >
                  {isDriveSyncing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
                  ) : (
                    <Download className="w-3.5 h-3.5 text-stone-500" />
                  )}
                  <span>Ler do Drive</span>
                </button>

                <button
                  type="button"
                  onClick={onTriggerDriveSave}
                  disabled={isDriveSyncing}
                  className="px-4 py-2 bg-[#1b5e3a] hover:bg-[#154a2e] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  title="Gravar as tabelas atuais no Google Drive"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Gravar no Drive</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Drive File Links & Status Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl">
            <span className="text-[11px] font-semibold text-stone-400 block mb-1">
              Pasta no Google Drive
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5 truncate">
                <FolderOpen className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="truncate">FinanceControl</span>
              </span>
              {driveFolderUrl && (
                <a
                  href={driveFolderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-sky-600 hover:text-sky-800"
                  title="Abrir pasta no Google Drive"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl">
            <span className="text-[11px] font-semibold text-stone-400 block mb-1">
              Arquivo items.csv no Drive
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5 font-mono truncate">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>items.csv</span>
              </span>
              {driveItemsFileId ? (
                <a
                  href={`https://drive.google.com/file/d/${driveItemsFileId}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-sky-600 hover:text-sky-800"
                  title="Abrir items.csv no Google Drive"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-[10px] text-stone-400">Sincronização pendente</span>
              )}
            </div>
          </div>

          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl">
            <span className="text-[11px] font-semibold text-stone-400 block mb-1">
              Arquivo categories.csv no Drive
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5 font-mono truncate">
                <FileSpreadsheet className="w-4 h-4 text-amber-700 shrink-0" />
                <span>categories.csv</span>
              </span>
              {driveCategoriesFileId ? (
                <a
                  href={`https://drive.google.com/file/d/${driveCategoriesFileId}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-sky-600 hover:text-sky-800"
                  title="Abrir categories.csv no Google Drive"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-[10px] text-stone-400">Sincronização pendente</span>
              )}
            </div>
          </div>

        </div>

        {lastDriveSync && (
          <div className="text-[11px] text-stone-500 flex items-center gap-2 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Última sincronização com Google Drive realizada em: <strong>{new Date(lastDriveSync).toLocaleString('pt-BR')}</strong></span>
          </div>
        )}
      </div>

      {/* DEDICATED CSV DATABASE SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900 tracking-tight">
                  Tabelas CSV Locais e Servidor
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  RFC 4180
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Inspecione ou edite o conteúdo em texto puro das tabelas do sistema.
              </p>
            </div>
          </div>
        </div>

        {/* 2 CSV Tables cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          
          {/* Table 1: items.csv */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-stone-900 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  <span>items.csv</span>
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  {items.length} linhas
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Tabela principal contendo todos os ganhos, gastos e metas familiares com data, categoria e status.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-200/60">
              <button
                type="button"
                onClick={() => onViewCSV('items')}
                className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-stone-400" />
                <span>Ver / Editar CSV</span>
              </button>
              <button
                type="button"
                onClick={() => onDownloadCSV('items')}
                className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-stone-400" />
                <span>Baixar</span>
              </button>
              <button
                type="button"
                onClick={() => itemsCsvInputRef.current?.click()}
                className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-stone-400" />
                <span>Upload CSV</span>
              </button>
            </div>
          </div>

          {/* Table 2: categories.csv */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-stone-900 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-amber-700" />
                  <span>categories.csv</span>
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                  {categoriesCount} linhas
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Tabela de centros de custo com cores, ícones temáticos e descrições dos orçamentos da casa.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-200/60">
              <button
                type="button"
                onClick={() => onViewCSV('categories')}
                className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-stone-400" />
                <span>Ver / Editar CSV</span>
              </button>
              <button
                type="button"
                onClick={() => onDownloadCSV('categories')}
                className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-stone-400" />
                <span>Baixar</span>
              </button>
              <button
                type="button"
                onClick={() => categoriesCsvInputRef.current?.click()}
                className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-stone-400" />
                <span>Upload CSV</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Account Preferences & Data Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
        <h3 className="text-sm font-bold text-stone-900 mb-1">
          Backup e Restauração Geral
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          Você pode baixar um pacote completo em formato JSON ou restaurar os exemplos originais do sistema a qualquer momento.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onExportBackup}
            className="px-4 py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-stone-600" />
            <span>Exportar Backup Geral (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Deseja restaurar as tabelas CSV para os exemplos originais?')) {
                storageService.resetToDefaults();
                window.location.reload();
              }
            }}
            className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-stone-500" />
            <span>Restaurar Banco CSV Original</span>
          </button>
        </div>
      </div>

    </div>
  );
};
