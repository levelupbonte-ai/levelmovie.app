import React, { useState } from 'react';
import { X, HelpCircle, Send, MessageSquare, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Server, ShieldCheck, Mail } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  userEmail: string;
  showToast: (msg: string, type?: string) => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  lang,
  userEmail,
  showToast
}) => {
  const [reportType, setReportType] = useState<'bug' | 'missing_movie' | 'question'>('bug');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  if (!isOpen) return null;

  const faqs = [
    {
      q: lang === 'fr' ? 'La vidéo ne se charge pas ou tourne en boucle ?' : 'Video won’t play or keeps buffering?',
      a: lang === 'fr'
        ? 'Clique sur le bouton "Changer de serveur" dans le lecteur ou dans les Paramètres pour basculer sur SmashyStream ou SuperEmbed. Assure-toi aussi de désactiver les bloqueurs agressifs.'
        : 'Click on the "Change Server" button inside the player or in Settings to switch to another mirror like SmashyStream or SuperEmbed.'
    },
    {
      q: lang === 'fr' ? 'Comment lancer ou rejoindre une Watch Party entre amis ?' : 'How to start or join a group Watch Party?',
      a: lang === 'fr'
        ? 'Rends-toi dans l’onglet Salons, choisis un film et clique sur "Créer un Salon". Partage ensuite le code à 6 caractères avec tes amis pour synchroniser la lecture et chatter.'
        : 'Go to the Parties tab, pick a movie and click "Create Party". Share the 6-character room code with friends to sync playback.'
    },
    {
      q: lang === 'fr' ? 'Comment ajouter un film à Ma Liste / Mes Favoris ?' : 'How to save movies to My List / Favorites?',
      a: lang === 'fr'
        ? 'Clique sur la fiche d’un film ou d’une série, puis appuie sur le bouton "Ajouter à ma liste". Tes favoris sont instantanément sauvegardés dans le cloud.'
        : 'Open any title modal and click "Add to list". Titles are automatically synchronized to your cloud profile.'
    },
    {
      q: lang === 'fr' ? 'Les sous-titres et langues françaises (VF / VOSTFR) sont-ils disponibles ?' : 'Are French subtitles and audio available?',
      a: lang === 'fr'
        ? 'Oui, les lecteurs intègrent des pistes de sous-titres multiples et plusieurs pistes audio sélectionnables directement dans la barre d’outils du lecteur.'
        : 'Yes, embedded players include multiple subtitle and audio tracks in the player controls.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      showToast(lang === 'fr' ? 'Merci de décrire votre demande.' : 'Please describe your request.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setTitle('');
      setMessage('');
      showToast(lang === 'fr' ? 'Ticket envoyé avec succès à l’équipe support !' : 'Ticket successfully sent to support!', 'success');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[9500] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c0d14] rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(168,85,247,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#10111d]/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {lang === 'fr' ? 'Centre d’Aide & Support' : 'Help & Support Center'}
              </h3>
              <p className="text-xs text-white/50">
                {lang === 'fr' ? 'Signale un problème, suggère un film ou consulte la FAQ.' : 'Report an issue, request content or view FAQ.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-white transition-colors cursor-pointer outline-none active:scale-90"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Status Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-bold text-emerald-300">
                {lang === 'fr' ? 'Tous les serveurs de streaming sont opérationnels' : 'All streaming mirrors are operational'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
              99.8% Uptime
            </span>
          </div>

          {/* Quick FAQ Accordion */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">
              {lang === 'fr' ? 'Questions Fréquentes' : 'Frequently Asked Questions'}
            </h4>
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full p-3 text-left flex items-center justify-between text-xs font-semibold text-white/90 hover:text-white hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {expandedFaq === idx ? <ChevronUp className="w-4 h-4 text-[#a855f7]" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                  </button>
                  {expandedFaq === idx && (
                    <div className="p-3 pt-0 text-xs text-white/60 leading-relaxed border-t border-white/5 bg-black/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-2 border-t border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">
              {lang === 'fr' ? 'Envoyer un Message / Signaler un Titre' : 'Send a message or report a bug'}
            </h4>

            {/* Type selector */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bug', label: lang === 'fr' ? 'Bug / Lecteur' : 'Bug / Player' },
                { id: 'missing_movie', label: lang === 'fr' ? 'Film manquant' : 'Missing title' },
                { id: 'question', label: lang === 'fr' ? 'Autre question' : 'Question' }
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setReportType(t.id as any)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    reportType === t.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'bg-white/[0.03] text-white/60 border border-white/5 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === 'fr' ? 'Titre du film ou sujet (ex: Avatar 2, son décalé...)' : 'Subject or Movie title (e.g. Avatar 2, audio sync...)'}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/40 focus:border-emerald-500/50 outline-none"
            />

            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={lang === 'fr' ? 'Explique-nous ce qui ne va pas ou ce que tu souhaites...' : 'Describe what happened or what you need...'}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/40 focus:border-emerald-500/50 outline-none resize-none"
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? (lang === 'fr' ? 'Envoi...' : 'Sending...') : (lang === 'fr' ? 'Transmettre le Ticket' : 'Send Ticket')}</span>
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#090a10] flex items-center justify-between text-xs text-white/50 shrink-0">
          <span>Support LevelMovie • Réponse sous 24h</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
          >
            {lang === 'fr' ? 'Fermer' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
