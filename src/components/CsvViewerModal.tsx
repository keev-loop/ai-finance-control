import React, { useState, useEffect } from 'react';
import { X, FileSpreadsheet, Download, Copy, Check, Save } from 'lucide-react';

interface CsvViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'items' | 'categories';
  rawCSV: string;
  onSaveCSV: (type: 'items' | 'categories', content: string) => void;
  onDownloadCSV: (type: 'items' | 'categories') => void;
}

export const CsvViewerModal: React.FC<CsvViewerModalProps> = ({
  isOpen,
  onClose,
  type,
  rawCSV,
  onSaveCSV,
  onDownloadCSV,
}) => {
  const [content, setContent] = useState(rawCSV);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setContent(rawCSV);
  }, [rawCSV, isOpen]);

  if (!isOpen) return null;

  const fileName = type === 'items' ? 'items.csv' : 'categories.csv';
  const linesCount = content.trim().split('\n').length;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveCSV(type, content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/75 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900 tracking-tight font-mono">
                  {fileName}
                </h3>
                <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  Banco de Dados CSV
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Arquivo tabular em formato RFC 4180 ({linesCount} linhas de dados gravadas)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-2.5 bg-stone-50 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <span className="text-stone-500">
            Você pode inspecionar ou editar o arquivo CSV diretamente:
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg text-stone-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>

            <button
              onClick={() => onDownloadCSV(type)}
              className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg text-stone-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-stone-400" />
              <span>Baixar Arquivo</span>
            </button>
          </div>
        </div>

        {/* Textarea Editor */}
        <div className="p-6 flex-1 overflow-y-auto">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            className="w-full h-full p-4 font-mono text-xs bg-stone-900 text-emerald-400 rounded-2xl border border-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none shadow-inner leading-relaxed selection:bg-emerald-800 selection:text-white"
            placeholder="Conteúdo do arquivo CSV..."
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-100 bg-stone-50/75 flex items-center justify-between shrink-0">
          <span className="text-xs text-stone-400">
            {saved ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Arquivo CSV gravado e atualizado no sistema!
              </span>
            ) : (
              'Altera os dados persistidos imediatamente.'
            )}
          </span>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Fechar
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-[#1b5e3a] hover:bg-[#154a2e] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Gravar no Banco CSV</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
