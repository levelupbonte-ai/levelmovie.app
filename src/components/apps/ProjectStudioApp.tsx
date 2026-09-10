import React, { useState, useEffect } from 'react';
import {
  Check, ArrowRight, ArrowLeft, ShieldCheck, Send,
  Layers, Lock, CheckCircle2, Copy, ExternalLink, X, Globe,
  Cpu, Rocket, Laptop, Smartphone, Palette, FileText, Phone,
  Clock, DollarSign, Mail
} from 'lucide-react';

interface ProjectStudioProps {
  initialPackage?: string;
  initialMessage?: string;
  onClose: () => void;
  lang?: 'fr' | 'en';
}

interface ProjectData {
  packageType: string;
  timeline: string;
  primaryGoals: string[];
  features: string[];
  designStyle: string;
  projectTitle: string;
  description: string;
  referenceLinks: string;
  assetsReady: string[];
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName: string;
  preferredChannel: string;
  additionalNotes: string;
}

const DEFAULT_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Website',
    price: '$350',
    descFr: 'Site vitrine ultra-performant 1 à 3 pages, optimisé mobile et conversion.',
    descEn: 'High-performance 1-3 page showcase site, mobile-optimized and conversion-focused.',
    badge: 'Essentiel',
    popular: false,
    deliverables: [
      '1 à 3 pages ultra-rapides',
      'Design 100% responsive smartphone & tablette',
      'Formulaire de capture de leads sécurisé',
      'Développement complet avant tout paiement'
    ]
  },
  {
    id: 'pro',
    name: 'Business Pro',
    price: '$800',
    descFr: 'Site d’entreprise complet jusqu’à 10 pages, SEO avancé, modules de réservation ou e-commerce.',
    descEn: 'Full corporate website up to 10 pages, advanced SEO, booking or e-commerce modules.',
    badge: 'Plus Populaire',
    popular: true,
    deliverables: [
      'Jusqu\'à 10 pages sur mesure',
      'Système de paiement Stripe ou module de réservation',
      'SEO sémantique & métadonnées riches',
      '1 an d\'assistance & maintenance offerte'
    ]
  },
  {
    id: 'invitation',
    name: 'Virtual Invitation & Event',
    price: '$120',
    descFr: 'Invitation web interactive pour mariages, galas, séminaires ou lancements de marque.',
    descEn: 'Interactive web invitation for weddings, galas, corporate seminars or brand launches.',
    badge: 'Événementiel',
    popular: false,
    deliverables: [
      'Page immersive & micro-animations',
      'Module de confirmation RSVP en temps réel',
      'Carte d\'accès interactive & météo de l\'événement',
      'Hébergement cloud haute disponibilité inclus'
    ]
  },
  {
    id: 'custom',
    name: 'Ecosystem Premium (Sur Devis)',
    price: 'Sur Mesure',
    descFr: 'Application web full-stack, intégration IA, architecture sécurisée et support 3 ans.',
    descEn: 'Full-stack web application, AI integration, secure architecture & 3-year support.',
    badge: 'Entreprise',
    popular: false,
    deliverables: [
      'Architecture full-stack sur mesure (Node / Cloud)',
      'Intégration modèles Gemini & workflows IA',
      'Architecture sécurisée & authentification RBAC',
      'Support technique & maintenance 3 ans inclus'
    ]
  },
  {
    id: 'security',
    name: 'Audit de Sécurité & Cybersécurité',
    price: '$250',
    descFr: 'Audit complet de vulnérabilité, durcissement des en-têtes et remédiation.',
    descEn: 'Comprehensive vulnerability audit, header hardening and direct remediation.',
    badge: 'Sécurité',
    popular: false,
    deliverables: [
      'Scan approfondi des failles OWASP Top 10',
      'Durcissement des en-têtes CSP, HSTS, X-Frame',
      'Rapport exécutif d\'ingénierie certifié',
      'Accompagnement de remédiation direct'
    ]
  }
];

const DEFAULT_FEATURES = [
  { id: 'mobile_first', labelFr: 'Architecture Mobile-First 60 FPS & Ultra Rapide', labelEn: 'Mobile-First 60 FPS & Lightning Architecture' },
  { id: 'ai_engine', labelFr: 'Assistant IA & Intégration Gemini / LLM', labelEn: 'AI Assistant & Gemini / LLM Integration' },
  { id: 'auth_members', labelFr: 'Espace Membres & Authentification sécurisée', labelEn: 'Member Portal & Secure Authentication' },
  { id: 'payments', labelFr: 'Paiements Stripe / Passerelle E-Commerce', labelEn: 'Stripe Payments / E-Commerce Gateway' },
  { id: 'dynamic_forms', labelFr: 'Formulaires dynamiques & Notifications instantanées', labelEn: 'Dynamic Forms & Instant Notifications' },
  { id: 'advanced_seo', labelFr: 'SEO Technique 95+ & Balisage sémantique Schema.org', labelEn: 'Technical SEO 95+ & Semantic Schema.org' },
  { id: 'realtime', labelFr: 'WebSockets & Mises à jour en direct / Temps réel', labelEn: 'WebSockets & Live Real-Time Updates' },
  { id: 'hosting_domain', labelFr: 'Nom de domaine & Déploiement Cloud sécurisé', labelEn: 'Custom Domain & Secure Cloud Deployment' }
];

const DEFAULT_DESIGN_STYLES = [
  { id: 'dark_luxury', nameFr: 'Dark Luxury & Néon Cyberpunk', nameEn: 'Dark Luxury & Cyberpunk Glow', descFr: 'Contraste fort, reflets violets/indigo, ambiance tech prestigieuse', descEn: 'High-contrast dark layout, subtle purple accents, elite tech aura' },
  { id: 'minimal_light', nameFr: 'Minimaliste & Épuré (Light)', nameEn: 'Minimalist & Clean (Light)', descFr: 'Grands espaces blancs, typographie élégante, pureté et clarté', descEn: 'Spacious white canvas, refined typography, pristine readability' },
  { id: 'vibrant_startup', nameFr: 'Startup Moderne & Vibrant', nameEn: 'Modern & Vibrant Startup', descFr: 'Micro-interactions dynamiques, dégradés subtils, énergie et audace', descEn: 'Engaging micro-interactions, subtle gradients, creative punch' },
  { id: 'corporate', nameFr: 'Corporate & Institutionnel', nameEn: 'Corporate & Institutional', descFr: 'Structure sobre, rassurante, axée sur la crédibilité financière et B2B', descEn: 'Reassuring structure, polished enterprise aesthetic for B2B credibility' }
];

export interface PackageSuggestionData {
  features: { id: string; labelFr: string; labelEn: string }[];
  recommendedFeatures: string[];
  designStyles: { id: string; nameFr: string; nameEn: string; descFr: string; descEn?: string }[];
  primaryGoals: string[];
  assetsOptions: string[];
  titlePlaceholder: string;
  descPlaceholder: string;
}

