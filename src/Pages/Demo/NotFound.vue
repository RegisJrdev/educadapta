<script setup>
import { Head, Link } from '@/demo/navigation.js';
import ThemeToggle from '@/Components/ThemeToggle.vue';
</script>
<template>
    <Head title="Página não encontrada" />
    <main class="container demo-profiles">
        <ThemeToggle />
        <h1>Página não encontrada</h1>
        <p>Escolha um perfil para continuar explorando a demonstração.</p>
        <Link href="/demo" class="btn btn-primary">Explorar perfis</Link>
    </main>
</template>
