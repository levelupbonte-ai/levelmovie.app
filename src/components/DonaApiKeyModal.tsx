import React, { useState, useEffect } from 'react';
import { X, Key, Check, AlertCircle, ExternalLink, ShieldCheck, Trash2, Eye, EyeOff, Sparkles, Loader2, Plus, Zap, CheckCircle2 } from 'lucide-react';

export interface UserApiKeyItem {
  id: string;
  provider: 'gemini' | 'deepseek' | 'openai';
  key: string;
  name: string;
  model?: string;
  isActive: boolean;
  createdAt: number;
}

const VAULT_STORAGE_KEY = 'levelmovie_user_api_keys_vault_v1';

export function loadUserApiKeys(): UserApiKeyItem[] {
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    // Backward compatibility with single gemini key
    const oldKey = localStorage.getItem('levelmovie_custom_gemini_key') || localStorage.getItem('user_gemini_api_key');
    if (oldKey && oldKey.trim().length > 8) {
      const initialItem: UserApiKeyItem = {
        id: 'gemini-legacy-' + Date.now(),
        provider: 'gemini',
        key: oldKey.trim(),
        name: 'Google Gemini',
        model: 'gemini-2.5-flash',
        isActive: true,
        createdAt: Date.now(),
      };
      saveUserApiKeys([initialItem]);
      return [initialItem];
    }
  } catch (e) {
    console.warn('Error loading keys vault:', e);
  }
  return [];
}

export function saveUserApiKeys(keys: UserApiKeyItem[]): void {
  try {
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(keys));
    const active = keys.find(k => k.isActive);
    if (active) {
      localStorage.setItem('levelmovie_active_key_provider', active.provider);
      localStorage.setItem('levelmovie_active_key_value', active.key);
      localStorage.setItem('levelmovie_active_key_model', active.model || '');
      if (active.provider === 'gemini') {
        localStorage.setItem('levelmovie_custom_gemini_key', active.key);
        localStorage.setItem('user_gemini_api_key', active.key);
      }
    } else {
      localStorage.removeItem('levelmovie_active_key_provider');
      localStorage.removeItem('levelmovie_active_key_value');
      localStorage.removeItem('levelmovie_active_key_model');
      localStorage.removeItem('levelmovie_custom_gemini_key');
      localStorage.removeItem('user_gemini_api_key');
    }
    window.dispatchEvent(new Event('levelmovie_custom_key_updated'));
  } catch (e) {
    console.warn('Error saving keys vault:', e);
  }
}

interface DonaApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFr?: boolean;
  onKeysChanged?: () => void;
}