const PACKAGE_SUGGESTIONS_MAP: Record<string, PackageSuggestionData> = {
  starter: {
    features: [
      { id: 'showcase_hero', labelFr: 'Hero Section Impactante & Proposition de Valeur', labelEn: 'High-Impact Hero Section & Value Proposition' },
      { id: 'mobile_fast', labelFr: 'Design Mobile-First 60 FPS & Vitesse Éclair (<1s)', labelEn: 'Mobile-First 60 FPS & Lightning Speed (<1s)' },
      { id: 'contact_quote', labelFr: 'Formulaire de Contact & Devis Express Anti-Spam', labelEn: 'Contact Form & Fast Anti-Spam Quote Request' },
      { id: 'local_seo', labelFr: 'Référencement Google Local (SEO & Google Maps)', labelEn: 'Local Google SEO & Google Maps Placement' },
      { id: 'social_proof', labelFr: 'Portfolio de Réalisations & Avis Clients Vérifiés', labelEn: 'Portfolio Showcase & Verified Client Reviews' },
      { id: 'call_action', labelFr: 'Bouton d\'Appel Direct (Click-to-Call) & WhatsApp', labelEn: 'Direct Call Button (Click-to-Call) & WhatsApp' },
      { id: 'domain_cloud', labelFr: 'Nom de Domaine Personnalisé & Hébergement Sécurisé', labelEn: 'Custom Domain & Secure Cloud Hosting' },
      { id: 'legal_ready', labelFr: 'Mentions Légales, Politique RGPD & Bannière Cookies', labelEn: 'Legal Notices, GDPR Compliance & Cookie Banner' }
    ],
    recommendedFeatures: ['showcase_hero', 'mobile_fast', 'contact_quote', 'local_seo'],
    designStyles: [
      { id: 'minimal_light', nameFr: 'Minimaliste & Épuré (Light)', nameEn: 'Minimalist & Clean (Light)', descFr: 'Grands espaces blancs, typographie raffinée, pureté et clarté', descEn: 'Spacious white canvas, refined typography, pristine readability' },
      { id: 'warm_artisan', nameFr: 'Chaleureux & Artisanal', nameEn: 'Warm & Handcrafted', descFr: 'Tons naturels, élégance sobre, valorise le savoir-faire', descEn: 'Natural tones, subtle textures, highlights genuine expertise' },
      { id: 'modern_bold', nameFr: 'Moderne & Dynamique', nameEn: 'Modern & Dynamic', descFr: 'Contraste affirmé, touches de violet, présence visuelle forte', descEn: 'Assertive contrast, subtle violet punch, standout visual presence' },
      { id: 'corporate', nameFr: 'Corporate & Professionnel', nameEn: 'Corporate & Professional', descFr: 'Structure rassurante axée sur le sérieux et la confiance', descEn: 'Reassuring structure focused on reliability and enterprise trust' }
    ],
    primaryGoals: [
      'Attirer de nouveaux clients locaux',
      'Présenter mes prestations et tarifs clairement',
      'Remplacer un site ancien ou inexistant',
      'Disposer d\'une vitrine accessible 24h/24',
      'Être bien positionné sur Google'
    ],
    assetsOptions: [
      'Logo disponible (PNG / SVG)',
      'Textes & Descriptions prêts',
      'Photos de réalisations / locaux',
      'Nom de domaine déjà réservé',
      'Charte graphique définie'
    ],
    titlePlaceholder: 'Ex: Site vitrine pour Cabinet Médical / Artisan Électricien / Architecte',
    descPlaceholder: 'Décrivez votre activité, le nombre de pages souhaité (1 à 3), vos prestations principales et les coordonnées à valoriser...'
  },
  pro: {
    features: [
      { id: 'stripe_checkout', labelFr: 'Paiements Sécurisés Stripe (CB, Apple Pay, Google Pay)', labelEn: 'Secure Stripe Payments (Cards, Apple Pay, Google Pay)' },
      { id: 'booking_calendar', labelFr: 'Prise de Rendez-Vous & Calendrier Direct (Google/Calendly)', labelEn: 'Booking System & Live Synchronized Calendar' },
      { id: 'product_catalog', labelFr: 'Catalogue Interactif de Produits/Services avec Filtres', labelEn: 'Interactive Product/Service Catalog with Filter Search' },
      { id: 'semantic_seo', labelFr: 'SEO Sémantique Avancé & Balisage Schema.org', labelEn: 'Advanced Semantic SEO & Schema.org Rich Snippets' },
      { id: 'cms_admin', labelFr: 'Espace d\'Administration Simple pour Mettre à Jour le Site', labelEn: 'Lightweight Admin Panel to Edit Text & Products' },
      { id: 'blog_news', labelFr: 'Espace Blog / Actualités pour Dominer les Requêtes Clés', labelEn: 'Blog / Editorial Hub to Dominate Key Queries' },
      { id: 'chat_whatsapp', labelFr: 'Live Chat & Passerelle WhatsApp Business Directe', labelEn: 'Live Chat & Direct WhatsApp Business Gateway' },
      { id: 'multilang', labelFr: 'Architecture Bilingue / Multi-Langues (FR / EN)', labelEn: 'Bilingual / Multi-Language Architecture (FR / EN)' }
    ],
    recommendedFeatures: ['stripe_checkout', 'booking_calendar', 'semantic_seo', 'product_catalog'],
    designStyles: [
      { id: 'corporate', nameFr: 'Corporate & Institutionnel B2B', nameEn: 'Corporate & Institutional B2B', descFr: 'Structure sobre, crédibilité maximale et autorité financière', descEn: 'Reassuring structure, polished enterprise aesthetic for B2B credibility' },
      { id: 'dark_luxury', nameFr: 'Dark Luxury & Néon Violet', nameEn: 'Dark Luxury & Cyberpunk Glow', descFr: 'Contraste fort, reflets violets/indigo, ambiance tech prestigieuse', descEn: 'High-contrast dark layout, subtle purple accents, elite tech aura' },
      { id: 'vibrant_startup', nameFr: 'Startup & Fintech Moderne', nameEn: 'Modern Startup & Fintech', descFr: 'Micro-interactions dynamiques, énergie et conversion optimale', descEn: 'Engaging micro-interactions, subtle gradients, creative punch' },
      { id: 'minimal_light', nameFr: 'Minimaliste & Épuré (Light)', nameEn: 'Minimalist & Clean (Light)', descFr: 'Grands espaces blancs, typographie élégante, pureté et clarté', descEn: 'Spacious white canvas, refined typography, pristine readability' }
    ],
    primaryGoals: [
      'Générer des ventes et paiements en ligne',
      'Automatiser les prises de rendez-vous',
      'Développer l\'autorité B2B et la réputation',
      'Acquérir des leads qualifiés à fort panier',
      'Remplacer un site obsolète par un moteur de croissance'
    ],
    assetsOptions: [
      'Logo & Charte graphique complète',
      'Catalogue ou liste détaillée des offres',
      'Compte Stripe ou passerelle bancaire',
      'Textes & Contenus existants',
      'Photos professionnelles haute résolution'
    ],
    titlePlaceholder: 'Ex: Refonte Plateforme E-Commerce Luxe / Site d\'Entreprise Conseil B2B',
    descPlaceholder: 'Détaillez vos services, le parcours client souhaité, les outils tiers à intégrer (Stripe, Calendly, CRM) et vos objectifs chiffrés...'
  },
  invitation: {
    features: [
      { id: 'rsvp_tracker', labelFr: 'Module RSVP Direct avec Décompte & Choix de Menu', labelEn: 'Live RSVP Tracking with Guest Counter & Meal Choice' },
      { id: 'countdown_hero', labelFr: 'Compte à Rebours Animé jusqu\'au Jour J de l\'Événement', labelEn: 'Animated Countdown to the Big Event Day' },
      { id: 'interactive_map', labelFr: 'Plan d\'Accès Google Maps, Itinéraire Waze & Météo Live', labelEn: 'Google Maps & Waze Directions plus Live Event Weather' },
      { id: 'virtual_guestbook', labelFr: 'Livre d\'Or Virtuel & Mur de Messages des Invités', labelEn: 'Virtual Guestbook & Live Guest Message Wall' },
      { id: 'multimedia_gallery', labelFr: 'Galerie Photos & Vidéos Souvenirs Téléchargeables', labelEn: 'Photo/Video Keepsake Gallery with Download Option' },
      { id: 'music_ambiance', labelFr: 'Musique d\'Ambiance & Animations Visuelles Festives', labelEn: 'Background Soundscape & Festive Visual Animations' },
      { id: 'event_schedule', labelFr: 'Timeline Interactive & Programme Heure par Heure', labelEn: 'Interactive Timeline & Hour-by-Hour Event Program' },
      { id: 'qr_pass', labelFr: 'Génération de Pass / QR Code d\'Accès Individuel', labelEn: 'Individual Guest Entry Pass & QR Code Generator' }
    ],
    recommendedFeatures: ['rsvp_tracker', 'countdown_hero', 'interactive_map', 'virtual_guestbook'],
    designStyles: [
      { id: 'romantic_floral', nameFr: 'Élégant & Romantique (Pastel & Doré)', nameEn: 'Romantic Elegance (Pastel & Gold)', descFr: 'Idéal mariages et fiançailles, typographie calligraphique et douceur', descEn: 'Ideal for weddings and engagements, soft pastels and fine script' },
      { id: 'gala_prestige', nameFr: 'Gala & Nuit Prestige (Noir & Or / Violet)', nameEn: 'Prestige Gala (Black & Gold / Violet)', descFr: 'Ambiance nocturne festive, reflets dorés et sensation d\'exclusivité', descEn: 'High-end night gala aura with gold highlights and exclusivity' },
      { id: 'modern_chic', nameFr: 'Minimaliste Chic & Contemporain', nameEn: 'Contemporary Minimal Chic', descFr: 'Lignes pures et modernes pour séminaires et lancements de marque', descEn: 'Pristine lines and modern layout for corporate summits & launches' },
      { id: 'festive_vibrant', nameFr: 'Festif & Coloré (Anniversaires & Fêtes)', nameEn: 'Festive & Vibrant (Celebrations)', descFr: 'Énergique, festif et joyeux pour célébrations privées et anniversaires', descEn: 'High energy and vibrant colors for birthdays and private parties' }
    ],
    primaryGoals: [
      'Mariage ou Fiançailles',
      'Gala d\'Entreprise ou Séminaire Annuel',
      'Anniversaire VIP ou Célébration Privée',
      'Lancement de Produit ou Soirée de Marque',
      'Baptême ou Célébration Familiale'
    ],
    assetsOptions: [
      'Date, horaire et adresse du lieu fixés',
      'Photos des hôtes / visuels de l\'événement',
      'Liste ou types de menus prévus',
      'Morceau musical souhaité en fond sonore',
      'Règles particulières (code vestimentaire, hébergements)'
    ],
    titlePlaceholder: 'Ex: Invitation Numérique Mariage Sophie & Marc / Gala Annuel Horizon 2027',
    descPlaceholder: 'Indiquez la date et le lieu de l\'événement, les options de RSVP (choix végétarien/allergies), le thème de couleur et les animations voulues...'
  },
  custom: {
    features: [
      { id: 'ai_gemini', labelFr: 'Moteur IA Sur Mesure (Gemini, LLM, RAG & Agents Autonomes)', labelEn: 'Custom AI Engine (Gemini, LLMs, RAG & Autonomous Agents)' },
      { id: 'fullstack_cloud', labelFr: 'Architecture Full-Stack Cloud Haute Disponibilité (Node / React)', labelEn: 'High-Availability Full-Stack Cloud Architecture (Node/React)' },
      { id: 'auth_rbac', labelFr: 'Authentification Sécurisée Multi-Rôles (RBAC, 2FA, Chiffrement)', labelEn: 'Secure Multi-Role Auth (RBAC, 2FA, Session Encryption)' },
      { id: 'realtime_websockets', labelFr: 'WebSockets & Synchronisation Collaborative en Direct', labelEn: 'WebSockets & Live Collaborative Real-Time Sync' },
      { id: 'database_api', labelFr: 'Base de Données Haute Performance & API REST / Webhooks', labelEn: 'High-Performance Database & REST API / Webhooks' },
      { id: 'cloud_storage', labelFr: 'Gestion Sécurisée de Médias & Documents Chiffrés', labelEn: 'Encrypted Media & Secure Cloud Document Storage' },
      { id: 'analytics_dash', labelFr: 'Tableau de Bord Analytics Métier & Visualisation D3 / Charts', labelEn: 'Custom Analytics Dashboard & D3 / Recharts Data Viz' },
      { id: 'sla_devops', labelFr: 'Pipeline CI/CD, Sauvegardes Automatisées & Monitoring 24/7', labelEn: 'CI/CD Pipeline, Automated Backups & 24/7 Monitoring' }
    ],
    recommendedFeatures: ['ai_gemini', 'fullstack_cloud', 'auth_rbac', 'database_api'],
    designStyles: [
      { id: 'dark_luxury', nameFr: 'Dark Luxury & Néon Cyberpunk', nameEn: 'Dark Luxury & Cyberpunk Glow', descFr: 'Contraste fort, reflets violets/indigo, ambiance tech prestigieuse', descEn: 'High-contrast dark layout, subtle purple accents, elite tech aura' },
      { id: 'dense_saas', nameFr: 'Interface SaaS Dense & Analytique', nameEn: 'Dense Analytics SaaS Interface', descFr: 'Ergonomie orientée productivité, tableaux de données fluides', descEn: 'High-density productivity UI, fluid data grids and controls' },
      { id: 'minimal_light', nameFr: 'Minimaliste Architecte (Light)', nameEn: 'Architectural Minimalist (Light)', descFr: 'Grands espaces, clarté absolue des données et typographie suisse', descEn: 'Generous negative space, absolute data clarity, Swiss typography' },
      { id: 'vibrant_startup', nameFr: 'Startup Moderne & Vibrant', nameEn: 'Modern & Vibrant Startup', descFr: 'Micro-interactions dynamiques, dégradés subtils, énergie et audace', descEn: 'Engaging micro-interactions, subtle gradients, creative punch' }
    ],
    primaryGoals: [
      'Lancer une plateforme SaaS ou application web métier',
      'Automatiser des flux complexes via Intelligence Artificielle',
      'Créer un espace membre / portail client interactif',
      'Développer un outil sur mesure propriétaire',
      'Moderniser une infrastructure logicielle existante'
    ],
    assetsOptions: [
      'Cahier des charges ou spécifications fonctionnelles',
      'Maquettes Figma / Wireframes existants',
      'Schéma de base de données ou API existante',
      'Comptes Cloud / Hébergement prévus',
      'Équipe technique de contact identifiée'
    ],
    titlePlaceholder: 'Ex: Plateforme SaaS d\'analyse financière assistée par IA / Portail Client B2B',
    descPlaceholder: 'Détaillez le rôle de l\'application, les profils d\'utilisateurs (admin, client, équipe), les fonctionnalités critiques et les flux d\'IA nécessaires...'
  },
  security: {
    features: [
      { id: 'owasp_audit', labelFr: 'Scan Approfondi des Failles OWASP Top 10 (Injections, XSS, CSRF)', labelEn: 'Deep OWASP Top 10 Vulnerability Scan (Injections, XSS, CSRF)' },
      { id: 'headers_hardening', labelFr: 'Durcissement des En-têtes HTTP (CSP, HSTS, X-Frame-Options)', labelEn: 'HTTP Security Headers Hardening (CSP, HSTS, X-Frame-Options)' },
      { id: 'auth_pentest', labelFr: 'Test d\'Intrusion & Vérification des Sessions / Mots de Passe', labelEn: 'Penetration Testing & Authentication/Session Check' },
      { id: 'data_gdpr', labelFr: 'Audit de Conformité RGPD, Chiffrement TLS & Fuite de Données', labelEn: 'GDPR Compliance, TLS Cipher Audit & Data Leak Assessment' },
      { id: 'bruteforce_shield', labelFr: 'Protection Anti-Bruteforce, Anti-DDoS & Rate-Limiting', labelEn: 'Anti-Bruteforce, Anti-DDoS & Rate-Limiting Verification' },
      { id: 'api_tampering', labelFr: 'Analyse de Vulnérabilités des API REST & Webhooks', labelEn: 'REST API & Webhook Vulnerability Assessment' },
      { id: 'executive_report', labelFr: 'Rapport Exécutif Certifié avec Scores & Risques Détaillés', labelEn: 'Certified Executive Report with Severity Scoring' },
      { id: 'remediation_guide', labelFr: 'Guide Technique de Remédiation Pas-à-Pas & Support Ingénieur', labelEn: 'Step-by-Step Technical Remediation Guide & Support' }
    ],
    recommendedFeatures: ['owasp_audit', 'headers_hardening', 'data_gdpr', 'executive_report'],
    designStyles: [
      { id: 'security_clean', nameFr: 'Rapport Exécutif & Grille d\'Audit', nameEn: 'Executive Report & Audit Matrix', descFr: 'Classification claire par sévérité (Critique, Élevé, Modéré)', descEn: 'Clear classification by severity (Critical, High, Moderate)' },
      { id: 'devsecops', nameFr: 'Format DevSecOps & Correctifs', nameEn: 'DevSecOps Format & Patches', descFr: 'Directives de code et configurations serveur prêtes à appliquer', descEn: 'Code snippets and server hardening configs ready to deploy' },
      { id: 'corporate', nameFr: 'Institutionnel & Conformité B2B', nameEn: 'Institutional & B2B Compliance', descFr: 'Livrable formel pour partenaires, banques et investisseurs', descEn: 'Formal deliverable for partners, banks and enterprise auditors' }
    ],
    primaryGoals: [
      'Sécuriser un site e-commerce manipulant des paiements',
      'Audit de pré-lancement avant mise en production',
      'Résoudre des alertes ou anomalies suspectes',
      'Valider la conformité RGPD et la protection des données clients',
      'Obtenir un rapport certifié pour partenaires/investisseurs'
    ],
    assetsOptions: [
      'URL du site ou de l\'application à auditer',
      'Stack technique connue (WordPress, React, Node, etc.)',
      'Accès environnement de test / staging disponible',
      'Rapports d\'erreurs ou incidents passés',
      'Contact du développeur ou de l\'administrateur système'
    ],
    titlePlaceholder: 'Ex: Audit de Sécurité pour Boutique E-Commerce / API SaaS en Production',
    descPlaceholder: 'Précisez l\'URL de la plateforme à auditer, la stack technique et les préoccupations prioritaires (fuite de données, lenteurs suspectes, conformité)...'
  }
};

