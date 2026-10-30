<script setup>
import { inject } from 'vue';

const { theme, toggleTheme } = inject('theme');
</script>

<template>
    <button type="button" class="theme-toggle" :aria-label="theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'" :title="theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'" @click="toggleTheme">
        <i :class="theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'" aria-hidden="true"></i>
    </button>
</template>
