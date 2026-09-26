import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { SystemSettings, SupportedLanguage } from '../../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../../data/i18n';
import {
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Key,
  Globe,
  Volume2,
  Cpu,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { BSAIButton } from '../common/BSAIButton';

interface SettingsViewProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onResetDemo: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentLanguage,
  onLanguageChange,
  onResetDemo,
}) => {
  const [settings, setSettings] = useState<SystemSettings>({
    aiModel: 'gemini-1.5-flash',
    geminiModel: 'gemini-1.5-flash',
    aiTemperature: 0.4,
    autoEscalationThreshold: 0.70,
    defaultLanguage: currentLanguage || 'en',
    enableVoiceSynthesis: true,
    enableSoundEffects: true,
    reducedMotion3D: false,
    themeMode: 'light',
    notificationsEnabled: true,
    apiKeySet: false,
    geminiApiKey: '',
  });

  const [enteredApiKey, setEnteredApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const d = await api.getSettings();
        setSettings(d);
        if (d.defaultLanguage && d.defaultLanguage !== currentLanguage) {
          onLanguageChange(d.defaultLanguage);
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    setSettings((prev) => ({ ...prev, defaultLanguage: lang }));
    onLanguageChange(lang);
    localStorage.setItem('bsai_language', lang);
  };

  const handleTestGeminiKey = async () => {
    try {
      setIsVerifying(true);
      setVerifyResult(null);
      const keyToTest = enteredApiKey.trim() || settings.geminiApiKey || '';
      const res = await api.verifyGeminiKey(keyToTest, settings.geminiModel || 'gemini-2.0-flash');
      setVerifyResult(res);
      if (res.valid) {
        setSettings((prev) => ({
          ...prev,
          apiKeySet: true,
          geminiModel: (res as any).model || prev.geminiModel || 'gemini-2.0-flash',
          aiModel: ((res as any).model as any) || prev.aiModel || 'gemini-2.0-flash',
        }));
      }
    } catch (err: any) {
      setVerifyResult({
        valid: false,
        message: err.message || 'Failed to connect to Google Gemini API',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<SystemSettings> = {
        ...settings,
        defaultLanguage: currentLanguage,
      };
      if (enteredApiKey.trim()) {
        payload.geminiApiKey = enteredApiKey.trim();
      }

      await api.saveSettings(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);

      // Refresh loaded settings state
      const fresh = await api.getSettings();
      setSettings(fresh);
      setEnteredApiKey('');
    } catch (e) {
      console.error(e);
    }
  };

  const t = (key: string) => getTranslation(currentLanguage, key);

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-xl border border-bsai-border">
        <h1 className="text-xl sm:text-2xl font-bold font-display text-bsai-indigo">
          {t('settings_title')}
        </h1>
        <p className="text-xs text-bsai-indigoLight mt-0.5">
          {t('settings_sub')}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* 1. Language & Audio Preferences */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-bsai-border space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-bsai-border">
            <Globe className="w-4 h-4 text-[#126a50]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-bsai-indigo">
              {t('sec_language_voice')}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-bsai-indigo block mb-2">
                {t('default_language')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SUPPORTED_LANGUAGES.map((l) => {
                  const isSelected = currentLanguage === l.code;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => handleLanguageSelect(l.code)}
                      className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#eaf2ec] border-[#126a50] text-[#0d503d] font-bold'
                          : 'bg-white hover:bg-[#f7f8f5] border-[#dce3da] text-[#34443a]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-sm font-semibold">{l.nativeName}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#126a50]" />}
                      </div>
                      <div className="text-[10px] text-[#79827c]">
                        {l.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={settings.enableVoiceSynthesis}
                onChange={(e) =>
                  setSettings({ ...settings, enableVoiceSynthesis: e.target.checked })
                }
                className="rounded text-[#126a50] focus:ring-[#126a50] w-4 h-4 accent-[#126a50]"
              />
              <span className="text-xs font-medium text-bsai-indigo flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#79827c]" />
                <span>{t('enable_tts')}</span>
              </span>
            </label>
          </div>
        </div>

        {/* 2. Google Gemini AI Integration */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-bsai-border space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-bsai-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#126a50]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-bsai-indigo">
                {t('sec_gemini_api')}
              </h2>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-[#126a50] hover:underline flex items-center gap-1"
            >
              <span>Get key from Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-xs text-[#536157] leading-relaxed">
            {t('gemini_api_sub')}
          </p>

          {/* Status Indicator */}
          <div
            className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-xs ${
              settings.apiKeySet
                ? 'bg-[#eaf2ec] border-[#dce9de] text-[#0d503d]'
                : 'bg-[#f7f8f5] border-[#dce3da] text-[#536157]'
            }`}
          >
            <div className="flex items-center gap-2">
              {settings.apiKeySet ? (
                <ShieldCheck className="w-4 h-4 text-[#126a50]" />
              ) : (
                <Cpu className="w-4 h-4 text-[#79827c]" />
              )}
              <span className="font-semibold">
                {settings.apiKeySet
                  ? t('gemini_status_connected')
                  : t('gemini_status_not_set')}
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm bg-white border border-[#dce3da]">
              {settings.geminiModel || 'gemini-1.5-flash'}
            </span>
          </div>

          {/* Verification Feedback Banner */}
          {verifyResult && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                verifyResult.valid
                  ? 'bg-[#eaf2ec] border-[#126a50] text-[#0d503d]'
                  : 'bg-[#fdf3f1] border-[#f5d6d0] text-[#a45a4b]'
              }`}
            >
              {verifyResult.valid ? (
                <CheckCircle2 className="w-4 h-4 text-[#126a50] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#a45a4b] shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold">{verifyResult.valid ? 'Verification Successful' : 'Connection Error'}</div>
                <div className="text-[11px] mt-0.5">{verifyResult.message}</div>
              </div>
            </div>
          )}

          {/* Input & Model Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-bsai-indigo block mb-1">
                {t('gemini_api_key')}:
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={enteredApiKey}
                  onChange={(e) => setEnteredApiKey(e.target.value)}
                  placeholder={
                    settings.geminiApiKey
                      ? `Active: ${settings.geminiApiKey}`
                      : 'Paste AIzaSy... API key from Google AI Studio'
                  }
                  className="w-full bg-[#fbfcf9] border border-[#dce3da] rounded-md pl-9 pr-10 py-2 text-xs text-bsai-indigo placeholder-[#9aa29a] focus:outline-none focus:border-[#126a50]"
                />
                <Key className="w-4 h-4 text-[#79827c] absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#79827c] hover:text-[#1c2925]"
                >
                  {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-bsai-indigo block mb-1">
                {t('gemini_model')}:
              </label>
              <select
                value={settings.geminiModel || 'gemini-1.5-flash'}
                onChange={(e) =>
                  setSettings({ ...settings, geminiModel: e.target.value })
                }
                className="w-full bg-white border border-[#dce3da] rounded-md px-3 py-2 text-xs font-semibold text-bsai-indigo focus:outline-none focus:border-[#126a50] cursor-pointer"
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast & Multilingual)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <BSAIButton
              type="button"
              variant="secondary"
              size="sm"
              isLoading={isVerifying}
              onClick={handleTestGeminiKey}
              icon={<Sparkles className="w-3.5 h-3.5 text-[#126a50]" />}
              iconPosition="left"
            >
              {t('btn_test_gemini')}
            </BSAIButton>
          </div>
        </div>

        {/* 3. Demo Data Reset */}
        <div className="bg-white rounded-xl p-5 border border-bsai-border flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-bsai-indigo">{t('reset_demo_title')}</div>
            <div className="text-[11px] text-[#79827c]">
              {t('reset_demo_sub')}
            </div>
          </div>

          <BSAIButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={onResetDemo}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            iconPosition="left"
          >
            {t('reset_demo_btn')}
          </BSAIButton>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs font-bold text-[#126a50] flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('saved_badge')}</span>
            </span>
          )}

          <BSAIButton
            type="submit"
            variant="primary"
            size="md"
            icon={<CheckCircle2 className="w-4 h-4" />}
            iconPosition="right"
          >
            {t('save_settings_btn')}
          </BSAIButton>
        </div>
      </form>
    </div>
  );
};
