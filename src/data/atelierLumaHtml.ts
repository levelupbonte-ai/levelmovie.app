export const ATELIER_LUMA_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atelier Luma | Mobilier & Décoration d'Intérieur</title>
    
    <!-- Fonts: Playfair Display pour l'élégance, Inter pour la lisibilité -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <!-- Phosphor Icons pour des icônes professionnelles et fines -->
    <script src="https://unpkg.com/@phosphor-icons/web"></script>

    <!-- Tailwind CSS pour le style sur mesure -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        serif: ['Playfair Display', 'serif'],
                    },
                    colors: {
                        luma: {
                            50: '#F9F8F6',  /* Fond très clair et chaud */
                            100: '#EBE6E0', /* Bordures douces */
                            500: '#8C7A6B', /* Accentuation douce */
                            800: '#4A4036', /* Texte secondaire */
                            900: '#2A2520', /* Texte principal, presque noir */
                        }
                    },
                    animation: {
                        'fade-in': 'fadeIn 1s ease-out',
                        'slide-up': 'slideUp 0.8s ease-out forwards',
                    },
                    keyframes: {
                        fadeIn: {
                            '0%': { opacity: '0' },
                            '100%': { opacity: '1' },
                        },
                        slideUp: {
                            '0%': { opacity: '0', transform: 'translateY(20px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' },
                        }
                    }
                }
            }
        }
    </script>
    <style>
        /* Styles personnalisés pour des finitions parfaites */
        html { scroll-behavior: smooth; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .glass-nav {
            background: rgba(249, 248, 246, 0.9);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(235, 230, 224, 0.5);
        }
        .image-hover-zoom {
            transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .product-card:hover .image-hover-zoom {
            transform: scale(1.05);
        }
        
        /* Toast notification style */
        #toast {
            visibility: hidden;
            opacity: 0;
            transition: visibility 0s, opacity 0.3s linear;
        }
        #toast.show {
            visibility: visible;
            opacity: 1;
        }
    </style>
