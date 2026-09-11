import React, { useState, useEffect } from 'react';
import { 
  X, Check, ArrowRight, Eye, Search, 
  ArrowLeft, Globe
} from 'lucide-react';
import { LevelUpEcosystemStar } from '../constants';
import { ATELIER_LUMA_HTML } from '../data/atelierLumaHtml';

export interface SiteDesign {
  id: string;
  title: string;
  category: 'ecommerce' | 'business' | 'saas' | 'events' | 'services';
  categoryLabel: string;
  tagline: string;
  badge: string;
  badgeColor?: string;
  description: string;
  priceNote: string;
  palette: string[];
  features: string[];
  tags: string[];
  previewUrl: string;
  rawHtml?: string;
  livePreviewContent: {
    heroTitle: string;
    heroSubtitle: string;
    ctaText: string;
    accentColor: string;
    stats: Array<{ label: string; value: string }>;
    sectionTitle: string;
    featuresList: string[];
  };
}

export const SITE_DESIGNS: SiteDesign[] = [
  {
    id: 'atelier-luma',
    title: 'Atelier Luma — Mobilier & Décoration d’Intérieur',
    category: 'ecommerce',
    categoryLabel: 'Boutique & E-Commerce',
    tagline: 'Mobilier d’artisanat français, pièces uniques en chêne massif, noyer et lin lavé.',
    badge: 'Nouveau • En Vedette',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    description: 'Boutique e-commerce haut de gamme dédiée au mobilier durable et à la décoration intérieure artisanale, avec panier interactif, storytelling fondateur et finitions sur-mesure.',
    priceNote: '$850 • E-Commerce Pro',
    palette: ['#2A2520', '#8C7A6B', '#F9F8F6', '#EBE6E0'],
    features: [
      'Panier interactif complet avec calcul dynamique et notifications en direct',
      'Navigation fluide avec header flouté effet verre et menu responsive',
      'Catalogue de pièces maîtresses avec zoom haute fidélité au survol',
      'Storytelling de marque & savoir-faire artisanal avec fondateurs',
      'Formulaire d’adhésion au cercle Luma et footer complet',
      'Prêt pour intégration de passerelle de paiement Stripe'
    ],
    tags: ['E-Commerce', 'Artisanat', 'Mobilier Luxe', 'Panier Dynamique', 'Tailwind'],
    previewUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    rawHtml: ATELIER_LUMA_HTML,
    livePreviewContent: {
      heroTitle: 'L’élégance intemporelle pour votre intérieur.',
      heroSubtitle: 'Des pièces uniques, dessinées avec passion et fabriquées à la main par nos artisans ébénistes. Redécouvrez le charme du mobilier durable.',
      ctaText: 'Commander ce Modèle E-Commerce',
      accentColor: '#8C7A6B',
      stats: [
        { label: 'Matériaux Durables', value: '100% Chêne' },
        { label: 'Garantie Artisanale', value: '10 Ans' },
        { label: 'Score Performance', value: '99/100' }
      ],
      sectionTitle: 'Fonctionnalités Incluses dans ce Modèle',
      featuresList: [
        'Boutique e-commerce opérationnelle avec gestion complète du panier',
        'Direction artistique chaleureuse et palette raffinée Atelier Luma',
        'Tunnel d’achat prêt pour paiement Stripe sécurisé',
        'Fiches produits immersives avec zoom et sélecteurs de matières'
      ]
    }
  },
  {
    id: 'aura-studio',
    title: 'AURA — Studio Créatif & Agence Luxe',
    category: 'business',
    categoryLabel: 'Agence & Business',
    tagline: 'Design d’agence minimaliste avec typographie haute fidélité et animations fluides.',
    badge: 'Best-Seller',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    description: 'Une présence numérique d’exception pour agences de design, architectes, studios de marque et cabinets de conseil cherchant une élégance sobre et percutante.',
    priceNote: '$350 • Starter Website',
    palette: ['#0b0b10', '#181824', '#a855f7', '#f4f4f5'],
    features: [
      'Micro-interactions et transitions au scroll fluides',
      'Galerie de réalisations filtrable avec modales',
      'Formulaire de prise de contact optimisé pour la conversion',
      'Score de performance mobile 100/100'
    ],
    tags: ['Next.js', 'Tailwind', 'Dark Luxury', 'Animations Motion'],
    previewUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    livePreviewContent: {
      heroTitle: 'Nous Façonnons les Marques de Demain.',
      heroSubtitle: 'Studio de direction artistique et de développement numérique haute précision pour marques visionnaires.',
      ctaText: 'Explorer le Portfolio',
      accentColor: '#a855f7',
      stats: [
        { label: 'Projets Déployés', value: '140+' },
        { label: 'Taux de Rétention', value: '98%' },
        { label: 'Temps de Chargement', value: '0.4s' }
      ],
      sectionTitle: 'Nos Pôles d’Excellence',
      featuresList: [
        'Direction Artistique & Identité Visuelle',
        'Développement Web Haute Vitesse',
        'Stratégie de Contenu & SEO Avancé'
      ]
    }
  },
  {
    id: 'krono-luxe',
    title: 'KRONO — E-Commerce Luxe & Horlogerie',
    category: 'ecommerce',
    categoryLabel: 'Boutique & E-Commerce',
    tagline: 'Expérience d’achat prestigieuse avec fiches produits immersives et checkout Stripe sécurisé.',
    badge: 'E-Commerce Pro',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    description: 'Conçu pour les marques de luxe, créateurs de mode, horlogers et produits haut de gamme nécessitant une mise en valeur cinématographique.',
    priceNote: '$800 • E-Commerce Pro',
    palette: ['#0f0e0c', '#1c1917', '#d97706', '#fafaf9'],
    features: [
      'Tunnel de commande rapide avec paiement sécurisé Stripe',
      'Filtres de collections dynamiques (matières, prix, nouveautés)',
      'Avis clients vérifiés et gestion des stocks en direct',
      'Optimisé pour l’achat en 1 clic sur smartphone'
    ],
    tags: ['Stripe Checkout', 'Panier Temps Réel', 'Fiches 4K', 'Paiement Apple/Google Pay'],
    previewUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    livePreviewContent: {
      heroTitle: 'La Précision du Temps, Sculptée pour Vous.',
      heroSubtitle: 'Découvrez notre collection de garde-temps suisses d’exception, façonnés avec des métaux précieux certifiés.',
      ctaText: 'Commander la Collection',
      accentColor: '#d97706',
      stats: [
        { label: 'Garantie Internationale', value: '5 Ans' },
        { label: 'Livraison Sécurisée', value: '24/48h' },
        { label: 'Satisfaction Client', value: '4.9/5' }
      ],
      sectionTitle: 'Collections Emblématiques',
      featuresList: [
        'Boîtier Titane Grade 5 & Verre Saphir Inrayable',
        'Mouvement Automatique Réserve de Marche 72h',
        'Paiement en 3x ou 4x sans frais sécurisé'
      ]
    }
  },
  {
    id: 'apex-saas',
    title: 'APEX Flow — SaaS & Plateforme IA',
    category: 'saas',
    categoryLabel: 'SaaS & Copilote IA',
    tagline: 'Interface moderne avec démonstrations interactives, grille tarifaire dynamique et documentation API.',
    badge: 'Tech & IA',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    description: 'Le template idéal pour startups de la tech, outils SaaS, logiciels cloud et copilotes IA. Capte les leads et convertit les visiteurs en utilisateurs actifs.',
    priceNote: '$800 • Pack SaaS & IA',
    palette: ['#090d16', '#111827', '#06b6d4', '#f0fdfa'],
    features: [
      'Calculateur de tarification dynamique (mensuel / annuel)',
      'Tableau de bord de prévisualisation interactif',
      'Intégration d’authentification et webhook API',
      'Dark mode natif avec contrastes certifiés WCAG AA'
    ],
    tags: ['Tailwind', 'Dashboard Preview', 'Intégration API', 'Documentation'],
    previewUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    livePreviewContent: {
      heroTitle: 'Automatisez vos flux de données avec l’IA.',
      heroSubtitle: 'La plateforme de productivité connectant vos équipes, vos données et vos modèles de langage en une interface unique.',
      ctaText: 'Démarrer l’Essai Gratuit',
      accentColor: '#06b6d4',
      stats: [
        { label: 'Requêtes Traitées / sec', value: '50k+' },
        { label: 'Gain de Temps Moyen', value: '65%' },
        { label: 'Uptime Garanti', value: '99.99%' }
      ],
      sectionTitle: 'Fonctionnalités Clés du Moteur',
      featuresList: [
        'Analyse de documents et extraction instantanée',
        'Webhooks et connecteurs Zapier / Slack / CRM',
        'Sécurité de niveau bancaire avec chiffrement AES-256'
      ]
    }
  },
  {
    id: 'nova-events',
    title: 'NOVA Gala — Invitations 3D & Événements VIP',
    category: 'events',
    categoryLabel: 'Événements & Invitations',
    tagline: 'Site d’événement immersif avec compte à rebours, RSVP digitalisé, QR code et plan d’accès.',
    badge: 'Événement VIP',
    badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    description: 'Pour mariages de prestige, galas d’entreprises, lancements de produits et conférences VIP souhaitant remplacer les cartons papier par un portail digital luxueux.',
    priceNote: '$250 • Formule Gala',
    palette: ['#120e16', '#22162b', '#ec4899', '#fdf2f8'],
    features: [
      'Formulaire RSVP interactif avec choix de menus et accompagnants',
      'Génération de QR code d’accès nominatif pour chaque invité',
      'Carte interactive intégrée avec guidage GPS automatique',
      'Livre d’or digital avec téléchargement de photos souvenirs'
    ],
    tags: ['RSVP Digital', 'QR Code Pass', 'Google Maps', 'Compte à Rebours'],
    previewUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    livePreviewContent: {
      heroTitle: 'Une Soirée Inoubliable Sous les Étoiles.',
      heroSubtitle: 'Nous serions honorés de votre présence pour célébrer le Gala Annuel d’Excellence le 24 Octobre 2026.',
      ctaText: 'Confirmer ma Présence (RSVP)',
      accentColor: '#ec4899',
      stats: [
        { label: 'Jours Restants', value: '42' },
        { label: 'Invités Attendus', value: '250' },
        { label: 'Dress Code', value: 'Black Tie' }
      ],
      sectionTitle: 'Programme de la Réception',
      featuresList: [
        '19h00 : Accueil & Cocktail de Bienvenue au Salon Vénitien',
        '20h30 : Dîner Gastronomique 4 Services & Concert Philharmonique',
        '23h00 : Soirée Dansante & Clôture Féerique'
      ]
    }
  },
  {
    id: 'letoile-resto',
    title: 'L’ÉTOILE — Restaurant Étoilé & Réservations',
    category: 'services',
    categoryLabel: 'Gastronomie & Réservations',
    tagline: 'Menu interactif haute résolution, réservations de table en direct et gestion des allergènes.',
    badge: 'Restauration',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Une vitrine gourmande et raffinée pour restaurants gastronomiques, bistrots chics, bars à cocktails et traiteurs événementiels.',
    priceNote: '$350 • Starter Website',
    palette: ['#0d110f', '#16221c', '#10b981', '#f0fdf4'],
    features: [
      'Système de réservation en direct connecté par e-mail et SMS',
      'Carte des vins et menus saisonniers consultables en ligne',
      'Photos haute définition des plats phares du Chef',
      'Avis clients intégrés en temps réel'
    ],
    tags: ['Menu Interactif', 'Réservation Table', 'Avis Clients', 'SEO Local'],
    previewUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    livePreviewContent: {
      heroTitle: 'L’Art Culinaire entre Tradition et Audace.',
      heroSubtitle: 'Une cuisine d’auteur récompensée, élaborée avec les producteurs locaux les plus exigeants.',
      ctaText: 'Réserver une Table',
      accentColor: '#10b981',
      stats: [
        { label: 'Guide Michelin', value: '2 Étoiles' },
        { label: 'Cuvées Sélectionnées', value: '450+' },
        { label: 'Produits Bio & Locaux', value: '100%' }
      ],
      sectionTitle: 'Les Menus Dégustation',
      featuresList: [
        'Menu Découverte en 5 Temps — Balade en Terroir Maritime',
        'Menu Signature en 8 Temps — Accord Mets & Grands Crus Rares',
        'Service en Salle Privative pour Déjeuners d’Affaires'
      ]
    }
  },
  {
    id: 'zenith-health',
    title: 'ZENITH Clinic — Santé, Bien-être & Médical',
    category: 'services',
    categoryLabel: 'Santé & Bien-être',
    tagline: 'Portail médical épuré et rassurant avec prise de rendez-vous en ligne et présentation des praticiens.',
    badge: 'Médical & Clinique',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    description: 'Développé pour cabinets médicaux, cliniques esthétiques, dentistes, kinésithérapeutes et centres de bien-être haut de gamme.',
    priceNote: '$350 • Starter Website',
    palette: ['#0c1219', '#152232', '#3b82f6', '#eff6ff'],
    features: [
      'Synchronisation calendrier ou lien Doctolib / agenda personnalisé',
      'Fiches de présentation détaillées par spécialité et praticien',
      'Foire aux questions (FAQ) sur les consultations et remboursements',
      'Accès rapide aux consignes pré et post-opératoires'
    ],
    tags: ['Prise de RDV', 'Fiches Praticiens', 'FAQ Interactive', 'RGPD Médical'],
    previewUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    livePreviewContent: {
      heroTitle: 'Votre Santé, Guidée par des Experts Dédiés.',
      heroSubtitle: 'Centre pluridisciplinaire d’excellence associant technologies de pointe et approche humaine personnalisée.',
      ctaText: 'Prendre Rendez-vous en Ligne',
      accentColor: '#3b82f6',
      stats: [
        { label: 'Médecins Spécialistes', value: '24' },
        { label: 'Patients Accompagnés', value: '18k+' },
        { label: 'Avis Positifs', value: '99.4%' }
      ],
      sectionTitle: 'Nos Pôles Thérapeutiques',
      featuresList: [
        'Médecine Préventive & Bilan de Santé Global',
        'Dermatologie & Traitements Haute Fréquence',
        'Téléconsultation Sécurisée 7j/7'
      ]
    }
  }
];

