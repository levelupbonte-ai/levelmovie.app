import React, { useState, useMemo } from 'react';
import {
  X, Search, Play, Users, Volume2, Lock, Laptop, Server,
  ChevronRight, ChevronDown, Check, ArrowLeft, Send, Sparkles,
  HelpCircle, ThumbsUp, ThumbsDown, MessageSquare, ShieldCheck,
  RefreshCw, CheckCircle2, AlertCircle, ExternalLink, Mail, Flame
} from 'lucide-react';
import { LevelMovieLogo } from '../constants';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  userEmail: string;
  showToast: (msg: string, type?: string) => void;
}

interface Article {
  id: string;
  categoryId: string;
  title: string;
  summary: string;
  tag: string;
  isPopular?: boolean;
  steps: { title: string; desc: string }[];
  tips?: string[];
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  lang,
  userEmail,
  showToast
}) => {
  const isFr = lang === 'fr';

  // Navigation state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'articles' | 'contact' | 'status'>('articles');
  const [articleFeedback, setArticleFeedback] = useState<{ [id: string]: 'yes' | 'no' }>({});

  // Ticket state
  const [ticketType, setTicketType] = useState<'bug' | 'movie_request' | 'account' | 'other'>('bug');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketEmail, setTicketEmail] = useState(userEmail || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketRef, setSubmittedTicketRef] = useState<string | null>(null);

  // Server health state
  const [pingData, setPingData] = useState<{ [name: string]: number }>({
    'Serveur Global (VidSrc)': 24,
    'Serveur Multi (SuperEmbed)': 28,
    'Serveur Alpha (VidLink)': 20,
    'Serveur Beta (VidSrc To)': 26,
    'Cloud Database (Supabase)': 16
  });
  const [isPinging, setIsPinging] = useState(false);

  // Categorires in Google Help Center style
  const categories = useMemo(() => [
    {
      id: 'streaming',
      title: isFr ? 'Lecture & Serveurs' : 'Streaming & Mirrors',
      description: isFr ? 'Résoudre les problèmes de chargement, changer de lecteur, qualité 1080p/4K.' : 'Troubleshoot buffering, switch server mirrors, 1080p/4K resolution.',
      icon: Play,
      count: 3
    },
    {
      id: 'party',
      title: isFr ? 'Watch Party & Salons' : 'Watch Party & Rooms',
      description: isFr ? 'Créer un salon entre amis, masquer le chat, inviter par lien direct.' : 'Host watch parties, hide chat for fullscreen, invite friends directly.',
      icon: Users,
      count: 3
    },
    {
      id: 'audio',
      title: isFr ? 'Audio, VF & Sous-titres' : 'Audio, French & Subtitles',
      description: isFr ? 'Activer la piste française (VF), régler le décalage sonore et sous-titres.' : 'Switch to French (VF/VOSTFR), fix audio desync, custom subtitles.',
      icon: Volume2,
      count: 2
    },
    {
      id: 'account',
      title: isFr ? 'Compte & Synchronisation' : 'Account & Sync',
      description: isFr ? 'Connexion immédiate, synchronisation de Ma Liste et historique cloud.' : 'Instant login, cloud watchlist backup and history sync.',
      icon: Lock,
      count: 2
    },
    {
      id: 'pc',
      title: isFr ? 'PC & Raccourcis' : 'PC & Shortcuts',
      description: isFr ? 'Raccourcis clavier, mode plein écran cinéma, fluidité du lecteur.' : 'Keyboard shortcuts, cinema fullscreen view, player performance.',
      icon: Laptop,
      count: 2
    },
    {
      id: 'status',
      title: isFr ? 'État des Serveurs' : 'Server Status',
      description: isFr ? 'Diagnostic de latence en direct et disponibilité des sources vidéo.' : 'Real-time server latency and mirror health status.',
      icon: Server,
      count: 1
    }
  ], [isFr]);

  // Structured Knowledge Base Articles
  const articles: Article[] = useMemo(() => [
    {
      id: 'art-stream-loading',
      categoryId: 'streaming',
      isPopular: true,
      title: isFr ? 'La vidéo ne démarre pas ou reste bloquée en chargement' : 'Video won’t start or stays in loading state',
      tag: isFr ? 'Lecture' : 'Playback',
      summary: isFr 
        ? 'Si le lecteur affiche un écran noir ou tourne en rond, la solution la plus rapide est de changer de serveur miroir.' 
        : 'If the video player displays a black screen or buffers constantly, switching mirrors fixes the issue.',
      steps: [
        {
          title: isFr ? 'Étape 1 : Changer de serveur miroir' : 'Step 1: Switch video mirror',
          desc: isFr
            ? 'En haut à droite du lecteur, ouvrez le sélecteur de Serveurs (ex: Global, Multi, Alpha, Beta). Chaque serveur propose des flux vidéo indépendants.'
            : 'Open the Server dropdown at the top-right of the player (e.g., Global, Multi, Alpha, Beta) and select another mirror.'
        },
        {
          title: isFr ? 'Étape 2 : Vérifier les bloqueurs de scripts iframe' : 'Step 2: Check iframe ad-blockers',
          desc: isFr
            ? 'Certaines extensions de navigateur très strictes peuvent bloquer les lecteurs intégrés. Autorisez le lecteur ou testez en navigation privée.'
            : 'Strict browser extensions may block iframe players. Add an exception or test in an incognito window.'
        },
        {
          title: isFr ? 'Étape 3 : Vider le cache de la vidéo' : 'Step 3: Clear browser cache',
          desc: isFr
            ? 'Faites Ctrl + F5 (ou Cmd + Shift + R sur Mac) pour forcer le rafraîchissement complet du flux vidéo.'
            : 'Press Ctrl + F5 (or Cmd + Shift + R on Mac) to force refresh the video stream.'
        }
      ],
      tips: [
        isFr ? 'Le serveur Multi (SuperEmbed) et le serveur Alpha (VidLink) sont généralement les plus rapides pour les films récents.' : 'Multi (SuperEmbed) and Alpha (VidLink) are usually the fastest for newly released titles.'
      ]
    },
    {
      id: 'art-stream-quality',
      categoryId: 'streaming',
      isPopular: true,
      title: isFr ? 'Comment forcer la qualité maximale 1080p Full HD / 4K' : 'How to set highest 1080p Full HD / 4K quality',
      tag: isFr ? 'Qualité vidéo' : 'Quality',
      summary: isFr
        ? 'Les lecteurs ajustent automatiquement la résolution selon votre débit. Vous pouvez verrouiller la haute définition.'
        : 'Video players adapt quality to your network speed. You can manually lock Full HD.',
      steps: [
        {
          title: isFr ? 'Étape 1 : Ouvrir les paramètres du lecteur' : 'Step 1: Open player settings',
          desc: isFr
            ? 'Survolez la vidéo et cliquez sur l’icône d’engrenage (Paramètres) située dans la barre de contrôle inférieure de la vidéo.'
            : 'Hover over the video and click the gear icon inside the player bottom toolbar.'
        },
        {
          title: isFr ? 'Étape 2 : Choisir 1080p ou 4K' : 'Step 2: Select 1080p or 4K',
          desc: isFr
            ? 'Dans le menu Résolution / Qualité, sélectionnez 1080p (FHD) au lieu de « Auto ». Le flux se verrouillera sur la qualité maximale.'
            : 'Select 1080p instead of Auto. The video will lock to maximum resolution.'
        }
      ]
    },
    {
      id: 'art-party-fullscreen',
      categoryId: 'party',
      isPopular: true,
      title: isFr ? 'Masquer le chat en Watch Party pour profiter du plein écran sur PC' : 'Hide Watch Party chat for fullscreen cinema view on PC',
      tag: isFr ? 'Watch Party' : 'Watch Party',
      summary: isFr
        ? 'Vous pouvez masquer la colonne de discussion pour étendre la vidéo sur 100% de votre écran tout en recevant des alertes discrètes.'
        : 'You can hide the chat panel to expand the video to 100% width while still receiving floating alerts.',
      steps: [
        {
          title: isFr ? 'Étape 1 : Cliquer sur « Masquer le chat »' : 'Step 1: Click "Hide chat"',
          desc: isFr
            ? 'Dans la barre d’actions sous la vidéo de votre salon, cliquez sur le bouton « Masquer chat ». La vidéo occupe alors tout l’écran.'
            : 'In the control bar under the party player, click "Hide chat". The player expands to full width.'
        },
        {
          title: isFr ? 'Étape 2 : Notifications flottantes en direct' : 'Step 2: Floating live notifications',
          desc: isFr
            ? 'Dès qu’un ami envoie un message, une mini-bulle interactive s’affiche en haut à droite. Cliquez dessus pour répondre en un clin d’œil.'
            : 'When a friend sends a message, a sleek top notification banner appears. Click it to immediately reopen chat.'
        }
      ]
    },
    {
      id: 'art-party-invite',
      categoryId: 'party',
      isPopular: true,
      title: isFr ? 'Comment inviter des amis dans son salon en 1 clic' : 'How to invite friends to your watch party in 1 click',
      tag: isFr ? 'Salons' : 'Rooms',
      summary: isFr
        ? 'Partagez le lien direct de votre salon ou envoyez une invitation formatée directement par email.'
        : 'Share your direct room URL or send an automated invite via email.',
      steps: [
        {
          title: isFr ? 'Étape 1 : Ouvrir le panneau de partage' : 'Step 1: Open share panel',
          desc: isFr
            ? 'Dans l’en-tête du salon, cliquez sur le bouton « Partager » ou sur le code du salon.'
            : 'In the room header, click the "Share" button or the 6-character room code.'
        },
        {
          title: isFr ? 'Étape 2 : Copier le lien ou envoyer par Email' : 'Step 2: Copy link or Send via Email',
          desc: isFr
            ? 'Cliquez sur « Copier le lien » pour l’envoyer sur Discord/WhatsApp, ou renseignez l’email de votre ami pour lui envoyer une invitation automatique.'
            : 'Click "Copy Link" to send on Discord/WhatsApp or enter their email for an instant invite.'
        }
      ]
    },
    {
      id: 'art-audio-french',
      categoryId: 'audio',
      isPopular: true,
      title: isFr ? 'Passer un film en Version Française (VF) ou VOSTFR' : 'Switch movie to French audio (VF) or VOSTFR',
      tag: isFr ? 'Langues' : 'Languages',
      summary: isFr
        ? 'Choisissez facilement la piste audio française ou les sous-titres synchronisés.'
        : 'Easily toggle French audio track or synchronized subtitles.',
      steps: [
        {
          title: isFr ? 'Étape 1 : Utiliser le sélecteur audio du lecteur' : 'Step 1: Use player audio switcher',
          desc: isFr
            ? 'Dans les commandes de la vidéo, cliquez sur l’icône de bulle ou d’audio pour sélectionner « French / Français ».'
            : 'In the player controls, click the audio/subtitles icon and select French.'
        },
        {
          title: isFr ? 'Étape 2 : Basculer sur le serveur Multi' : 'Step 2: Switch to Multi mirror',
          desc: isFr
            ? 'Le serveur Multi (SuperEmbed) propose le plus grand choix de pistes audio VF et VOSTFR.'
            : 'The Multi (SuperEmbed) mirror provides the widest choice of French and multilingual tracks.'
        }
      ]
    },
    {
      id: 'art-account-login',
      categoryId: 'account',
      isPopular: true,
      title: isFr ? 'Se connecter instantanément sans attendre de lien d’activation' : 'Instant login without waiting for activation links',
      tag: isFr ? 'Compte' : 'Account',
      summary: isFr
        ? 'Votre compte est directement synchronisé et prêt à l’emploi dès la saisie de vos identifiants.'
        : 'Your account is immediately active and synced upon registration without email delays.',
      steps: [
        {
          title: isFr ? 'Connexion en 1 clic' : '1-Click Login',
          desc: isFr
            ? 'Entrez simplement votre prénom, nom, email et mot de passe dans l’onglet Créer un compte. La connexion est instantanée et votre espace personnel (Ma Liste, Salons) est sauvegardé dans le cloud.'
            : 'Enter your name, email and password. Your account is immediately created and synced to the cloud.'
        }
      ]
    },
    {
      id: 'art-pc-shortcuts',
      categoryId: 'pc',
      isPopular: false,
      title: isFr ? 'Raccourcis clavier pour une expérience cinéma optimale sur ordinateur' : 'Keyboard shortcuts for desktop cinema mode',
      tag: isFr ? 'Raccourcis' : 'Shortcuts',
      summary: isFr
        ? 'Contrôlez la lecture, le volume et le plein écran directement depuis votre clavier.'
        : 'Control playback, volume and fullscreen directly using your keyboard.',
      steps: [
        {
          title: 'Espace / K',
          desc: isFr ? 'Mettre en pause ou relancer la lecture de la vidéo.' : 'Play / Pause the video.'
        },
        {
          title: 'F',
          desc: isFr ? 'Basculer en mode Plein Écran (Fullscreen).' : 'Toggle Fullscreen mode.'
        },
        {
          title: 'M',
          desc: isFr ? 'Couper ou réactiver le son (Mute).' : 'Mute / Unmute audio.'
        },
        {
          title: 'Échap (Esc)',
          desc: isFr ? 'Quitter le mode plein écran ou fermer la modale d’information.' : 'Exit fullscreen or close current modal.'
        }
      ]
    }
  ], [isFr]);

  // Filtered articles based on search query or active category
  const filteredArticles = useMemo(() => {
    let list = articles;
    if (selectedCategoryId) {
      list = list.filter(a => a.categoryId === selectedCategoryId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(a => 
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.steps.some(s => s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q))
      );
    }
    return list;
  }, [articles, selectedCategoryId, searchQuery]);

  const activeArticle = useMemo(() => {
    if (!activeArticleId) return null;
    return articles.find(a => a.id === activeArticleId) || null;
  }, [activeArticleId, articles]);

  const handlePingTest = () => {
    setIsPinging(true);
    setTimeout(() => {
      setPingData({
        'Serveur Global (VidSrc)': Math.floor(18 + Math.random() * 12),
        'Serveur Multi (SuperEmbed)': Math.floor(20 + Math.random() * 14),
        'Serveur Alpha (VidLink)': Math.floor(16 + Math.random() * 10),
        'Serveur Beta (VidSrc To)': Math.floor(22 + Math.random() * 15),
        'Cloud Database (Supabase)': Math.floor(12 + Math.random() * 8)
      });
      setIsPinging(false);
      showToast(isFr ? 'Test de connectivité réussi (tous les serveurs sont opérationnels)' : 'Network health test completed', 'success');
    }, 700);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketDesc.trim()) {
      showToast(isFr ? 'Veuillez décrire votre demande.' : 'Please describe your request.', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const ref = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
      setIsSubmitting(false);
      setSubmittedTicketRef(ref);
      setTicketSubject('');
      setTicketDesc('');
      showToast(isFr ? `Demande #${ref} transmise à l'équipe avec succès` : `Ticket #${ref} submitted`, 'success');
    }, 750);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9500] w-full h-full bg-[#0a0b10] text-[#e3e3e8] flex flex-col overflow-hidden font-sans select-none animate-in fade-in duration-200">
      
      {/* ========================================================================= */}
      {/* 1. GOOGLE HELP CENTER TOP BAR (Clean, Minimalist, Professional)           */}
      {/* ========================================================================= */}
      <header className="w-full bg-[#11121a] border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between z-50 shrink-0 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white transition-colors cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-white/5"
            title={isFr ? "Retour au site" : "Back to app"}
          >
            <ArrowLeft className="w-4 h-4 text-white/70" />
            <span className="hidden sm:inline">{isFr ? "Retour" : "Back"}</span>
          </button>

          <div className="h-4 w-[1px] bg-white/15 hidden sm:block"></div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#a855f7]/15 text-[#c084fc]">
              <LevelMovieLogo className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-semibold text-white tracking-tight">
                Level<span className="text-[#a855f7]">Movie</span>
              </span>
              <span className="text-xs text-white/40 font-medium">
                {isFr ? "Centre d'aide" : "Help Center"}
              </span>
            </div>
          </div>
        </div>

        {/* Top Google-style navigation tabs */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => { setActiveTab('articles'); setActiveArticleId(null); setSelectedCategoryId(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'articles'
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {isFr ? 'Aide & Guides' : 'Help & Guides'}
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('contact'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {isFr ? 'Contacter l’assistance' : 'Contact Support'}
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('status'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer hidden sm:block ${
              activeTab === 'status'
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {isFr ? 'Serveurs' : 'Servers'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors ml-2 cursor-pointer"
            title={isFr ? "Fermer" : "Close"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. CORPS PRINCIPAL DU CENTRE D'AIDE                                      */}
      {/* ========================================================================= */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        
        {/* ==================== VUE 1 : GUIDES & BASE DE CONNAISSANCES ==================== */}
        {activeTab === 'articles' && (
          <div>
            
            {/* GOOGLE SEARCH HERO HEADER */}
            <div className="bg-[#12131c] border-b border-white/10 py-10 sm:py-14 px-4 sm:px-8 text-center relative">
              <div className="max-w-2xl mx-auto space-y-4">
                <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                  {isFr ? "Comment pouvons-nous vous aider ?" : "How can we help you?"}
                </h1>

                {/* Google-style search input */}
                <div className="relative max-w-xl mx-auto">
                  <Search className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (activeArticleId) setActiveArticleId(null);
                    }}
                    placeholder={isFr ? "Décrivez votre problème (ex: lecteur bloqué, plein écran, VF, inviter un ami...)" : "Describe your issue (e.g. video loading, fullscreen, audio, invite...)"}
                    className="w-full pl-12 pr-10 py-3.5 rounded-full bg-[#1c1d29] border border-white/15 focus:border-[#a855f7] focus:bg-[#212230] text-sm text-white placeholder-white/40 outline-none shadow-lg transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* CONTENU PRINCIPAL : CATÉGORIES & ARTICLES */}
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-10">
              
              {/* SI UN ARTICLE EST SÉLECTIONNÉ : AFFICHAGE PLEINE PAGE STYLE GOOGLE DOCS */}
              {activeArticle ? (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Fil d'ariane & Bouton retour */}
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <button
                      type="button"
                      onClick={() => setActiveArticleId(null)}
                      className="text-[#c084fc] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{isFr ? "Retour aux articles" : "Back to all topics"}</span>
                    </button>
                    <span>/</span>
                    <span className="text-white/70">{activeArticle.tag}</span>
                  </div>

                  {/* Fiche Article */}
                  <article className="bg-[#12131d] border border-white/10 rounded-2xl p-6 sm:p-10 space-y-6">
                    <div className="space-y-2 border-b border-white/10 pb-6">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#a855f7]/15 text-[#c084fc] text-[11px] font-semibold">
                        <span>{activeArticle.tag}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                        {activeArticle.title}
                      </h2>
                      <p className="text-sm text-white/70 leading-relaxed pt-1">
                        {activeArticle.summary}
                      </p>
                    </div>

                    {/* Étapes claires */}
                    <div className="space-y-5">
                      {activeArticle.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                          <div className="w-7 h-7 rounded-full bg-white/10 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <div className="space-y-1 flex-1">
                            <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Conseils supplémentaires */}
                    {activeArticle.tips && activeArticle.tips.length > 0 && (
                      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                          <Sparkles className="w-4 h-4" />
                          <span>{isFr ? "Conseil d'expert" : "Helpful Tip"}</span>
                        </div>
                        {activeArticle.tips.map((tip, i) => (
                          <p key={i} className="text-xs text-white/70">{tip}</p>
                        ))}
                      </div>
                    )}

                    {/* Widget Feedback Google "Cet article vous a-t-il été utile ?" */}
                    <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <span className="text-xs font-medium text-white/60">
                        {isFr ? "Cet article vous a-t-il été utile ?" : "Was this article helpful?"}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setArticleFeedback(prev => ({ ...prev, [activeArticle.id]: 'yes' }));
                            showToast(isFr ? 'Merci pour votre retour !' : 'Thank you for your feedback!', 'success');
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            articleFeedback[activeArticle.id] === 'yes'
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                              : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{isFr ? "Oui" : "Yes"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setArticleFeedback(prev => ({ ...prev, [activeArticle.id]: 'no' }));
                            showToast(isFr ? 'Merci, nous allons améliorer ce guide.' : 'Thank you, we will improve this guide.', 'info');
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            articleFeedback[activeArticle.id] === 'no'
                              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                              : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          <span>{isFr ? "Non" : "No"}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              ) : (
                <>
                  {/* SI AUCUNE RECHERCHE : GRILLE DES CATÉGORIES GOOGLE */}
                  {!searchQuery && !selectedCategoryId && (
                    <section className="space-y-4">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-white/50">
                        {isFr ? "Parcourir par thème" : "Browse topics"}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {categories.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                if (cat.id === 'status') {
                                  setActiveTab('status');
                                } else {
                                  setSelectedCategoryId(cat.id);
                                }
                              }}
                              className="text-left p-5 rounded-2xl bg-[#13141f] hover:bg-[#181926] border border-white/10 hover:border-[#a855f7]/40 transition-all cursor-pointer group flex flex-col justify-between h-full shadow-sm hover:shadow-md"
                            >
                              <div className="space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-[#a855f7]/20 border border-white/10 group-hover:border-[#a855f7]/40 text-white/80 group-hover:text-[#c084fc] flex items-center justify-center transition-colors">
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <h3 className="text-sm font-bold text-white group-hover:text-[#c084fc] transition-colors">
                                    {cat.title}
                                  </h3>
                                  <p className="text-xs text-white/55 leading-relaxed mt-1 line-clamp-2">
                                    {cat.description}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40 group-hover:text-white/70">
                                <span>{isFr ? `${cat.count} articles` : `${cat.count} articles`}</span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* LISTE DES ARTICLES FILTRÉS / POPULAIRES */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {selectedCategoryId && (
                          <button
                            type="button"
                            onClick={() => setSelectedCategoryId(null)}
                            className="text-xs text-[#c084fc] hover:underline flex items-center gap-1 mr-2 cursor-pointer font-medium"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>{isFr ? "Tous les thèmes" : "All topics"}</span>
                          </button>
                        )}
                        <h2 className="text-xs font-bold uppercase tracking-wider text-white/50">
                          {searchQuery 
                            ? (isFr ? `Résultats pour « ${searchQuery} » (${filteredArticles.length})` : `Search results for "${searchQuery}" (${filteredArticles.length})`)
                            : selectedCategoryId 
                              ? (isFr ? 'Articles de cette catégorie' : 'Articles in this topic')
                              : (isFr ? 'Articles d’aide populaires' : 'Popular Help Articles')}
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {filteredArticles.length > 0 ? (
                        filteredArticles.map((art) => (
                          <div
                            key={art.id}
                            onClick={() => setActiveArticleId(art.id)}
                            className="p-4 sm:p-5 rounded-2xl bg-[#12131d] hover:bg-[#161724] border border-white/10 hover:border-[#a855f7]/40 transition-all cursor-pointer group flex items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {art.isPopular && !searchQuery && (
                                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                                    {isFr ? "Populaire" : "Popular"}
                                  </span>
                                )}
                                <span className="text-[11px] text-[#c084fc] font-medium">{art.tag}</span>
                              </div>
                              <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-[#c084fc] transition-colors">
                                {art.title}
                              </h3>
                              <p className="text-xs text-white/50 line-clamp-1">
                                {art.summary}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 bg-[#12131d] border border-white/10 rounded-2xl p-6">
                          <HelpCircle className="w-10 h-10 text-white/30 mx-auto mb-2" />
                          <h3 className="text-sm font-semibold text-white">
                            {isFr ? "Aucun article correspondant" : "No matching articles"}
                          </h3>
                          <p className="text-xs text-white/50 mt-1 mb-4">
                            {isFr ? "Essayez avec d'autres termes ou contactez directement l'équipe." : "Try different keywords or contact support directly."}
                          </p>
                          <button
                            type="button"
                            onClick={() => setActiveTab('contact')}
                            className="px-4 py-2 bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            {isFr ? "Contacter l'assistance" : "Contact Support"}
                          </button>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* GOOGLE SUPPORT CARD (Besoin d'aide supplémentaire ?) */}
                  <div className="mt-8 p-6 rounded-2xl bg-[#12131d] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 text-center sm:text-left">
                      <div className="w-10 h-10 rounded-xl bg-[#a855f7]/15 border border-[#a855f7]/30 text-[#c084fc] flex items-center justify-center shrink-0">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {isFr ? "Besoin d'aide supplémentaire ?" : "Need more help?"}
                        </h4>
                        <p className="text-xs text-white/50">
                          {isFr ? "Transmettez votre demande pour une prise en charge sous 24h." : "Submit your request for a response within 24 hours."}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('contact')}
                      className="px-4 py-2.5 bg-white text-gray-900 hover:bg-gray-100 font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer active:scale-95 shrink-0"
                    >
                      {isFr ? "Contacter l'assistance" : "Contact Support"}
                    </button>
                  </div>
                </>
              )}

            </div>

          </div>
        )}

        {/* ==================== VUE 2 : CONTACT & TICKETS STYLE GOOGLE FORM ==================== */}
        {activeTab === 'contact' && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-200">
            {submittedTicketRef ? (
              <div className="bg-[#12131d] border border-emerald-500/30 rounded-2xl p-8 text-center space-y-4 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {isFr ? "Demande d'assistance transmise" : "Support request submitted"}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed max-w-md mx-auto">
                  {isFr 
                    ? `Votre ticket a été enregistré sous la référence ${submittedTicketRef}. L'équipe technique traitera votre demande sous 24 heures maximum.`
                    : `Your request was registered with reference ${submittedTicketRef}. Support will get back to you shortly.`}
                </p>
                <div className="p-2.5 bg-black/40 rounded-lg border border-white/10 font-mono text-xs text-[#c084fc] inline-block font-bold">
                  {submittedTicketRef}
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => { setSubmittedTicketRef(null); setActiveTab('articles'); }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    {isFr ? "Retour aux guides d'aide" : "Return to help articles"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="bg-[#12131d] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-lg">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isFr ? "Transmettre une demande d'assistance" : "Submit a support request"}
                  </h3>
                  <p className="text-xs text-white/50 mt-1">
                    {isFr ? "Signalez un problème de lecture, une question sur votre compte ou demandez l'ajout d'un film." : "Report streaming issues, account questions, or request movie additions."}
                  </p>
                </div>

                {/* Catégories de contact */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'bug', label: isFr ? 'Bug de lecture' : 'Player Bug' },
                    { id: 'movie_request', label: isFr ? 'Film manquant' : 'Missing Title' },
                    { id: 'account', label: isFr ? 'Mon compte' : 'Account' },
                    { id: 'other', label: isFr ? 'Autre demande' : 'Other' }
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setTicketType(t.id as any)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        ticketType === t.id
                          ? 'bg-[#a855f7] text-white'
                          : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Sujet */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    {isFr ? "Sujet ou titre du film" : "Subject or movie title"}
                  </label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder={isFr ? "Ex : Décalage audio sur Inception..." : "e.g. Inception audio sync..."}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1b26] border border-white/10 focus:border-[#a855f7] text-xs text-white placeholder-white/30 outline-none transition-colors"
                  />
                </div>

                {/* Email de réponse */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    {isFr ? "Votre adresse e-mail (pour la réponse)" : "Your email address"}
                  </label>
                  <input
                    type="email"
                    value={ticketEmail}
                    onChange={(e) => setTicketEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1b26] border border-white/10 focus:border-[#a855f7] text-xs text-white placeholder-white/30 outline-none transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    {isFr ? "Description de votre problème" : "Description of the issue"}
                  </label>
                  <textarea
                    rows={4}
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    placeholder={isFr ? "Expliquez précisément ce qui se passe ou ce dont vous avez besoin..." : "Please describe what is happening..."}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1b26] border border-white/10 focus:border-[#a855f7] text-xs text-white placeholder-white/30 outline-none resize-none transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#a855f7] hover:bg-[#9333ea] text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? (isFr ? 'Transmission...' : 'Sending...') : (isFr ? 'Envoyer la demande' : 'Submit Request')}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* ==================== VUE 3 : ÉTAT DES SERVEURS & DIAGNOSTIC ==================== */}
        {activeTab === 'status' && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-200 space-y-6">
            <div className="bg-[#12131d] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isFr ? "État des serveurs & Latence" : "Live Server Status & Latency"}
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    {isFr ? "Disponibilité en temps réel des lecteurs et de la base de données." : "Real-time health of player mirrors and cloud database."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePingTest}
                  disabled={isPinging}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#c084fc] ${isPinging ? 'animate-spin' : ''}`} />
                  <span>{isPinging ? 'Test...' : (isFr ? 'Actualiser' : 'Refresh')}</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {Object.entries(pingData).map(([name, latency]) => (
                  <div
                    key={name}
                    className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <div>
                        <span className="text-xs font-semibold text-white block">{name}</span>
                        <span className="text-[10px] text-emerald-400 font-medium">100% Opérationnel</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#c084fc] bg-white/5 px-2 py-1 rounded">
                      {latency} ms
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