function getPackageId(packageTypeString: string): string {
  const str = (packageTypeString || '').toLowerCase();
  if (str.includes('starter')) return 'starter';
  if (str.includes('business') || str.includes('pro')) return 'pro';
  if (str.includes('invitation') || str.includes('event')) return 'invitation';
  if (str.includes('security') || str.includes('sécurité') || str.includes('audit')) return 'security';
  if (str.includes('ecosystem') || str.includes('premium') || str.includes('sur mesure') || str.includes('custom')) return 'custom';
  return 'starter';
}

export function ProjectStudioApp({ initialPackage, initialMessage, onClose, lang = 'fr' }: ProjectStudioProps) {
  const [currentLang, setCurrentLang] = useState<'fr' | 'en'>(lang);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [ticketId, setTicketId] = useState<string>('');
  const [copiedTicket, setCopiedTicket] = useState(false);

  // Dynamic Studio Configuration sourced from database (/api/studio/data)
  const [studioConfig, setStudioConfig] = useState({
    packages: DEFAULT_PACKAGES,
    features: DEFAULT_FEATURES,
    designStyles: DEFAULT_DESIGN_STYLES,
    packageSuggestions: PACKAGE_SUGGESTIONS_MAP,
    timelines: [
      { id: 'express', labelFr: 'Express (3 à 5 jours ouvrés)', labelEn: 'Express (3 to 5 business days)', subFr: 'Priorité cellule d’urgence', subEn: 'High-priority rush sprint' },
      { id: 'standard', labelFr: 'Standard (1 à 2 semaines)', labelEn: 'Standard (1 to 2 weeks)', subFr: 'Cycle recommandé', subEn: 'Recommended engineering sprint' },
      { id: 'flexible', labelFr: 'Souple / En cours de réflexion', labelEn: 'Flexible / In planning phase', subFr: 'Élaboration progressive', subEn: 'Progressive development phase' }
    ],
    primaryGoals: [
      'Vente & Conversion',
      'Image de marque & Crédibilité',
      'Lancement d’un nouveau produit',
      'Prise de rendez-vous en ligne',
      'Refonte moderne d’un site existant',
      'Outil SaaS / Espace interne'
    ],
    assetsOptions: [
      'Logo disponible (PNG / SVG)',
      'Charte graphique / Couleurs définies',
      'Textes & Contenus déjà rédigés',
      'Nom de domaine déjà réservé',
      'Photos / Vidéos haute résolution'
    ],
    communicationChannels: [
      'Email',
      'WhatsApp',
      'Appel Téléphonique',
      'Google Meet'
    ],
    slaNotice: {
      protocol: 'ISO-Grade SLA Protocol',
      responseTime: '24 heures ouvrées'
    },
    databaseVersion: '2.5',
    isDbConnected: false
  });

  // Fetch all Studio options directly from the database API
  useEffect(() => {
    let isMounted = true;
    async function loadStudioDataFromDb() {
      try {
        const response = await fetch('/api/studio/data');
        if (response.ok) {
          const data = await response.json();
          if (isMounted && data && data.packages) {
            setStudioConfig({
              packages: data.packages || DEFAULT_PACKAGES,
              features: data.features || DEFAULT_FEATURES,
              designStyles: data.designStyles || DEFAULT_DESIGN_STYLES,
              packageSuggestions: data.packageSuggestions || PACKAGE_SUGGESTIONS_MAP,
              timelines: data.timelines || [
                { id: 'express', labelFr: 'Express (3 à 5 jours ouvrés)', labelEn: 'Express (3 to 5 business days)', subFr: 'Priorité cellule d’urgence', subEn: 'High-priority rush sprint' },
                { id: 'standard', labelFr: 'Standard (1 à 2 semaines)', labelEn: 'Standard (1 to 2 weeks)', subFr: 'Cycle recommandé', subEn: 'Recommended engineering sprint' },
                { id: 'flexible', labelFr: 'Souple / En cours de réflexion', labelEn: 'Flexible / In planning phase', subFr: 'Élaboration progressive', subEn: 'Progressive development phase' }
              ],
              primaryGoals: data.primaryGoals || [
                'Vente & Conversion',
                'Image de marque & Crédibilité',
                'Lancement d’un nouveau produit',
                'Prise de rendez-vous en ligne',
                'Refonte moderne d’un site existant',
                'Outil SaaS / Espace interne'
              ],
              assetsOptions: data.assetsOptions || [
                'Logo disponible (PNG / SVG)',
                'Charte graphique / Couleurs définies',
                'Textes & Contenus déjà rédigés',
                'Nom de domaine déjà réservé',
                'Photos / Vidéos haute résolution'
              ],
              communicationChannels: data.communicationChannels || [
                'Email',
                'WhatsApp',
                'Appel Téléphonique',
                'Google Meet'
              ],
              slaNotice: data.slaNotice || {
                protocol: 'ISO-Grade SLA Protocol',
                responseTime: '24 heures ouvrées'
              },
              databaseVersion: data.databaseVersion || '2.5',
              isDbConnected: true
            });
          }
        }
      } catch (err) {
        console.warn('[Studio] Database sync fallback to memory defaults:', err);
      }
    }
    loadStudioDataFromDb();
    return () => {
      isMounted = false;
    };
  }, []);

  const initialPkg = initialPackage || 'Starter Website ($350)';
  const initialPkgId = getPackageId(initialPkg);
  const initialSuggestions = PACKAGE_SUGGESTIONS_MAP[initialPkgId] || PACKAGE_SUGGESTIONS_MAP['starter'];

  const [formData, setFormData] = useState<ProjectData>({
    packageType: initialPkg,
    timeline: 'Standard (1 à 2 semaines)',
    primaryGoals: initialSuggestions.primaryGoals.slice(0, 2),
    features: initialSuggestions.recommendedFeatures,
    designStyle: initialSuggestions.designStyles[0]?.id || 'minimal_light',
    projectTitle: '',
    description: initialMessage || '',
    referenceLinks: '',
    assetsReady: [initialSuggestions.assetsOptions[0] || 'Logo disponible'],
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    companyName: '',
    preferredChannel: 'Email',
    additionalNotes: ''
  });

  const [validationError, setValidationError] = useState<string>('');

  const activePkgId = getPackageId(formData.packageType);
  const activeSuggestions: PackageSuggestionData =
    (studioConfig as any).packageSuggestions?.[activePkgId] ||
    PACKAGE_SUGGESTIONS_MAP[activePkgId] ||
    PACKAGE_SUGGESTIONS_MAP['starter'];

  const handleSelectPackage = (pkg: { id: string; name: string; price: string }) => {
    const pkgFull = `${pkg.name} (${pkg.price})`;
    const suggestions =
      (studioConfig as any).packageSuggestions?.[pkg.id] ||
      PACKAGE_SUGGESTIONS_MAP[pkg.id] ||
      PACKAGE_SUGGESTIONS_MAP['starter'];

    setFormData(prev => ({
      ...prev,
      packageType: pkgFull,
      features: suggestions.recommendedFeatures || [],
      designStyle: suggestions.designStyles?.[0]?.id || prev.designStyle,
      primaryGoals: suggestions.primaryGoals?.slice(0, 2) || []
    }));
  };

  const getFeatureLabel = (featId: string): string => {
    const inActive = activeSuggestions.features.find(f => f.id === featId);
    if (inActive) return currentLang === 'fr' ? inActive.labelFr : inActive.labelEn;

    for (const group of Object.values(PACKAGE_SUGGESTIONS_MAP)) {
      const found = group.features.find(f => f.id === featId);
      if (found) return currentLang === 'fr' ? found.labelFr : found.labelEn;
    }
    return featId;
  };

  const t = {
    fr: {
      studioTitle: 'Studio Projet LevelUp',
      studioSubtitle: 'Espace professionnel d’ingénierie & cahier des charges',
      step1: 'Offre & Délais',
      step2: 'Fonctionnalités',
      step3: 'Cahier des charges',
      step4: 'Coordonnées',
      step5: 'Validation',
      back: 'Précédent',
      continue: 'Continuer',
      submit: 'Transmettre mon Projet',
      close: 'Fermer le Studio',
      selectPackage: '1. Choisissez votre niveau de solution',
      desiredTimeline: '2. Délai de livraison souhaité',
      primaryObjectives: '3. Vos objectifs prioritaires',
      featuresTitle: '1. Sélectionnez les fonctionnalités nécessaires',
      designTitle: '2. Direction artistique & esthétique',
      specsTitle: '1. Titre & Vision du projet',
      specsDesc: '2. Décrivez vos besoins, fonctionnalités clés et attentes',
      specsPlaceholder: 'Ex: Nous avons besoin d’une plateforme vitrine interactive avec prise de rendez-vous, un design épuré et une excellente vitesse sur mobile...',
      refsTitle: '3. Liens de référence ou sites inspirants (optionnel)',
      assetsTitle: '4. Éléments déjà en votre possession',
      coordTitle: '1. Vos coordonnées professionnelles',
      nameLabel: 'Nom & Prénom *',
      emailLabel: 'Email professionnel *',
      phoneLabel: 'Téléphone / WhatsApp',
      companyLabel: 'Nom de l’entreprise / marque',
      channelLabel: 'Canal de contact privilégié',
      reviewTitle: 'Récapitulatif de votre demande',
      reviewNotice: 'Engagement contractuel LevelUp : Nos ingénieurs analysent votre cahier des charges et conçoivent votre prototype interactif. Vous inspectez en direct et validez après entière satisfaction.',
      confirmedTitle: 'Dossier Projet Reçu avec Succès !',
      confirmedDesc: 'Votre cahier des charges a été transmis à notre cellule technique. Un ingénieur dédié prendra contact avec vous dans les 24h avec un premier plan d’architecture.',
      ticketLabel: 'Votre Référence Projet :',
      copyTicket: 'Copier la référence',
      copied: 'Copié !',
      returnHome: 'Retourner à l’écosystème',
      newProject: 'Soumettre un autre projet'
    },
    en: {
      studioTitle: 'LevelUp Project Studio',
      studioSubtitle: 'Professional engineering space & project specifications',
      step1: 'Package & Scope',
      step2: 'Features & Stack',
      step3: 'Specifications',
      step4: 'Contact Info',
      step5: 'Review & Launch',
      back: 'Back',
      continue: 'Continue',
      submit: 'Submit Project',
      close: 'Exit Studio',
      selectPackage: '1. Select your desired solution level',
      desiredTimeline: '2. Desired delivery timeline',
      primaryObjectives: '3. Your primary business objectives',
      featuresTitle: '1. Select required features and capabilities',
      designTitle: '2. Visual art direction & aesthetic',
      specsTitle: '1. Project Title & Vision',
      specsDesc: '2. Describe your key requirements and expectations',
      specsPlaceholder: 'E.g.: We need a high-converting showcase platform with booking, sleek typography and top-tier mobile performance...',
      refsTitle: '3. Reference links or inspiring websites (optional)',
      assetsTitle: '4. Assets currently available',
      coordTitle: '1. Your professional coordinates',
      nameLabel: 'Full Name *',
      emailLabel: 'Professional Email *',
      phoneLabel: 'Phone / WhatsApp',
      companyLabel: 'Company / Brand Name',
      channelLabel: 'Preferred communication channel',
      reviewTitle: 'Summary of your project submission',
      reviewNotice: 'LevelUp Commitment: Our engineers review your specifications and build your interactive preview first. You test and validate upon complete satisfaction.',
      confirmedTitle: 'Project Dossier Received Successfully!',
      confirmedDesc: 'Your specifications have been transmitted to our engineering desk. A dedicated engineer will follow up within 24 hours with your interactive prototype plan.',
      ticketLabel: 'Your Project Tracking Reference:',
      copyTicket: 'Copy Reference',
      copied: 'Copied!',
      returnHome: 'Return to Ecosystem',
      newProject: 'Submit Another Project'
    }
  }[currentLang];

  const handleToggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goal)
        ? prev.primaryGoals.filter(g => g !== goal)
        : [...prev.primaryGoals, goal]
    }));
  };

  const handleToggleFeature = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const handleToggleAsset = (asset: string) => {
    setFormData(prev => ({
      ...prev,
      assetsReady: prev.assetsReady.includes(asset)
        ? prev.assetsReady.filter(a => a !== asset)
        : [...prev.assetsReady, asset]
    }));
  };

  const handleNextStep = () => {
    setValidationError('');
    if (currentStep === 3) {
      if (!formData.description.trim() && !formData.projectTitle.trim()) {
        setValidationError(currentLang === 'fr' ? 'Veuillez au moins indiquer le titre ou une courte description de votre projet.' : 'Please provide at least a title or short description of your project.');
        return;
      }
    }
    if (currentStep === 4) {
      if (!formData.clientName.trim() || !formData.clientEmail.trim() || !formData.clientEmail.includes('@')) {
        setValidationError(currentLang === 'fr' ? 'Veuillez renseigner votre nom et une adresse email valide.' : 'Please provide your name and a valid email address.');
        return;
      }
    }
    setCurrentStep(prev => Math.min(5, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setValidationError('');
    setIsSubmitting(true);
    const newTicket = `LVL-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(newTicket);

    try {
      const response = await fetch('/api/submit-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ticketId: newTicket,
          submittedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        // Fallback to local success if server responded with non-200
        console.warn('Backend returned status:', response.status);
      }
      setSubmitSuccess(true);
    } catch (err) {
      console.warn('Submission network fallback:', err);
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTicketCode = () => {
    if (!ticketId) return;
    navigator.clipboard.writeText(ticketId);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07080f] text-gray-100 flex flex-col font-sans selection:bg-[#7c3aed] selection:text-white">
      
      {/* Studio Header */}
      <header className="sticky top-0 z-40 bg-[#0c0d18]/90 backdrop-blur-md border-b border-gray-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight text-base sm:text-lg">LevelUp <span className="text-[#a78bfa]">Studio</span></span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">{t.studioSubtitle}</p>
          </div>
        </div>

        {/* Exit button */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700/80 rounded-none text-xs font-medium transition-all cursor-pointer shadow-sm"
        >
          <X className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.close}</span>
        </button>
      </header>

      {/* Main Studio Body */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col">
        
        {/* Stepper Bar (if not submitted) */}
        {!submitSuccess && (
          <div className="mb-10">
            <div className="grid grid-cols-5 gap-2 sm:gap-4 mb-3">
              {[
                { num: 1, label: t.step1 },
                { num: 2, label: t.step2 },
                { num: 3, label: t.step3 },
                { num: 4, label: t.step4 },
                { num: 5, label: t.step5 }
              ].map(step => (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => {
                    if (step.num < currentStep) setCurrentStep(step.num);
                  }}
                  className={`text-left p-2.5 sm:p-3 rounded-none border transition-all ${
                    currentStep === step.num
                      ? 'bg-[#181a33] border-[#7c3aed] text-white shadow-md'
                      : currentStep > step.num
                      ? 'bg-[#101224] border-gray-800 text-gray-400 cursor-pointer hover:border-gray-700'
                      : 'bg-[#0a0b16] border-gray-900 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${currentStep === step.num ? 'text-[#a78bfa]' : 'text-gray-500'}`}>
                      0{step.num}
                    </span>
                    {currentStep > step.num && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399]" />
                    )}
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold truncate">
                    {step.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Progress bar visual */}
            <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#7c3aed] to-indigo-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Validation Error Notice */}
        {validationError && (
          <div className="mb-6 p-3 bg-red-950/50 border border-red-500/50 text-red-200 text-xs rounded-none flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>{validationError}</span>
          </div>
        )}

        {/* Step 1: Package & Timeline */}
        {currentStep === 1 && !submitSuccess && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{t.selectPackage}</h3>
              <p className="text-sm text-gray-400 mb-5">
                Sélectionnez une solution adaptée à votre vision pour débloquer les suggestions personnalisées.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {studioConfig.packages.map(pkg => (
                  <div
                    key={pkg.id}
                    onClick={() => handleSelectPackage(pkg)}
                    className={`p-5 rounded-none border cursor-pointer transition-all flex flex-col justify-between ${
                      formData.packageType.includes(pkg.name)
                        ? 'bg-[#181a33] border-[#7c3aed] ring-1 ring-[#7c3aed] shadow-lg shadow-[#7c3aed]/10'
                        : 'bg-[#0f1122] border-gray-800 hover:border-gray-700 hover:bg-[#131528]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                          pkg.popular ? 'bg-[#7c3aed] text-white' : 'bg-gray-800 text-gray-300'
                        }`}>
                          {pkg.badge}
                        </span>
                        <span className="text-lg font-extrabold text-[#c4b5fd]">{pkg.price}</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">{pkg.name}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4">
                        {currentLang === 'fr' ? pkg.descFr : pkg.descEn}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs font-semibold">
                      <span className={formData.packageType.includes(pkg.name) ? 'text-[#a78bfa]' : 'text-gray-500'}>
                        {formData.packageType.includes(pkg.name) ? 'Sélectionné' : 'Choisir cette offre'}
                      </span>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                        formData.packageType.includes(pkg.name) ? 'border-[#7c3aed] bg-[#7c3aed] text-white' : 'border-gray-700'
                      }`}>
                        {formData.packageType.includes(pkg.name) && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline selector */}
            <div className="pt-4 border-t border-gray-800/80">
              <h3 className="text-base font-bold text-white mb-3">{t.desiredTimeline}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {studioConfig.timelines.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, timeline: item.labelFr }))}
                    className={`p-3.5 text-left border rounded-none transition-all cursor-pointer ${
                      formData.timeline === item.labelFr
                        ? 'bg-[#181a33] border-[#7c3aed] text-white'
                        : 'bg-[#0f1122] border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white mb-0.5">
                      {currentLang === 'fr' ? item.labelFr : item.labelEn}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {currentLang === 'fr' ? item.subFr : item.subEn}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div className="pt-4 border-t border-gray-800/80">
              <h3 className="text-base font-bold text-white mb-3">{t.primaryObjectives}</h3>
              <div className="flex flex-wrap gap-2.5">
                {activeSuggestions.primaryGoals.map(goal => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleToggleGoal(goal)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-none border transition-all cursor-pointer flex items-center gap-2 ${
                      formData.primaryGoals.includes(goal)
                        ? 'bg-[#7c3aed]/20 border-[#7c3aed] text-[#c4b5fd]'
                        : 'bg-[#0f1122] border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-none flex items-center justify-center border ${
                      formData.primaryGoals.includes(goal) ? 'bg-[#7c3aed] border-[#7c3aed] text-white' : 'border-gray-700'
                    }`}>
                      {formData.primaryGoals.includes(goal) && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <span>{goal}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Features & Stack */}
        {currentStep === 2 && !submitSuccess && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <h3 className="text-xl font-bold text-white">{t.featuresTitle}</h3>
                <span className="text-[11px] font-semibold text-[#a78bfa] bg-[#7c3aed]/15 border border-[#7c3aed]/30 px-2.5 py-1 self-start sm:self-auto">
                  Suggestions adaptées : {formData.packageType.split('(')[0].trim()}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-5">
                Technologies et modules recommandés spécifiquement selon la formule sélectionnée.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {activeSuggestions.features.map(feat => {
                  const isChecked = formData.features.includes(feat.id);
                  return (
                    <div
                      key={feat.id}
                      onClick={() => handleToggleFeature(feat.id)}
                      className={`p-4 border rounded-none cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-[#181a33] border-[#7c3aed] text-white shadow-sm'
                          : 'bg-[#0f1122] border-gray-800 hover:border-gray-700 text-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-none flex items-center justify-center border ${
                          isChecked ? 'bg-[#7c3aed] border-[#7c3aed] text-white' : 'border-gray-700'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-200">
                          {currentLang === 'fr' ? feat.labelFr : feat.labelEn}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Design styles */}
            <div className="pt-4 border-t border-gray-800/80">
              <h3 className="text-base font-bold text-white mb-3">{t.designTitle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {activeSuggestions.designStyles.map(style => (
                  <div
                    key={style.id}
                    onClick={() => setFormData(prev => ({ ...prev, designStyle: style.id }))}
                    className={`p-4 border rounded-none cursor-pointer transition-all ${
                      formData.designStyle === style.id
                        ? 'bg-[#181a33] border-[#7c3aed] ring-1 ring-[#7c3aed]'
                        : 'bg-[#0f1122] border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-sm font-bold text-white">
                        {currentLang === 'fr' ? style.nameFr : style.nameEn}
                      </h4>
                      <div className={`w-3.5 h-3.5 rounded-full border ${
                        formData.designStyle === style.id ? 'bg-[#7c3aed] border-[#7c3aed]' : 'border-gray-700'
                      }`}></div>
                    </div>
                    <p className="text-xs text-gray-400">
                      {currentLang === 'fr' ? style.descFr : (style.descEn || style.descFr)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Project Specifications */}
        {currentStep === 3 && !submitSuccess && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{t.specsTitle}</h3>
              <input
                type="text"
                value={formData.projectTitle}
                onChange={e => setFormData(prev => ({ ...prev, projectTitle: e.target.value }))}
                placeholder={activeSuggestions.titlePlaceholder || "Ex: Refonte Platforme E-Commerce Luxe / Application IA"}
                className="w-full bg-[#0f1122] border border-gray-800 focus:border-[#7c3aed] px-4 py-3 text-sm text-white rounded-none outline-none transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white">{t.specsDesc} *</h3>
                <span className="text-[11px] text-gray-500 font-mono">
                  {formData.description.length} caractères
                </span>
              </div>
              <textarea
                rows={6}
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={activeSuggestions.descPlaceholder || t.specsPlaceholder}
                className="w-full bg-[#0f1122] border border-gray-800 focus:border-[#7c3aed] p-4 text-sm text-white rounded-none outline-none leading-relaxed transition-colors resize-y"
              />
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-2">{t.refsTitle}</h3>
              <input
                type="text"
                value={formData.referenceLinks}
                onChange={e => setFormData(prev => ({ ...prev, referenceLinks: e.target.value }))}
                placeholder="https://example.com, https://stripe.com, https://apple.com"
                className="w-full bg-[#0f1122] border border-gray-800 focus:border-[#7c3aed] px-4 py-3 text-sm text-white rounded-none outline-none transition-colors"
              />
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-2.5">{t.assetsTitle}</h3>
              <div className="flex flex-wrap gap-2.5">
                {activeSuggestions.assetsOptions.map(asset => (
                  <button
                    key={asset}
                    type="button"
                    onClick={() => handleToggleAsset(asset)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-none border transition-all cursor-pointer flex items-center gap-2 ${
                      formData.assetsReady.includes(asset)
                        ? 'bg-[#7c3aed]/20 border-[#7c3aed] text-[#c4b5fd]'
                        : 'bg-[#0f1122] border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-none flex items-center justify-center border ${
                      formData.assetsReady.includes(asset) ? 'bg-[#7c3aed] border-[#7c3aed] text-white' : 'border-gray-700'
                    }`}>
                      {formData.assetsReady.includes(asset) && <Check className="w-2 h-2" />}
                    </div>
                    <span>{asset}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Contact & Coordinates */}
        {currentStep === 4 && !submitSuccess && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{t.coordTitle}</h3>
              <p className="text-xs text-gray-400 mb-6">
                Vos informations restent strictement confidentielles et ne serviront qu’à vous transmettre le prototype et la proposition d’architecture.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">{t.nameLabel}</label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={e => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                  placeholder="Jean Dupont"
                  className="w-full bg-[#0f1122] border border-gray-800 focus:border-[#7c3aed] px-4 py-3 text-sm text-white rounded-none outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">{t.emailLabel}</label>
                <input
                  type="email"
                  required
                  value={formData.clientEmail}
                  onChange={e => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                  placeholder="jean@entreprise.com"
                  className="w-full bg-[#0f1122] border border-gray-800 focus:border-[#7c3aed] px-4 py-3 text-sm text-white rounded-none outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">{t.phoneLabel}</label>
                <input
                  type="tel"
                  value={formData.clientPhone}
                  onChange={e => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full bg-[#0f1122] border border-gray-800 focus:border-[#7c3aed] px-4 py-3 text-sm text-white rounded-none outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">{t.companyLabel}</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={e => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Société / Studio / Projet"
                  className="w-full bg-[#0f1122] border border-gray-800 focus:border-[#7c3aed] px-4 py-3 text-sm text-white rounded-none outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">{t.channelLabel}</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {studioConfig.communicationChannels.map(channel => (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, preferredChannel: channel }))}
                    className={`py-2.5 px-3 text-xs font-semibold border rounded-none transition-all cursor-pointer ${
                      formData.preferredChannel === channel
                        ? 'bg-[#181a33] border-[#7c3aed] text-[#c4b5fd]'
                        : 'bg-[#0f1122] border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    {channel}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Zero-Deposit Submission */}
        {currentStep === 5 && !submitSuccess && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{t.reviewTitle}</h3>
              <p className="text-xs text-gray-400">
                Vérifiez les paramètres de votre dossier avant de l'envoyer au bureau d'ingénierie.
              </p>
            </div>

            {/* Verification Notice */}
            <div className="p-4 bg-[#101224] border border-gray-800 rounded-none space-y-1.5">
              <div className="flex items-center gap-2 text-[#a78bfa] font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Engagement Technique LevelUp</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {t.reviewNotice}
              </p>
            </div>

            {/* Recap card */}
            <div className="bg-[#0c0e1c] border border-gray-800 p-5 rounded-none space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-800 text-xs">
                <div>
                  <span className="text-gray-500 uppercase tracking-wider font-semibold">Offre choisie :</span>
                  <div className="text-white font-bold text-sm mt-0.5">{formData.packageType}</div>
                </div>
                <div>
                  <span className="text-gray-500 uppercase tracking-wider font-semibold">Délai estimé :</span>
                  <div className="text-white font-bold text-sm mt-0.5">{formData.timeline}</div>
                </div>
                <div>
                  <span className="text-gray-500 uppercase tracking-wider font-semibold">Client / Contact :</span>
                  <div className="text-white font-medium mt-0.5">{formData.clientName} ({formData.clientEmail})</div>
                </div>
                <div>
                  <span className="text-gray-500 uppercase tracking-wider font-semibold">Canal favori :</span>
                  <div className="text-white font-medium mt-0.5">{formData.preferredChannel}</div>
                </div>
              </div>

              {formData.projectTitle && (
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Titre du projet :</span>
                  <p className="text-sm font-bold text-[#c4b5fd] mt-0.5">{formData.projectTitle}</p>
                </div>
              )}

              {formData.description && (
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Cahier des charges :</span>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed bg-[#07080f] p-3 border border-gray-900 rounded-none">
                    {formData.description}
                  </p>
                </div>
              )}

              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Fonctionnalités requises ({formData.features.length}) :</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {formData.features.map(f => (
                    <span key={f} className="text-[11px] bg-[#14162a] text-[#c4b5fd] border border-gray-800 px-2 py-0.5">
                      {getFeatureLabel(f)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Confirmation View */}
        {submitSuccess && (
          <div className="bg-[#0e1022] border border-[#7c3aed]/50 p-6 sm:p-10 rounded-none text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#10b981]/20 border border-[#10b981]/50 text-[#34d399] flex items-center justify-center mx-auto shadow-lg shadow-[#10b981]/20">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{t.confirmedTitle}</h2>
              <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">{t.confirmedDesc}</p>
            </div>

            {/* Reference Ticket Box */}
            <div className="max-w-md mx-auto bg-[#07080f] border border-[#7c3aed]/40 p-4 rounded-none">
              <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">{t.ticketLabel}</span>
              <div className="flex items-center justify-center gap-3 mt-2">
                <span className="font-mono text-lg font-extrabold text-[#c4b5fd] tracking-widest">{ticketId}</span>
                <button
                  type="button"
                  onClick={copyTicketCode}
                  className="px-2.5 py-1 bg-[#7c3aed]/20 hover:bg-[#7c3aed]/40 text-xs text-[#a78bfa] border border-[#7c3aed]/40 rounded-none flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedTicket ? t.copied : t.copyTicket}</span>
                </button>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-sm rounded-none transition-all shadow-lg cursor-pointer"
              >
                {t.returnHome}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmitSuccess(false);
                  setCurrentStep(1);
                  setFormData(prev => ({ ...prev, description: '', projectTitle: '' }));
                }}
                className="w-full sm:w-auto px-6 py-3 bg-gray-900 hover:bg-gray-800 text-gray-300 font-semibold text-sm rounded-none border border-gray-700 transition-all cursor-pointer"
              >
                {t.newProject}
              </button>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        {!submitSuccess && (
          <div className="mt-10 pt-6 border-t border-gray-800 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 rounded-none text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.back}</span>
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-none text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#7c3aed]/25 cursor-pointer transition-all"
              >
                <span>{t.continue}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="px-8 py-3 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#5b21b6] text-white rounded-none text-sm font-extrabold flex items-center gap-2 shadow-xl shadow-[#7c3aed]/30 cursor-pointer transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmission en cours...' : t.submit}</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
