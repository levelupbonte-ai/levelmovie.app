import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        services: resolve(__dirname, 'services/index.html'),
        serviceLocalBusiness: resolve(__dirname, 'services/local-business-websites/index.html'),
        serviceCreators: resolve(__dirname, 'services/creator-websites/index.html'),
        servicePortfolios: resolve(__dirname, 'services/portfolio-websites/index.html'),
        serviceOnlineStores: resolve(__dirname, 'services/online-stores/index.html'),
        serviceSecurityCheck: resolve(__dirname, 'services/security-check/index.html'),
        serviceCarePlans: resolve(__dirname, 'services/care-plans/index.html'),
        webDesignSanDiego: resolve(__dirname, 'web-design-san-diego/index.html'),
        projects: resolve(__dirname, 'projects/index.html'),
        finalStop: resolve(__dirname, 'projects/final-stop/index.html'),
        pricing: resolve(__dirname, 'pricing/index.html'),
        process: resolve(__dirname, 'process/index.html'),
        about: resolve(__dirname, 'about/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
        preview: resolve(__dirname, 'preview/index.html'),
        previewCustom: resolve(__dirname, 'preview/custom/index.html'),
        previewInstant: resolve(__dirname, 'preview/instant/index.html'),
        sitemap: resolve(__dirname, 'sitemap/index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
        terms: resolve(__dirname, 'terms/index.html'),
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
});
