import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    plugins: [vue(), react(), tailwindcss()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: { proxy: { '/api': 'http://127.0.0.1:8000' } },
    // Mantém o CSS extraído sem depender de configuração PostCSS externa.
    css: { postcss: { plugins: [] } },
});
