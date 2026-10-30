<script setup>
import { computed, onMounted, provide, ref } from 'vue';
import { view, usePage } from './demo/navigation.js';
const page = usePage();
const pages = import.meta.glob('./Pages/**/*.vue', { eager: true, import: 'default' });
const currentPage = computed(() => pages[`./Pages/${page.component}.vue`]);
const currentProps = computed(() => Object.fromEntries(Object.entries(page.props).filter(([key]) => key in (currentPage.value?.props || {}))));
const theme = ref('dark');
const setTheme = value => {
    theme.value = value;
    document.documentElement.dataset.theme = value;
    try { localStorage.setItem('educadapta-theme', value); } catch { /* O tema continua ativo nesta sessão. */ }
};
onMounted(() => {
    try { theme.value = localStorage.getItem('educadapta-theme') === 'light' ? 'light' : 'dark'; } catch { /* Usa o tema escuro se o armazenamento estiver bloqueado. */ }
    document.documentElement.dataset.theme = theme.value;
});
provide('theme', { theme, toggleTheme: () => setTheme(theme.value === 'dark' ? 'light' : 'dark') });
</script>

<template>
    <div v-if="view.notice" class="demo-notice" role="status">
        <span>{{ view.notice }}</span>
        <button type="button" aria-label="Fechar aviso" @click="view.notice = ''">×</button>
    </div>
    <p v-if="view.ready && !view.backend" class="demo-storage-warning">O backend PHP/SQLite não está conectado. As alterações ficam só neste navegador.</p>
    <component :is="currentPage" :key="view.url" v-bind="currentProps" />
</template>
