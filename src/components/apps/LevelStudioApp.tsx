import React, { useState } from 'react';
import { 
  Sparkles, Check, ArrowRight, ShieldCheck, 
  Layers, Globe, Smartphone, Zap, Monitor, 
  Send, CheckCircle2, ChevronRight, MessageSquare
} from 'lucide-react';
import { LevelStudioLogo } from '../../constants';

interface LevelStudioAppProps {
  onClose?: () => void;
  lang?: string;
  user?: any;
  onOpenVitrine?: () => void;
}

export const LevelStudioApp: React.FC<LevelStudioAppProps> = ({ 
  onClose, 
  lang = 'fr',
  user,
  onOpenVitrine 
}) => {
  const isFr = lang === 'fr';

  const [selectedService, setSelectedService] = useState<'site-560' | 'event-230' | 'pro-800'>('site-560');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    projectType: 'Création de Site Web (Débute à $560)',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleServiceSelect = (key: 'site-560' | 'event-230' | 'pro-800') => {
    setSelectedService(key);
    if (key === 'site-560') {
      setFormData(prev => ({ ...prev, projectType: isFr ? 'Création de Site Web (Débute à $560)' : 'Starter Website (Starts at $560)' }));
    } else if (key === 'event-230') {
      setFormData(prev => ({ ...prev, projectType: isFr ? 'Site Invitation & Événementiel ($230)' : 'Invitation & Event Website ($230)' }));
    } else {
      setFormData(prev => ({ ...prev, projectType: isFr ? 'Business Pro & E-Commerce ($800+)' : 'Business Pro & E-Commerce ($800+)' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast(isFr ? 'Veuillez remplir tous les champs.' : 'Please fill all fields.');
      return;
    }

    setIsSubmitted(true);
    showToast(isFr ? 'Demande envoyée avec succès au Studio !' : 'Request successfully sent to Studio!');
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        projectType: 'Création de Site Web (Débute à $560)',
        message: ''
      });
    }, 4000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#050711] text-white overflow-hidden relative">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-sky-500/90 text-white text-xs font-semibold shadow-2xl backdrop-blur-md border border-sky-400/30 animate-in fade-in slide-in-from-top-2">
          {toastMsg}
        </div>
      )}

      {/* Header bar */}
      <div className="h-16 px-6 bg-[#090d1f] border-b border-sky-500/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <LevelStudioLogo className="w-8 h-8" useGradient={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-wide">LevelStudio</span>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                Web & Apps
              </span>
            </div>
            <p className="text-[11px] text-white/50">
              {isFr ? 'Studio digital, création de sites sur-mesure & vitrines immersives' : 'Digital studio, bespoke website design & showcase'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onOpenVitrine && (
            <button
              onClick={onOpenVitrine}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-medium text-white transition-all flex items-center gap-2 cursor-pointer"
            >
              <Monitor className="w-3.5 h-3.5 text-sky-400" />
              <span>{isFr ? 'Explorer la vitrine' : 'Browse Vitrine'}</span>
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main scrollable body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-8">
        
        {/* Banner Hero */}
        <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-sky-950/70 via-indigo-950/50 to-[#060814] border border-sky-500/30 overflow-hidden shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Garantie Zéro Risque • Prototype avant tout paiement</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Donnez vie à vos projets avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300">LevelStudio</span>
            </h1>

            <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
              {isFr
                ? 'Nous concevons et développons des sites web professionnels d’exception. Que vous lanciez votre activité ou prépariez un événement inoubliable, bénéficiez d’une exécution ultra-rapide et soignée.'
                : 'We craft high-performing websites and digital applications. Get stunning responsive layouts, interactive RSVP forms and bespoke branding.'}
            </p>
          </div>
        </div>

        {/* Pricing & Services Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Nos Formules Officielles</h2>
              <p className="text-xs text-white/60">Transparence totale, hébergement cloud inclus et zéro engagement initial.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* 1. Invitation & Event ($230) */}
            <div 
              onClick={() => handleServiceSelect('event-230')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                selectedService === 'event-230'
                  ? 'bg-sky-950/40 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.2)]'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Événementiel</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold">Idéal Fêtes</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">Invitation & Événement</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-white">$230</span>
                    <span className="text-xs text-white/50">/ projet</span>
                  </div>
                  <p className="text-xs text-white/60 mt-1">Mariages, galas, anniversaires, lancements VIP.</p>
                </div>

                <ul className="space-y-2 text-xs text-white/70 border-t border-white/10 pt-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Invitation interactive avec QR code</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Système RSVP en direct & comptabilisation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Design personnalisé & musique de fond</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Hébergement cloud sécurisé inclus</span>
                  </li>
                </ul>
              </div>

              <button 
                type="button"
                className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  selectedService === 'event-230'
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                    : 'bg-white/10 text-white hover:bg-white/15'
                }`}
              >
                Choisir ($230)
              </button>
            </div>

            {/* 2. Création de Site Web (Débute à $560) - POPULAR */}
            <div 
              onClick={() => handleServiceSelect('site-560')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                selectedService === 'site-560'
                  ? 'bg-sky-950/60 border-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.25)]'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 text-black font-black text-[10px] uppercase tracking-wider shadow">
                Plus Populaire
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Starter Website</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold">Pro</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">Création de Site Web</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-xs font-semibold text-sky-400">Débute à</span>
                    <span className="text-2xl sm:text-3xl font-black text-white">$560</span>
                  </div>
                  <p className="text-xs text-white/60 mt-1">Présence web complète et percutante pour votre entreprise ou projet.</p>
                </div>

                <ul className="space-y-2 text-xs text-white/70 border-t border-white/10 pt-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Site vitrine moderne (1 à 3 pages clés)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Optimisation mobile 100% responsive</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Formulaire de devis / prise de contact pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Workflow "Build-First" : validation avant achat</span>
                  </li>
                </ul>
              </div>

              <button 
                type="button"
                className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  selectedService === 'site-560'
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                    : 'bg-white/10 text-white hover:bg-white/15'
                }`}
              >
                Commander (Dès $560)
              </button>
            </div>

            {/* 3. Business Pro & E-Commerce ($800+) */}
            <div 
              onClick={() => handleServiceSelect('pro-800')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                selectedService === 'pro-800'
                  ? 'bg-sky-950/40 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.2)]'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Business Pro</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold">Sur-Mesure</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">E-Commerce & Portails</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-white">$800</span>
                    <span className="text-xs text-white/50">+</span>
                  </div>
                  <p className="text-xs text-white/60 mt-1">Boutiques en ligne, réservations complexes, plateformes sur-mesure.</p>
                </div>

                <ul className="space-y-2 text-xs text-white/70 border-t border-white/10 pt-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Paiements Stripe / passerelles sécurisées</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Tableau de bord de gestion de contenu</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Intégrations API & bases de données</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Support dédié et maintenance prioritaire</span>
                  </li>
                </ul>
              </div>

              <button 
                type="button"
                className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  selectedService === 'pro-800'
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                    : 'bg-white/10 text-white hover:bg-white/15'
                }`}
              >
                Choisir ($800+)
              </button>
            </div>

          </div>
        </div>

        {/* Studio Inquiry Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-400" />
                <span>Lancer votre projet avec le Studio</span>
              </h3>
              <p className="text-xs text-white/60">
                Décrivez votre idée. Nous débutons le prototype sans aucun prépaiement.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-sky-300 bg-sky-950/50 px-3 py-1.5 rounded-xl border border-sky-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Garantie Satisfaction</span>
            </div>
          </div>

          {isSubmitted ? (
            <div className="p-8 text-center space-y-3 bg-sky-950/30 border border-sky-400/30 rounded-2xl animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Demande reçue par l'équipe LevelStudio</h4>
              <p className="text-xs text-white/75 max-w-md mx-auto">
                Merci ! Un designer et ingénieur du Studio va examiner vos besoins et vous contacter par email avec une proposition concrète.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Votre Nom ou Entité</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Alexandre D."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-sky-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Adresse Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Ex: alexandre@exemple.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-sky-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">Formule souhaitée</label>
                <select
                  value={formData.projectType}
                  onChange={e => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0a0f26] border border-white/10 text-white text-xs focus:outline-none focus:border-sky-400 transition-colors"
                >
                  <option value="Création de Site Web (Débute à $560)">Création de Site Web (Débute à $560)</option>
                  <option value="Site Invitation & Événementiel ($230)">Site Invitation & Événementiel ($230)</option>
                  <option value="Business Pro & E-Commerce ($800+)">Business Pro & E-Commerce ($800+)</option>
                  <option value="Projet Sur-Mesure / Autre">Projet Sur-Mesure / Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">Vision, détails et objectifs du projet</label>
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Décrivez votre activité, vos préférences visuelles, les sections requises ou vos échéances..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-sky-400 transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] text-white/40">
                  Aucune carte bancaire requise. Vous ne payez qu'après approbation du résultat final.
                </p>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-sky-500/20 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Envoyer ma demande</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* LevelStudio Process 3 Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs text-white/60">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sky-400 shrink-0 font-bold">1</div>
            <div>
              <div className="font-bold text-white mb-0.5">Brief & Découverte</div>
              <div>Vous partagez vos inspirations et vos contenus.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sky-400 shrink-0 font-bold">2</div>
            <div>
              <div className="font-bold text-white mb-0.5">Conception & Prototype</div>
              <div>Nous réalisons la maquette et le développement interactif.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sky-400 shrink-0 font-bold">3</div>
            <div>
              <div className="font-bold text-white mb-0.5">Mise en ligne & Clés</div>
              <div>Vous validez le rendu, réglez la facture et recevez vos accès.</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
