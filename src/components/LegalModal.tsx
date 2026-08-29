import React, { useState } from 'react';
import { X, Shield, FileText, Lock, Globe, Mail, CheckCircle2, AlertTriangle, ExternalLink, ArrowLeft } from 'lucide-react';

export type LegalDocType = 'terms' | 'privacy';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoc?: LegalDocType;
  lang?: string;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialDoc = 'terms',
  lang = 'fr'
}) => {
  const [activeDoc, setActiveDoc] = useState<LegalDocType>(initialDoc);
  const [docLang, setDocLang] = useState<'fr' | 'en'>((lang === 'fr' ? 'fr' : 'en'));

  if (!isOpen) return null;

  const isFrench = docLang === 'fr';

  return (
    <div 
      id="legal-modal-overlay"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="legal-modal-card"
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#08080c] border border-white/10 rounded-2xl shadow-2xl shadow-purple-950/40 text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Navigation & Tab Switcher */}
        <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-white/10 bg-[#08080c]/95 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              {activeDoc === 'terms' ? <FileText className="w-5 h-5" /> : <Shield className="w-5 h-5 text-blue-400" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                LevelUp Ecosystem
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 font-normal text-white/70">
                  {isFrench ? 'Règles Officielles' : 'Official Policies'}
                </span>
              </h2>
              <p className="text-xs text-white/50">LevelMovie · LevelMusic · Level IA</p>
            </div>
          </div>

          {/* Controls: Document selector, Language & Close */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveDoc('terms')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeDoc === 'terms'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {isFrench ? "Conditions d'utilisation" : "Terms of Service"}
              </button>
              <button
                type="button"
                onClick={() => setActiveDoc('privacy')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeDoc === 'privacy'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {isFrench ? "Confidentialité" : "Privacy Policy"}
              </button>
            </div>

            {/* Language toggle */}
            <button
              type="button"
              onClick={() => setDocLang(docLang === 'fr' ? 'en' : 'fr')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-colors flex items-center gap-1.5"
              title="Changer la langue / Switch language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{docLang.toUpperCase()}</span>
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 space-y-6 text-sm text-white/80 leading-relaxed custom-scrollbar">
          {activeDoc === 'terms' ? (
            /* TERMS OF SERVICE CONTENT */
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/10">
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
                    {isFrench ? "Conditions Générales d'Utilisation" : "Terms of Service"}
                  </span>
                </h1>
                <p className="text-xs text-white/50 mt-1">
                  {isFrench ? "Dernière mise à jour : Mai 2026 · Version 1.2 · Document Contractuel" : "Last updated: May 2026 · Version 1.2 · Legally Binding Document"}
                </p>
              </div>

              {/* Callout Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 to-indigo-950/30 border border-purple-500/20 flex gap-3.5 items-start">
                <Shield className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1 text-white/80">
                  <p className="font-bold text-purple-300">{isFrench ? "Engagement Légal & Sécurité" : "Legally Binding Agreement"}</p>
                  <p>
                    {isFrench
                      ? "Les présentes Conditions Générales régissent l'utilisation de l'ensemble des services de l'écosystème LevelUp (LevelMovie, LevelMusic, Level IA). En utilisant nos services, vous acceptez pleinement ces règles conçues pour protéger vos droits et la pérennité de la plateforme."
                      : "These Terms of Service constitute a legal agreement between you (the User) and LevelUp Ecosystem. By creating an account or using our services, you fully accept these terms."}
                  </p>
                </div>
              </div>

              {/* Section 1 */}
              <section className="space-y-2">
                <h3 className="text-base font-bold text-purple-400 flex items-center gap-2">
                  1. {isFrench ? "Identification des Parties & Définitions" : "Identification of Parties & Definitions"}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm">
                  {isFrench
                    ? "LevelUp Ecosystem est une initiative technologique développant et maintenant les services LevelMovie, LevelMusic et Level IA, ainsi que l'infrastructure d'authentification centrale. Support officiel : "
                    : "LevelUp Ecosystem is a technological initiative operating LevelMovie, LevelMusic, and Level IA. Support can be reached at: "}
                  <a href="mailto:levelup.ia0@gmail.com" className="text-purple-400 underline font-medium">levelup.ia0@gmail.com</a>.
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-white/70 pl-2">
                  <li><strong>LVL Access Key :</strong> {isFrench ? "Identifiant alphanumérique unique sécurisé format LVL-XXXXX-XXXXX servant de passeport numérique." : "Unique alphanumeric identifier formatted as LVL-XXXXX-XXXXX acting as digital passport."}</li>
                  <li><strong>PIN Code :</strong> {isFrench ? "Code à 4 chiffres haché de manière irréversible pour protéger l'affichage de votre clé." : "4-digit hashed PIN securing key revelation."}</li>
                  <li><strong>Authentification Google OAuth 2.0 :</strong> {isFrench ? "Système de connexion sécurisé sans mot de passe stocké chez nous." : "Secure passwordless authentication standard."}</li>
                </ul>
              </section>

              {/* Section 2 */}
              <section className="space-y-2">
                <h3 className="text-base font-bold text-purple-400 flex items-center gap-2">
                  2. {isFrench ? "Description des Services de l'Écosystème" : "Description of Services"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="font-bold text-white text-xs">🎬 LevelMovie</p>
                    <p className="text-[11px] text-white/60 mt-1">
                      {isFrench ? "Agrégateur cinématographique décentralisé indexant des flux tiers. Aucun fichier vidéo hébergé." : "Decentralized cinema aggregator indexing third-party links."}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="font-bold text-white text-xs">🎵 LevelMusic</p>
                    <p className="text-[11px] text-white/60 mt-1">
                      {isFrench ? "Lecteur musical immersif avec playlists personnalisées et aperçus haute qualité." : "Global music player with curated playlists and preview tracks."}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="font-bold text-white text-xs">🤖 Level IA</p>
                    <p className="text-[11px] text-white/60 mt-1">
                      {isFrench ? "Assistant conversationnel et analyse intelligente propulsé par les modèles Gemini de pointe." : "AI assistant and intelligent analysis powered by state-of-the-art Gemini models."}
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="space-y-2">
                <h3 className="text-base font-bold text-purple-400 flex items-center gap-2">
                  3. {isFrench ? "Règles d'Utilisation de la Clé LVL" : "LVL Access Key — Usage Rules"}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm">
                  {isFrench
                    ? "Votre clé d'accès est strictement personnelle et incessible. Il est formellement interdit de revendre, partager publiquement ou injecter votre clé dans des robots automatisés. En cas de compromission, vous pouvez la régénérer instantanément depuis vos paramètres."
                    : "The Access Key is strictly personal and non-transferable. Reselling, public sharing, or automated scraping is strictly prohibited. You can regenerate your key at any time from your settings."}
                </p>
              </section>

              {/* Section 4 */}
              <section className="space-y-2">
                <h3 className="text-base font-bold text-purple-400 flex items-center gap-2">
                  4. {isFrench ? "Charte DMCA & Propriété Intellectuelle" : "DMCA & Intellectual Property"}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm">
                  {isFrench
                    ? "LevelMovie n'héberge, ne stocke ni ne diffuse aucun fichier vidéo sur ses propres serveurs. LevelMovie agit exclusivement comme moteur de recherche et indexeur vers des flux tiers indépendants. Toute demande DMCA relative au retrait de contenu doit être adressée directement aux hébergeurs tiers."
                    : "LevelMovie does not host, store, or transmit any video files on its servers. It functions purely as an aggregator indexing external links. DMCA takedown requests must be sent directly to the third-party file hosts."}
                </p>
              </section>

              {/* Contact support button */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
                <a
                  href="mailto:levelup.ia0@gmail.com?subject=Support%20LevelUp%20-%20Terms%20of%20Service"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {isFrench ? "Contacter le Support Légal" : "Contact Legal Support"}
                </a>
                <p className="text-[11px] text-white/40">© 2026 LevelUp Ecosystem — All rights reserved</p>
              </div>
            </div>
          ) : (
            /* PRIVACY POLICY CONTENT */
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/10">
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    {isFrench ? "Politique de Confidentialité (RGPD)" : "Privacy Policy (GDPR)"}
                  </span>
                </h1>
                <p className="text-xs text-white/50 mt-1">
                  {isFrench ? "Dernière mise à jour : Mai 2026 · Version 1.2 · Protection des Données" : "Last updated: May 2026 · Version 1.2 · Data Protection"}
                </p>
              </div>

              {/* Callout Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 to-cyan-950/30 border border-blue-500/20 flex gap-3.5 items-start">
                <Lock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1 text-white/80">
                  <p className="font-bold text-blue-300">{isFrench ? "Votre vie privée est sacrée" : "Your Privacy is Our Priority"}</p>
                  <p>
                    {isFrench
                      ? "Nous ne vendons pas vos données, nous ne faisons aucun profilage publicitaire et nous n'avons aucun tracker tiers (ni Meta Pixel, ni régies publicitaires intrusives). Vos données vous appartiennent."
                      : "We do not profile you, we do not sell your information, and we do not share your personal data with third parties for commercial purposes."}
                  </p>
                </div>
              </div>

              {/* Section 1 */}
              <section className="space-y-2">
                <h3 className="text-base font-bold text-blue-400 flex items-center gap-2">
                  1. {isFrench ? "Données Collectées & Finalités" : "Data We Collect & How We Use It"}
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-white/70 pl-2">
                  <li><strong>{isFrench ? "Identité Google :" : "Google Identity Data:"}</strong> {isFrench ? "Nom d'affichage, adresse email principale et photo de profil (personnalisation de l'interface)." : "Display name, email address, profile picture URL."}</li>
                  <li><strong>{isFrench ? "Clé LVL & Hachage PIN :" : "LVL Key & Hashed PIN:"}</strong> {isFrench ? "Gestion de vos droits d'accès aux apps, avec protection par code PIN haché en sens unique." : "Managing access rights with one-way salted PIN protection."}</li>
                  <li><strong>{isFrench ? "Localisation approximative :" : "Approximate Location Data:"}</strong> {isFrench ? "Utilisée STRICTEMENT en temps réel pour contextualiser les requêtes météo/culturelles de Level IA. Jamais stockée définitivement." : "Used strictly in real-time by Level IA for local context (never permanently stored)."}</li>
                  <li><strong>{isFrench ? "Historiques & Favoris :" : "History & Watchlist:"}</strong> {isFrench ? "Stockage local / Firebase sécurisé pour retrouver vos films et séries d'une session à l'autre." : "Secured storage to resume movies and track favorites."}</li>
                </ul>
              </section>

              {/* Section 2 */}
              <section className="space-y-2">
                <h3 className="text-base font-bold text-blue-400 flex items-center gap-2">
                  2. {isFrench ? "Engagements Stricts de Sécurité" : "Strict Privacy Commitments"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex gap-2.5 items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-white/80">
                      {isFrench ? "Chiffrement systématique en transit (TLS 1.3) et au repos dans nos bases de données." : "Systematic encryption in transit (TLS 1.3) and at rest."}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex gap-2.5 items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-white/80">
                      {isFrench ? "Zéro publicité ciblée et zéro revente de vos données personnelles." : "Zero targeted advertising and zero sale of personal data."}
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="space-y-2">
                <h3 className="text-base font-bold text-blue-400 flex items-center gap-2">
                  3. {isFrench ? "Vos Droits RGPD & Suppression" : "Your Rights Under GDPR"}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm">
                  {isFrench
                    ? "Conformément au RGPD, vous disposez d'un droit total d'accès, de rectification, de portabilité et d'effacement (« droit à l'oubli »). Vous pouvez demander la suppression intégrale et irréversible de votre compte et de toutes vos données à tout moment."
                    : "Under GDPR, you have the full right of access, rectification, portability, and permanent erasure of your account and data at any time."}
                </p>
              </section>

              {/* Contact privacy button */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
                <a
                  href="mailto:support@levelup-ecosystem.com?subject=Privacy%20Policy%20Inquiry%20-%20LevelUp"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {isFrench ? "Contacter le Délégué à la Protection des Données" : "Contact Privacy Support"}
                </a>
                <p className="text-[11px] text-white/40">support@levelup-ecosystem.com</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-xs text-white/40">
          <span>LevelMovie © 2026 · LevelUp Ecosystem</span>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white font-medium transition-colors"
          >
            {isFrench ? "Fermer" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};
