import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    vitePrerenderPlugin({
      renderTarget: '#root',

      prerenderScript: path.resolve(
        __dirname,
        'src/prerender.tsx',
      ),

      additionalPrerenderRoutes: [
        '/servicos',
        '/servicos/branding-identidade',
        '/servicos/websites',
        '/servicos/marketing-digital',
        '/servicos/gestao-redes-sociais',
        '/servicos/crm-automacao',
        '/servicos/inteligencia-artificial',
      ],
    }),
  ],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});