export const DonaApiKeyModal: React.FC<DonaApiKeyModalProps> = ({
  isOpen,
  onClose,
  isFr = true,
  onKeysChanged,
}) => {
  const [keysList, setKeysList] = useState<UserApiKeyItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Add Key Form state
  const [selectedProvider, setSelectedProvider] = useState<'gemini' | 'deepseek' | 'openai'>('gemini');
  const [inputKey, setInputKey] = useState('');
  const [inputName, setInputName] = useState('');
  const [showKeyText, setShowKeyText] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const loaded = loadUserApiKeys();
      setKeysList(loaded);
      if (loaded.length === 0) {
        setShowAddForm(true);
      } else {
        setShowAddForm(false);
      }
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSetActive = (id: string) => {
    const updated = keysList.map(k => ({
      ...k,
      isActive: k.id === id,
    }));
    setKeysList(updated);
    saveUserApiKeys(updated);
    if (onKeysChanged) onKeysChanged();
    setStatusMessage({
      type: 'success',
      text: isFr ? 'Clé active mise à jour !' : 'Active key updated!'
    });
  };

  const handleDeleteKey = (id: string) => {
    const remaining = keysList.filter(k => k.id !== id);
    if (remaining.length > 0 && !remaining.some(k => k.isActive)) {
      remaining[0].isActive = true;
    }
    setKeysList(remaining);
    saveUserApiKeys(remaining);
    if (onKeysChanged) onKeysChanged();
  };

  const handleValidateAndAdd = async () => {
    const cleanKey = inputKey.trim();
    if (!cleanKey || cleanKey.length < 8) {
      setStatusMessage({
        type: 'error',
        text: isFr ? 'Veuillez saisir une clé API valide.' : 'Please enter a valid API key.'
      });
      return;
    }

    setIsValidating(true);
    setStatusMessage(null);

    const defaultModel = selectedProvider === 'gemini' 
      ? 'gemini-2.5-flash' 
      : (selectedProvider === 'deepseek' ? 'deepseek-chat' : 'gpt-4o-mini');

    try {
      const resp = await fetch('/api/dona/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          apiKey: cleanKey, 
          provider: selectedProvider,
          model: defaultModel,
        }),
      });
      const data = await resp.json();

      if (data.valid) {
        const newKeyItem: UserApiKeyItem = {
          id: `${selectedProvider}-${Date.now()}`,
          provider: selectedProvider,
          key: cleanKey,
          name: inputName.trim() || (selectedProvider === 'gemini' ? 'Google Gemini' : (selectedProvider === 'deepseek' ? 'DeepSeek V3' : 'OpenAI')),
          model: data.model || defaultModel,
          isActive: true,
          createdAt: Date.now(),
        };

        // Mark previous active as false
        const updated = keysList.map(k => ({ ...k, isActive: false })).concat([newKeyItem]);
        setKeysList(updated);
        saveUserApiKeys(updated);
        if (onKeysChanged) onKeysChanged();

        setStatusMessage({
          type: 'success',
          text: isFr 
            ? `Super ! Clé ${selectedProvider.toUpperCase()} validée et activée (${data.model || defaultModel}).`
            : `Success! ${selectedProvider.toUpperCase()} key validated and activated!`
        });
        setInputKey('');
        setInputName('');
        setShowAddForm(false);
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || (isFr ? 'Clé invalide ou refusée par le fournisseur.' : 'Key invalid or rejected.')
        });
      }
    } catch (e: any) {
      setStatusMessage({
        type: 'error',
        text: e.message || (isFr ? 'Erreur de connexion au serveur.' : 'Server connection error.')
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-[#09090f] border border-white/15 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#a855f7]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 relative z-10 pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#a855f7] to-[#6366f1] flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>{isFr ? 'Gestionnaire de Clés IA' : 'AI Keys Vault'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                  {isFr ? '100% Local & Privé' : '100% Private'}
                </span>
              </h3>
              <p className="text-xs text-white/60 mt-0.5">
                {isFr ? 'Connectez vos propres clés Google Gemini, DeepSeek ou OpenAI' : 'Connect your own Google Gemini, DeepSeek, or OpenAI keys'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="mt-4 space-y-4 relative z-10 overflow-y-auto pr-1 flex-1 min-h-0">
          
          {/* Security Guarantee Banner */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-white/70 leading-relaxed">
              <strong className="text-white font-semibold">{isFr ? 'Confidentialité Totale : ' : 'Strict Privacy: '}</strong>
              {isFr 
                ? 'Vos clés restent exclusivement stockées dans votre navigateur (localStorage). Elles ne sont JAMAIS visibles par les autres membres et ne sont JAMAIS enregistrées dans une base de données partagée.'
                : 'Your keys remain stored strictly inside your browser (localStorage). They are never visible to others and never saved into any shared database.'}
            </p>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in duration-200 ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-200' 
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-200'
            }`}>
              {statusMessage.type === 'success' ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Keys List */}
          {keysList.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                  {isFr ? 'Vos Clés Enregistrées' : 'Your Saved Keys'} ({keysList.length})
                </span>
                {!showAddForm && (
                  <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="text-xs font-bold text-[#c084fc] hover:text-purple-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Ajouter une autre clé' : 'Add another key'}</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {keysList.map((item) => {
                  const masked = item.key.slice(0, 6) + '••••••••' + item.key.slice(-4);
                  return (
                    <div 
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        item.isActive 
                          ? 'bg-[#a855f7]/15 border-[#a855f7]/50 shadow-md shadow-purple-500/10'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleSetActive(item.id)}
                          className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer transition-all shrink-0 ${
                            item.isActive 
                              ? 'border-[#c084fc] bg-[#a855f7] text-white' 
                              : 'border-white/30 hover:border-white/60 text-transparent'
                          }`}
                          title={isFr ? 'Définir comme active' : 'Set as active'}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white truncate">{item.name}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                              item.provider === 'deepseek'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : (item.provider === 'gemini'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30')
                            }`}>
                              {item.provider}
                            </span>
                            {item.isActive && (
                              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {isFr ? 'Active' : 'Active'}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-white/45 truncate mt-0.5">{masked}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDeleteKey(item.id)}
                          className="p-1.5 text-white/40 hover:text-rose-400 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                          title={isFr ? 'Supprimer' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add Key Form */}
          {showAddForm && (
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/15 space-y-3.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  {isFr ? 'Ajouter une Clé API' : 'Add an API Key'}
                </span>
                {keysList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-xs text-white/50 hover:text-white"
                  >
                    {isFr ? 'Annuler' : 'Cancel'}
                  </button>
                )}
              </div>

              {/* Provider Selector */}
              <div>
                <label className="block text-[11px] font-bold text-white/70 mb-1.5">
                  {isFr ? 'Fournisseur d\'Intelligence' : 'AI Provider'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProvider('gemini')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      selectedProvider === 'gemini'
                        ? 'bg-purple-500/20 border-purple-500/60 text-purple-200'
                        : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProvider('deepseek')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      selectedProvider === 'deepseek'
                        ? 'bg-blue-500/20 border-blue-500/60 text-blue-200'
                        : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>DeepSeek</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProvider('openai')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      selectedProvider === 'openai'
                        ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200'
                        : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    <Key className="w-4 h-4" />
                    <span>OpenAI</span>
                  </button>
                </div>
              </div>

              {/* Key Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-white/70">
                    {selectedProvider === 'gemini' 
                      ? 'Clé Secrète Gemini' 
                      : (selectedProvider === 'deepseek' ? 'Clé Secrète DeepSeek' : 'Clé Secrète OpenAI')}
                  </label>
                  {selectedProvider === 'gemini' && (
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <span>{isFr ? 'Obtenir gratuitement' : 'Get free key'}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                  {selectedProvider === 'deepseek' && (
                    <a
                      href="https://platform.deepseek.com/api_keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>{isFr ? 'Plateforme DeepSeek' : 'DeepSeek platform'}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>

                <div className="relative flex items-center">
                  <input
                    type={showKeyText ? 'text' : 'password'}
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder={selectedProvider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                    className="w-full bg-black/60 border border-white/15 focus:border-[#a855f7] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-white/25 outline-none pr-10 transition-all"
                    disabled={isValidating}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeyText(!showKeyText)}
                    className="absolute right-2 p-1 text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    {showKeyText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Key Label Name */}
              <div>
                <label className="block text-[11px] font-bold text-white/70 mb-1">
                  {isFr ? 'Nom / Libellé (Optionnel)' : 'Label (Optional)'}
                </label>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder={selectedProvider === 'gemini' ? 'Ma Clé Gemini Pro' : (selectedProvider === 'deepseek' ? 'Mon DeepSeek' : 'Clé OpenAI')}
                  className="w-full bg-black/60 border border-white/15 focus:border-[#a855f7] rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/25 outline-none transition-all"
                  disabled={isValidating}
                />
              </div>

              {/* Submit Validation Button */}
              <button
                type="button"
                onClick={handleValidateAndAdd}
                disabled={isValidating || !inputKey.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isFr ? 'Test de la clé auprès du fournisseur...' : 'Validating key...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isFr ? 'Tester, Valider & Enregistrer' : 'Test & Save Key'}</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end relative z-10 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {isFr ? 'Fermer' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
