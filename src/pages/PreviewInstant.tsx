import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { Link } from '../components/Link';
import { recordConsent } from '../config/legal';

// URL de l'espace Studio IA externe
export const EXTERNAL_AI_STUDIO_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_AI_STUDIO_URL) ||
  'https://studio.levelup-ecosystem.com';

export default function PreviewInstant() {
  const [consent, setConsent] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [loadingText, setLoadingText] = useState('Préparation de votre espace...');

  const handleLaunchCreation = () => {
    if (!consent || isPreparing) return;
    recordConsent('Instant Preview Generator Terms Accepted');
    setIsPreparing(true);
    setLoadingText('Préparation de votre espace...');
  };

  useEffect(() => {
    if (!isPreparing) return;

    const timer1 = setTimeout(() => {
      setLoadingText('Connexion aux modèles...');
    }, 900);

    const timer2 = setTimeout(() => {
      setLoadingText('Chargement du studio...');
    }, 1800);

    const timer3 = setTimeout(() => {
      // Redirection automatique vers l'espace Studio IA
      if (typeof window !== 'undefined') {
        window.location.href = EXTERNAL_AI_STUDIO_URL;
      }
    }, 2600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isPreparing]);

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-8 relative overflow-hidden">
      <SEO
        title="Générateur de Site IA | LevelUp Ecosystem"
        description="Générez un aperçu instantané de votre site web. Le brouillon automatisé vous donne une première vision avant la prise de relais par un ingénieur humain (livraison 4-5 jours)."
        noindex={true}
      />

      {/* Halo discret d'arrière-plan */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-[#7C3AED]/15 blur-[120px] rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-xl mx-auto">
        
        {/* Titre sobre et percutant */}
        <div className="mb-8 space-y-2 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Créer votre site avec l'IA
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1B5]">
            Un aperçu instantané généré en 1 minute, avant la finalisation sur-mesure par un développeur.
          </p>
        </div>

        {/* Cadre de confirmation Pro et Épuré */}
        <div className="rounded-3xl bg-[#14141F] border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-2xl">
          
          {/* Note claire en 3 points essentiels sans surcharge de tableaux */}
          <div className="space-y-3.5 text-xs sm:text-sm text-[#D1D1DF] leading-relaxed">
            <div className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] mt-2 shrink-0" />
              <p>
                <strong className="text-white">Résultat instantané :</strong> Le site que vous générez vous-même est un aperçu immédiat produit par des modèles d'IA pour tester votre concept.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 shrink-0" />
              <p>
                <strong className="text-white">Relais par un humain :</strong> Dès que vous choisissez votre formule, un ingénieur prend le relais pour coder votre vrai site final avec sécurité maximale, réservation en ligne et zéro bug.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DDD6FE] mt-2 shrink-0" />
              <p>
                <strong className="text-white">Délai de commande :</strong> Vous recevrez les résultats finaux de votre site sous <strong>4 à 5 jours</strong> selon les options choisies.
              </p>
            </div>
          </div>

          {/* Ligne de séparation discrète */}
          <div className="h-px bg-white/[0.08]" />

          {/* Zone d'acceptation des conditions d'utilisation */}
          <div>
            <label className="flex items-start gap-3.5 cursor-pointer text-xs sm:text-sm text-white select-none">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-white/30 bg-[#0B0B14] text-[#7C3AED] focus:ring-[#7C3AED] focus:ring-offset-0 cursor-pointer shrink-0"
              />
              <span className="leading-relaxed text-[#A1A1B5]">
                J'accepte les{' '}
                <Link to="/terms" className="text-[#A78BFA] underline font-medium hover:text-white">
                  Conditions d'utilisation
                </Link>{' '}
                et la{' '}
                <Link to="/privacy" className="text-[#A78BFA] underline font-medium hover:text-white">
                  Politique de confidentialité
                </Link>
                . Je comprends qu'un humain finalisera mon site complet sous 4 à 5 jours.
              </span>
            </label>
          </div>

          {/* Bouton officiel "Créer mon site" */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleLaunchCreation}
              disabled={!consent || isPreparing}
              className={`w-full py-4 px-6 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl ${
                consent && !isPreparing
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#A78BFA] text-white cursor-pointer shadow-[#7C3AED]/30 active:scale-[0.99]'
                  : 'bg-white/[0.06] text-[#71717A] cursor-not-allowed border border-white/[0.04]'
              }`}
            >
              <span>Créer mon site</span>
            </button>
            {!consent && (
              <p className="text-[11px] text-center text-[#71717A] mt-2">
                Cochez la case ci-dessus pour accéder à l'espace de création.
              </p>
            )}
          </div>

        </div>

      </div>

      {/* OVERLAY DE CHARGEMENT OFFICIEL LEVELUP AVEC L'ÉTOILE FACETTÉE */}
      {isPreparing && (
        <div
          className="fixed inset-0 z-50 bg-[#0B0B14]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Chargement de votre espace"
        >
          {/* Halo lumineux violet centré */}
          <div className="absolute w-80 h-80 bg-[#7C3AED]/25 rounded-full blur-[100px] pointer-events-none" />

          {/* L'Étoile Officielle LevelUp avec les 10 facettes géométriques exactes */}
          <div className="relative w-28 h-28 mb-6 flex items-center justify-center z-10">
            <svg
              className="w-24 h-24 overflow-visible filter drop-shadow-[0_0_25px_rgba(124,58,237,0.6)]"
              viewBox="0 0 100 100"
              fill="none"
              style={{
                animation: 'starBreathe 2s ease-in-out infinite',
                transformOrigin: '50px 50px',
              }}
            >
              <path className="loader-facet lf-1" d="M 50,50 L 39.42,35.44 L 50,6 Z" fill="#DDD6FE" />
              <path className="loader-facet lf-2" d="M 50,50 L 50,6 L 60.58,35.44 Z" fill="#8B5CF6" />
              <path className="loader-facet lf-3" d="M 50,50 L 60.58,35.44 L 91.85,36.4 Z" fill="#7C3AED" />
              <path className="loader-facet lf-4" d="M 50,50 L 91.85,36.4 L 67.12,55.56 Z" fill="#581C87" />
              <path className="loader-facet lf-5" d="M 50,50 L 67.12,55.56 L 75.86,85.6 Z" fill="#4C1D95" />
              <path className="loader-facet lf-6" d="M 50,50 L 75.86,85.6 L 50,68 Z" fill="#3B0764" />
              <path className="loader-facet lf-7" d="M 50,50 L 50,68 L 24.14,85.6 Z" fill="#581C87" />
              <path className="loader-facet lf-8" d="M 50,50 L 24.14,85.6 L 32.88,55.56 Z" fill="#7C3AED" />
              <path className="loader-facet lf-9" d="M 50,50 L 32.88,55.56 L 8.15,36.4 Z" fill="#8B5CF6" />
              <path className="loader-facet lf-10" d="M 50,50 L 8.15,36.4 L 39.42,35.44 Z" fill="#C4B5FD" />
            </svg>
          </div>

          {/* Une seule phrase d'animation épurée et vivante */}
          <div className="relative z-10">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide animate-pulse">
              {loadingText}
            </h2>
          </div>
        </div>
      )}

    </div>
  );
}