</head>
<body class="bg-luma-50 text-luma-900 font-sans antialiased overflow-x-hidden">

    <nav id="navbar" class="fixed w-full z-50 transition-all duration-300 py-4 glass-nav">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center">
                <!-- Menu Mobile Icon -->
                <div class="md:hidden flex items-center">
                    <button id="mobile-menu-btn" class="text-luma-900 focus:outline-none">
                        <i class="ph ph-list text-2xl"></i>
                    </button>
                </div>

                <!-- Logo -->
                <a href="#" class="font-serif text-2xl font-bold tracking-wider flex-shrink-0 text-center md:text-left flex-1 md:flex-none">
                    Atelier Luma<span class="text-luma-500">.</span>
                </a>

                <!-- Desktop Menu -->
                <div class="hidden md:flex space-x-10 items-center justify-center flex-1">
                    <a href="#collection" class="text-sm tracking-wide text-luma-800 hover:text-luma-900 transition-colors">La Collection</a>
                    <a href="#artisanat" class="text-sm tracking-wide text-luma-800 hover:text-luma-900 transition-colors">Notre Savoir-Faire</a>
                    <a href="#contact" class="text-sm tracking-wide text-luma-800 hover:text-luma-900 transition-colors">Contact</a>
                </div>

                <!-- Cart & Account -->
                <div class="flex items-center space-x-4 flex-shrink-0">
                    <button class="text-luma-900 hover:text-luma-500 transition-colors hidden sm:block" onclick="openLoginModal()">
                        <i class="ph ph-user text-xl"></i>
                    </button>
                    <button class="text-luma-900 hover:text-luma-500 transition-colors relative" onclick="toggleCart()">
                        <i class="ph ph-shopping-bag text-xl"></i>
                        <span id="cart-count" class="absolute -top-1 -right-2 bg-luma-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">0</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Menu Dropdown -->
        <div id="mobile-menu" class="hidden md:hidden absolute w-full bg-luma-50 border-b border-luma-100 shadow-lg">
            <div class="px-4 pt-2 pb-6 space-y-4">
                <a href="#collection" class="block text-base text-luma-800 hover:text-luma-900 py-2 border-b border-luma-100">La Collection</a>
                <a href="#artisanat" class="block text-base text-luma-800 hover:text-luma-900 py-2 border-b border-luma-100">Notre Savoir-Faire</a>
                <a href="#contact" class="block text-base text-luma-800 hover:text-luma-900 py-2">Contact</a>
            </div>
        </div>
    </nav>

    <header class="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <!-- Image de fond -->
        <div class="absolute inset-0 w-full h-full">
            <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1920&q=80" alt="Intérieur design épuré" class="w-full h-full object-cover object-center" />
            <!-- Overlay doux pour la lisibilité -->
            <div class="absolute inset-0 bg-black/20"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-luma-50/90 via-transparent to-transparent"></div>
        </div>

        <!-- Contenu texte -->
        <div class="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in mt-16">
            <span class="block text-sm uppercase tracking-[0.2em] text-white/90 mb-4 font-medium">Nouvelle collection d'automne</span>
            <h1 class="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-md">
                L'élégance intemporelle pour votre intérieur.
            </h1>
            <p class="text-lg text-white/90 mb-10 max-w-2xl mx-auto font-light drop-shadow">
                Des pièces uniques, dessinées avec passion et fabriquées à la main par nos artisans ébénistes. Redécouvrez le charme du mobilier durable.
            </p>
            <a href="#collection" class="inline-block bg-white text-luma-900 px-10 py-4 font-medium tracking-wide hover:bg-luma-900 hover:text-white transition-all duration-300 border border-transparent shadow-lg hover:shadow-xl">
                Découvrir les créations
            </a>
        </div>
    </header>

    <section class="bg-luma-900 text-luma-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-luma-800">
                <div class="p-4 flex flex-col items-center">
                    <i class="ph ph-truck text-3xl mb-3 text-luma-500"></i>
                    <h3 class="font-serif text-lg mb-2">Livraison sur-mesure</h3>
                    <p class="text-sm text-luma-100/70 font-light">Partout en Europe, avec installation à domicile par nos experts.</p>
                </div>
                <div class="p-4 flex flex-col items-center">
                    <i class="ph ph-leaf text-3xl mb-3 text-luma-500"></i>
                    <h3 class="font-serif text-lg mb-2">Matériaux durables</h3>
                    <p class="text-sm text-luma-100/70 font-light">Bois massif issu de forêts éco-gérées françaises.</p>
                </div>
                <div class="p-4 flex flex-col items-center">
                    <i class="ph ph-medal text-3xl mb-3 text-luma-500"></i>
                    <h3 class="font-serif text-lg mb-2">Garantie 10 ans</h3>
                    <p class="text-sm text-luma-100/70 font-light">La certitude d'un savoir-faire fait pour traverser le temps.</p>
                </div>
            </div>
        </div>
    </section>

    <section id="collection" class="py-24 bg-luma-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-end mb-12">
                <div>
                    <h2 class="text-3xl md:text-4xl font-serif text-luma-900 mb-3">Nos Pièces Maîtresses</h2>
                    <p class="text-luma-800 font-light">Conçues pour s'intégrer harmonieusement dans vos espaces de vie.</p>
                </div>
                <a href="#" class="hidden md:flex items-center text-sm font-medium border-b border-luma-900 pb-1 hover:text-luma-500 hover:border-luma-500 transition-colors">
                    Voir toute la boutique <i class="ph ph-arrow-right ml-2"></i>
                </a>
            </div>

            <!-- Grille de produits -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                
                <!-- Produit 1 -->
                <div class="product-card group cursor-pointer">
                    <div class="relative overflow-hidden mb-4 bg-luma-100 aspect-[3/4]">
                        <img src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80" alt="Fauteuil Céleste" class="w-full h-full object-cover object-center image-hover-zoom">
                        <!-- Bouton d'ajout rapide (visible au survol) -->
                        <div class="absolute bottom-4 left-0 right-0 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button onclick="addToCart('Fauteuil Céleste', 850)" class="w-full bg-white/95 text-luma-900 py-3 text-sm font-medium hover:bg-luma-900 hover:text-white transition-colors shadow-lg flex justify-center items-center gap-2">
                                <i class="ph ph-shopping-bag"></i> Ajouter au panier
                            </button>
                        </div>
                    </div>
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-lg font-serif text-luma-900 mb-1">Fauteuil "Céleste"</h3>
                            <p class="text-sm text-luma-500 font-light">Chêne massif & Tissu bouclette</p>
                        </div>
                        <span class="text-lg font-medium text-luma-900">$850</span>
                    </div>
                </div>

                <!-- Produit 2 -->
                <div class="product-card group cursor-pointer">
                    <div class="relative overflow-hidden mb-4 bg-luma-100 aspect-[3/4]">
                        <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" alt="Chaise de salle à manger" class="w-full h-full object-cover object-center image-hover-zoom">
                        <div class="absolute bottom-4 left-0 right-0 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button onclick="addToCart('Chaise Aube', 240)" class="w-full bg-white/95 text-luma-900 py-3 text-sm font-medium hover:bg-luma-900 hover:text-white transition-colors shadow-lg flex justify-center items-center gap-2">
                                <i class="ph ph-shopping-bag"></i> Ajouter au panier
                            </button>
                        </div>
                    </div>
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-lg font-serif text-luma-900 mb-1">Chaise "Aube"</h3>
                            <p class="text-sm text-luma-500 font-light">Noyer & Cuir naturel</p>
                        </div>
                        <span class="text-lg font-medium text-luma-900">$240</span>
                    </div>
                </div>

                <!-- Produit 3 -->
                <div class="product-card group cursor-pointer">
                    <div class="relative overflow-hidden mb-4 bg-luma-100 aspect-[3/4]">
                        <img src="https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=800&q=80" alt="Canapé 3 places" class="w-full h-full object-cover object-center image-hover-zoom">
                        <div class="absolute bottom-4 left-0 right-0 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button onclick="addToCart('Canapé Crépuscule', 1890)" class="w-full bg-white/95 text-luma-900 py-3 text-sm font-medium hover:bg-luma-900 hover:text-white transition-colors shadow-lg flex justify-center items-center gap-2">
                                <i class="ph ph-shopping-bag"></i> Ajouter au panier
                            </button>
                        </div>
                        <!-- Badge Nouveauté -->
                        <span class="absolute top-4 left-4 bg-luma-900 text-white text-xs px-2 py-1 uppercase tracking-wider">Nouveau</span>
                    </div>
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-lg font-serif text-luma-900 mb-1">Canapé "Crépuscule"</h3>
                            <p class="text-sm text-luma-500 font-light">Lin lavé 3 places</p>
                        </div>
                        <span class="text-lg font-medium text-luma-900">$1,890</span>
                    </div>
                </div>

                <!-- Produit 4 -->
                <div class="product-card group cursor-pointer">
                    <div class="relative overflow-hidden mb-4 bg-luma-100 aspect-[3/4]">
                        <img src="https://i.pinimg.com/originals/80/19/8c/80198c56e9aab05075aeec2263bf1b5a.jpg" alt="Vase artisanal" class="w-full h-full object-cover object-center image-hover-zoom">
                        <div class="absolute bottom-4 left-0 right-0 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button onclick="addToCart('Vase d\\'Argile', 85)" class="w-full bg-white/95 text-luma-900 py-3 text-sm font-medium hover:bg-luma-900 hover:text-white transition-colors shadow-lg flex justify-center items-center gap-2">
                                <i class="ph ph-shopping-bag"></i> Ajouter au panier
                            </button>
                        </div>
                    </div>
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-lg font-serif text-luma-900 mb-1">Vase en Argile</h3>
                            <p class="text-sm text-luma-500 font-light">Céramique moulée main</p>
                        </div>
                        <span class="text-lg font-medium text-luma-900">$85</span>
                    </div>
                </div>
            </div>
            
            <div class="mt-12 text-center md:hidden">
                 <a href="#" class="inline-flex items-center text-sm font-medium border-b border-luma-900 pb-1">
                    Voir toute la boutique <i class="ph ph-arrow-right ml-2"></i>
                </a>
            </div>
        </div>
    </section>

    <section id="artisanat" class="py-24 bg-white overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col lg:flex-row items-center gap-16">
                <!-- Image -->
                <div class="w-full lg:w-1/2 relative">
                    <div class="aspect-[4/5] overflow-hidden rounded-sm">
                        <img src="https://cdn.wccftech.com/wp-content/uploads/2024/03/ps5-pro-mockup-HD-scaled.jpg" alt="Artisan travaillant le bois" class="w-full h-full object-cover">
                    </div>
                    <!-- Décoration géométrique -->
                    <div class="absolute -bottom-6 -right-6 w-2/3 h-2/3 bg-luma-100 -z-10 rounded-sm hidden md:block"></div>
                </div>
                
                <!-- Texte -->
                <div class="w-full lg:w-1/2">
                    <span class="text-luma-500 uppercase tracking-widest text-sm font-medium mb-4 block">Notre Philosophie</span>
                    <h2 class="text-3xl md:text-5xl font-serif text-luma-900 mb-6 leading-tight">
                        Le retour au geste, <br>la beauté de la matière.
                    </h2>
                    <p class="text-luma-800 font-light mb-6 leading-relaxed">
                        L'Atelier Luma est né d'une volonté simple : proposer un mobilier qui a une âme. Loin des productions industrielles à la chaîne, nous prenons le temps de sélectionner chaque essence de bois, de travailler les finitions à la main, et de collaborer avec des artisans passionnés.
                    </p>
                    <p class="text-luma-800 font-light mb-10 leading-relaxed">
                        Chaque rayure, chaque nervure du bois raconte une histoire. Notre mission n'est pas seulement de meubler votre intérieur, mais d'y apporter des pièces qui vous accompagneront toute une vie.
                    </p>
                    
                    <div class="flex items-center gap-6">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Fondateur" class="w-16 h-16 rounded-full object-cover grayscale">
                        <div>
                            <p class="font-medium text-luma-900">Julien Moreau</p>
                            <p class="text-sm text-luma-500">Fondateur & Maître Ébéniste</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="bg-luma-100 py-20 border-y border-luma-100/50">
        <div class="max-w-3xl mx-auto px-4 text-center">
            <h2 class="text-3xl font-serif text-luma-900 mb-4">Rejoignez le cercle Luma</h2>
            <p class="text-luma-800 font-light mb-8">Inscrivez-vous pour découvrir nos collections en avant-première et profiter de conseils d'aménagement intérieur.</p>
            
            <form onsubmit="event.preventDefault(); showToast('Merci !', 'Inscription réussie.');" class="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input type="email" placeholder="Votre adresse email" required class="flex-1 bg-white border border-transparent px-6 py-3 focus:outline-none focus:border-luma-500 transition-colors text-luma-900">
                <button type="submit" class="bg-luma-900 text-white px-8 py-3 font-medium hover:bg-luma-800 transition-colors">
                    S'inscrire
                </button>
            </form>
        </div>
    </section>

    <footer id="contact" class="bg-luma-900 text-white pt-16 pb-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-luma-800 pb-12">
                
                <!-- Colonne 1: Marque -->
                <div>
                    <a href="#" class="font-serif text-2xl font-bold tracking-wider mb-6 inline-block">
                        Atelier Luma<span class="text-luma-500">.</span>
                    </a>
                    <p class="text-luma-100/70 font-light text-sm leading-relaxed mb-6">
                        Mobilier d'artisanat français.<br> Conçu pour durer, fabriqué avec passion.
                    </p>
                    <div class="flex space-x-4">
                        <a href="#" class="text-white hover:text-luma-500 transition-colors"><i class="ph ph-instagram-logo text-2xl"></i></a>
                        <a href="#" class="text-white hover:text-luma-500 transition-colors"><i class="ph ph-pinterest-logo text-2xl"></i></a>
                        <a href="#" class="text-white hover:text-luma-500 transition-colors"><i class="ph ph-facebook-logo text-2xl"></i></a>
                    </div>
                </div>

                <!-- Colonne 2: Liens -->
                <div>
                    <h4 class="font-medium mb-6 uppercase tracking-wider text-sm">Boutique</h4>
                    <ul class="space-y-3 text-sm text-luma-100/70 font-light">
                        <li><a href="#" class="hover:text-white transition-colors">Tous les meubles</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Assises & Fauteuils</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Tables & Bureaux</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Petite Décoration</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Cartes Cadeaux</a></li>
                    </ul>
                </div>

                <!-- Colonne 3: Aide -->
                <div>
                    <h4 class="font-medium mb-6 uppercase tracking-wider text-sm">Service Client</h4>
                    <ul class="space-y-3 text-sm text-luma-100/70 font-light">
                        <li><a href="#" class="hover:text-white transition-colors">Contactez-nous</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Livraison & Retours</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">FAQ</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Entretien du bois</a></li>
                    </ul>
                </div>

                <!-- Colonne 4: Contact physique -->
                <div>
                    <h4 class="font-medium mb-6 uppercase tracking-wider text-sm">L'Atelier</h4>
                    <ul class="space-y-3 text-sm text-luma-100/70 font-light">
                        <li class="flex items-start gap-3">
                            <i class="ph ph-map-pin mt-1 text-luma-500"></i>
                            <span>San Diego, Californie<br>États-Unis</span>
                        </li>
                        <li class="flex items-center gap-3">
                            <i class="ph ph-envelope-simple text-luma-500"></i>
                            <a href="mailto:contact@levelup-ecosystem.com" class="hover:text-white transition-colors">contact@levelup-ecosystem.com</a>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Copyright -->
            <div class="flex flex-col md:flex-row justify-between items-center text-xs text-luma-100/50 font-light">
                <p>&copy; 2024 Atelier Luma. <span class="font-medium text-luma-500 ml-2">Powered by Levelup Ecosystem</span>. Tous droits réservés.</p>
                <div class="flex space-x-4 mt-4 md:mt-0">
                    <a href="#" class="hover:text-white transition-colors">Mentions Légales</a>
                    <a href="#" class="hover:text-white transition-colors">Politique de confidentialité</a>
                    <a href="#" class="hover:text-white transition-colors">CGV</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Cart Sidebar -->
    <div id="cart-overlay" class="fixed inset-0 bg-black/50 z-[60] hidden opacity-0 transition-opacity duration-300" onclick="toggleCart()"></div>
    <div id="cart-sidebar" class="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-[70] shadow-2xl transform translate-x-full transition-transform duration-300 flex flex-col">
        <div class="p-6 border-b border-luma-100 flex justify-between items-center bg-luma-50">
            <h2 class="font-serif text-xl text-luma-900">Votre Panier</h2>
            <button onclick="toggleCart()" class="text-luma-500 hover:text-luma-900 text-2xl transition-colors"><i class="ph ph-x"></i></button>
        </div>
        <div id="cart-items-container" class="flex-1 overflow-y-auto p-6 space-y-6">
            <!-- Items injected by JS -->
            <div class="flex flex-col items-center justify-center h-full text-luma-500">
                <i class="ph ph-shopping-bag text-5xl mb-4"></i>
                <p>Votre panier est vide.</p>
            </div>
        </div>
        <div class="p-6 border-t border-luma-100 bg-luma-50">
            <div class="flex justify-between items-center mb-6">
                <span class="font-medium text-luma-800">Total</span>
                <span id="cart-total" class="font-serif text-xl text-luma-900 font-bold">$0</span>
            </div>
            <button onclick="restrictAccess()" class="w-full bg-luma-900 text-white py-4 font-medium hover:bg-luma-800 transition-colors shadow-lg">
                Commander
            </button>
        </div>
    </div>

    <!-- Login Modal -->
    <div id="login-modal" class="fixed inset-0 z-[80] hidden flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="closeLoginModal()"></div>
        <!-- Modal Content -->
        <div class="relative bg-white w-full max-w-md mx-4 rounded-sm shadow-2xl overflow-hidden animate-slide-up">
            <div class="p-8">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="font-serif text-2xl text-luma-900">Connexion</h2>
                    <button onclick="closeLoginModal()" class="text-luma-500 hover:text-luma-900 text-2xl"><i class="ph ph-x"></i></button>
                </div>
                <p class="text-luma-800 font-light text-sm mb-6">Accédez à votre espace pour suivre vos commandes et favoris.</p>
                
                <div class="space-y-4">
                    <!-- Google Login Simulation -->
                    <button type="button" onclick="restrictAccess()" class="w-full bg-white border border-[#dadce0] rounded-md flex items-center justify-center gap-3 py-2.5 hover:bg-gray-50 transition-colors text-[#3c4043] font-sans font-medium text-sm shadow-sm">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-5 h-5">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                            <path fill="none" d="M0 0h48v48H0z"></path>
                        </svg>
                        Continuer avec Google
                    </button>
                    
                    <div class="flex items-center gap-4 my-4">
                        <div class="h-px bg-luma-100 flex-1"></div>
                        <span class="text-xs text-luma-500 uppercase tracking-widest">ou</span>
                        <div class="h-px bg-luma-100 flex-1"></div>
                    </div>

                    <form onsubmit="event.preventDefault(); restrictAccess();" class="space-y-4">
                        <div>
                            <input type="email" placeholder="Adresse email" class="w-full border border-luma-100 px-4 py-3 text-sm focus:outline-none focus:border-luma-500 cursor-not-allowed bg-luma-50" onclick="restrictAccess()" readonly>
                        </div>
                        <div>
                            <input type="password" placeholder="Mot de passe" class="w-full border border-luma-100 px-4 py-3 text-sm focus:outline-none focus:border-luma-500 cursor-not-allowed bg-luma-50" onclick="restrictAccess()" readonly>
                        </div>
                        <button type="button" onclick="restrictAccess()" class="w-full bg-luma-900 text-white py-3 text-sm font-medium hover:bg-luma-800 transition-colors">
                            Se connecter
                        </button>
                    </form>
                </div>
            </div>
            <div class="bg-luma-50 p-4 text-center border-t border-luma-100">
                <p class="text-xs text-luma-500">Nouveau client ? <a href="#" onclick="restrictAccess()" class="text-luma-900 font-medium underline">Créer un compte</a></p>
            </div>
        </div>
    </div>

    <div id="toast" class="fixed bottom-5 right-5 bg-luma-900 text-white px-6 py-4 shadow-2xl flex items-center gap-4 z-50 rounded-sm">
        <i class="ph-fill ph-check-circle text-luma-500 text-2xl"></i>
        <div>
            <p class="font-medium text-sm" id="toast-title">Produit ajouté</p>
            <p class="text-xs text-luma-100/70" id="toast-desc">Votre panier a été mis à jour.</p>
        </div>
    </div>

    <script>
        // 1. Gestion du menu mobile
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');

        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });

        // Fermer le menu mobile au clic sur un lien
        const mobileLinks = menu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        });

        // 2. Gestion de l'apparence de la navbar au scroll
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-sm');
                navbar.style.background = 'rgba(249, 248, 246, 0.95)';
            } else {
                navbar.classList.remove('shadow-sm');
                navbar.style.background = 'rgba(249, 248, 246, 0.8)';
            }
        });

        // 3. Gestion du panier (Simulation e-commerce)
        let cartItems = [];
        const cartCountDisplay = document.getElementById('cart-count');
        const toast = document.getElementById('toast');
        const toastTitle = document.getElementById('toast-title');
        let toastTimeout;

        function addToCart(productName, price) {
            cartItems.push({ name: productName, price: price });
            updateCartUI();
            
            cartCountDisplay.classList.add('scale-125');
            setTimeout(() => cartCountDisplay.classList.remove('scale-125'), 200);

            showToast(productName + ' ajouté', 'Montant : $' + price);
        }

        function updateCartUI() {
            cartCountDisplay.textContent = cartItems.length;
            const container = document.getElementById('cart-items-container');
            const totalDisplay = document.getElementById('cart-total');
            
            if (cartItems.length === 0) {
                container.innerHTML = '<div class="flex flex-col items-center justify-center h-full text-luma-500"><i class="ph ph-shopping-bag text-5xl mb-4"></i><p>Votre panier est vide.</p></div>';
                totalDisplay.textContent = '$0';
                return;
            }

            let html = '';
            let total = 0;
            cartItems.forEach((item, index) => {
                total += item.price;
                html += '<div class="flex justify-between items-center border-b border-luma-100 pb-4"><div><h4 class="font-serif text-luma-900">' + item.name + '</h4><p class="text-sm text-luma-500">$' + item.price + '</p></div><button onclick="removeFromCart(' + index + ')" class="text-luma-500 hover:text-red-500 transition-colors"><i class="ph ph-trash"></i></button></div>';
            });
            container.innerHTML = html;
            totalDisplay.textContent = '$' + total.toLocaleString();
        }

        function removeFromCart(index) {
            cartItems.splice(index, 1);
            updateCartUI();
        }

        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        let isCartOpen = false;

        function toggleCart() {
            isCartOpen = !isCartOpen;
            if (isCartOpen) {
                cartOverlay.classList.remove('hidden');
                setTimeout(() => cartOverlay.classList.remove('opacity-0'), 10);
                cartSidebar.classList.remove('translate-x-full');
            } else {
                cartSidebar.classList.add('translate-x-full');
                cartOverlay.classList.add('opacity-0');
                setTimeout(() => cartOverlay.classList.add('hidden'), 300);
            }
        }

        const loginModal = document.getElementById('login-modal');

        function openLoginModal() {
            loginModal.classList.remove('hidden');
        }

        function closeLoginModal() {
            loginModal.classList.add('hidden');
        }

        function restrictAccess() {
            // Affichage d'un message élégant pour Levelup Ecosystem
            showToast("Accès restreint", "Veuillez contacter Levelup Ecosystem.");
        }

        function showToast(title, desc) {
            toastTitle.textContent = title;
            document.getElementById('toast-desc').textContent = desc;
            
            toast.classList.add('show');
            
            if(toastTimeout) clearTimeout(toastTimeout);
            
            toastTimeout = setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
        
        // 4. Animation d'apparition au scroll simple
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                    entry.target.style.opacity = 1;
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Appliquer l'observateur sur les cartes produits
        document.querySelectorAll('.product-card').forEach((el, index) => {
            el.style.opacity = 0;
            el.style.animationDelay = (index * 0.1) + 's'; 
            observer.observe(el);
        });
    </script>
</body>
</html>`;