interface VitrineSitesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDesignForProject: (design: SiteDesign) => void;
  onRequestCustomProject?: () => void;
  onLaunchApp?: (route: 'movie' | 'music' | 'weather') => void;
}

export const VitrineSitesModal: React.FC<VitrineSitesModalProps> = ({
  isOpen,
  onClose,
  onSelectDesignForProject,
  onRequestCustomProject,
  onLaunchApp
}) => {
  // Simple clean loading state (spinner only)
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Interface view states
  const [activePreviewDesign, setActivePreviewDesign] = useState<SiteDesign | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(true);
      setActivePreviewDesign(null);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Tous les Projets' },
    { id: 'ecommerce', label: 'E-Commerce' },
    { id: 'business', label: 'Agences & Luxe' },
    { id: 'saas', label: 'SaaS & IA' },
    { id: 'services', label: 'Gastronomie & Santé' },
    { id: 'events', label: 'Événements VIP' }
  ];

  const filteredDesigns = SITE_DESIGNS.filter((design) => {
    const matchesCategory = selectedCategory === 'all' || design.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;
    const matchesQuery = 
      design.title.toLowerCase().includes(query) ||
      design.tagline.toLowerCase().includes(query) ||
      design.description.toLowerCase().includes(query) ||
      design.tags.some(t => t.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-[9500] bg-[#090a12]/95 backdrop-blur-2xl flex flex-col font-sans text-gray-100 overflow-hidden animate-in fade-in duration-200">
      
      {/* ======================================================== */}
      {/* HEADER ÉPURÉ SANS BULLES                                 */}
      {/* ======================================================== */}
      <header className="h-16 bg-[#0f101a] border-b border-[#212235] px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0">
        
        {/* Left: Brand or Back button */}
        {activePreviewDesign ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePreviewDesign(null)}
              className="flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white transition-colors cursor-pointer py-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour aux vitrines</span>
            </button>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs hidden sm:inline">
              {activePreviewDesign.title}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 select-none">
            <LevelUpEcosystemStar className="w-6 h-6 text-[#a855f7]" color="currentColor" />
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
              LevelUp <span className="text-[#a855f7]">Ecosystem</span>
            </span>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {activePreviewDesign && (
            <button
              onClick={() => {
                onSelectDesignForProject(activePreviewDesign);
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
            >
              <span>Commander ce Design</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Minimal Close Button sans bulle */}
          <button
            onClick={onClose}
            className="p-1 text-white/40 hover:text-white transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* CHARGEMENT : JUSTE UN TRUC QUI TOURNE                     */}
      {/* ======================================================== */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#a855f7] animate-spin" />
        </div>
      ) : activePreviewDesign ? (
        
        /* ======================================================== */
        /* APERÇU DIRECT ET ÉPURÉ DU SITE SANS BOUTONS INUTILES     */
        /* ======================================================== */
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0a0a12] p-4 sm:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Titre & Présentation du site */}
            <div className="text-center space-y-3 pt-2">
              <span className="text-xs font-semibold text-[#a855f7] tracking-wider uppercase">
                {activePreviewDesign.categoryLabel} • {activePreviewDesign.priceNote}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {activePreviewDesign.livePreviewContent.heroTitle}
              </h1>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-xl mx-auto">
                {activePreviewDesign.livePreviewContent.heroSubtitle}
              </p>
            </div>

            {/* Statistiques clés */}
            {activePreviewDesign.livePreviewContent.stats.length > 0 && (
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/10 text-center max-w-lg mx-auto">
                {activePreviewDesign.livePreviewContent.stats.map((s, idx) => (
                  <div key={idx}>
                    <div className="text-lg sm:text-2xl font-black text-white">{s.value}</div>
                    <div className="text-[11px] text-white/40 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Visuel Haute Définition du Site */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[16/9] shadow-2xl bg-[#121320]">
              <img
                src={activePreviewDesign.previewUrl}
                alt={activePreviewDesign.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Fonctionnalités & Points Clés */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm sm:text-base font-bold text-white text-center">
                {activePreviewDesign.livePreviewContent.sectionTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {activePreviewDesign.livePreviewContent.featuresList.map((feat, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-white/80">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bouton de commande en bas */}
            <div className="pt-6 pb-4 text-center">
              <button
                onClick={() => {
                  onSelectDesignForProject(activePreviewDesign);
                  onClose();
                }}
                className="px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xl transition-all active:scale-95 cursor-pointer inline-flex items-center gap-2 hover:opacity-95"
                style={{ backgroundColor: activePreviewDesign.livePreviewContent.accentColor }}
              >
                <span>{activePreviewDesign.livePreviewContent.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      ) : (

        /* ======================================================== */
        /* INTERFACE PROPRIÉTAIRE PRO : CATALOGUE DES CRÉATIONS WEB  */
        /* ======================================================== */
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-10 space-y-6">
          
          {/* Header Titre épuré */}
          <div className="max-w-6xl mx-auto text-center space-y-2 pt-2 pb-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Nos Créations & Vitrines Web
            </h1>
            <p className="text-xs sm:text-sm text-white/50 max-w-xl mx-auto leading-relaxed">
              Découvrez nos architectures web sur-mesure et boutiques e-commerce haute performance, testables en direct.
            </p>
          </div>

          {/* ======================================================== */}
          {/* SECTION : LES VITRINES DE SITES WEB & E-COMMERCE         */}
          {/* ======================================================== */}
          <div className="max-w-6xl mx-auto space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#a855f7]" />
                  <span>Modèles de Sites & E-Commerce</span>
                </h2>
                <p className="text-xs text-white/40 mt-0.5">
                  Conçus et optimisés pour chaque secteur d’activité.
                </p>
              </div>

              {/* Search Bar */}
              <div className="flex items-center bg-[#161726] border border-[#2a2c42] focus-within:border-[#7c3aed] rounded-xl px-3 py-2 w-full md:w-72 transition-all">
                <Search className="w-4 h-4 text-white/40 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par secteur..."
                  className="w-full bg-transparent text-white text-xs outline-none placeholder-white/40"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white text-xs">
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Tabs - Propore sans bulles */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#7c3aed] text-white shadow-sm'
                      : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-1">
              {filteredDesigns.map((design) => (
                <div
                  key={design.id}
                  className="bg-[#11121e] border border-[#202235] hover:border-[#403362] rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-2xl"
                >
                  {/* Thumbnail Image sans bulles posées dessus */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                    <img 
                      src={design.previewUrl} 
                      alt={design.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#11121e] via-transparent to-transparent" />
                    
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-white drop-shadow-md truncate">
                        {design.priceNote}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-semibold text-[#c084fc]">
                        {design.categoryLabel}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#c084fc] transition-colors leading-snug">
                        {design.title}
                      </h3>
                      <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                        {design.tagline}
                      </p>
                    </div>

                    {/* Features list */}
                    <div className="space-y-1.5 pt-1 border-t border-[#1d1f30]">
                      {design.features.slice(0, 2).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-[11px] text-white/70">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-[#1d1f30] flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActivePreviewDesign(design);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#1c1d2e] hover:bg-[#282a42] text-white font-semibold text-xs transition-colors border border-[#2d2f47] flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#c084fc]" />
                        <span>Aperçu</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectDesignForProject(design);
                          onClose();
                        }}
                        className="py-2 px-3.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer shrink-0"
                      >
                        <span>Commander</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* ======================================================== */}
          {/* SECTION 3 : BANNIÈRE PROJET SUR-MESURE                   */}
          {/* ======================================================== */}
          <div className="max-w-6xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#131422] border border-[#2b2d42] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Vous avez un projet spécifique ou une référence sur-mesure ?
              </h3>
              <p className="text-xs text-white/60 max-w-xl leading-relaxed">
                LevelUp programme votre site d'abord sans acompte. Vous testez votre prototype complet en direct sur un lien privé, et vous ne réglez qu'après entière satisfaction.
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => {
                if (onRequestCustomProject) {
                  onRequestCustomProject();
                } else {
                  onSelectDesignForProject(SITE_DESIGNS[0]);
                }
                onClose();
              }}
              className="whitespace-nowrap px-5 py-3 rounded-xl bg-white hover:bg-gray-100 text-gray-950 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
            >
              Lancer un Projet Sur-Mesure
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
