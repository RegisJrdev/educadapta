<script setup>
import { Link } from '@/demo/navigation.js';
</script>

<template>
    <div class="auth-page">
        <!-- Lado esquerdo: branco com logo -->
        <div class="auth-brand">
            <Link href="/">
                <img src="/images/logo.png" alt="EducAdapta" class="auth-brand-logo" />
            </Link>
            <h1 class="auth-brand-title">EducAdapta</h1>
            <p class="auth-brand-subtitle">Plataforma de Educação Inclusiva</p>
        </div>

        <!-- Lado direito: azul com card branco flutuando -->
        <div class="auth-form-side">
            <div class="auth-card">
                <slot />
            </div>
        </div>
    </div>
</template>

<style scoped>
.auth-page {
    min-height: 100vh;
    display: flex;
}

/* Esquerda: fundo branco, logo centralizada */
.auth-brand {
    flex: 0 0 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--bg-card);
    padding: 3rem;
    gap: 0.5rem;
}

.auth-brand-logo {
    height: 220px;
    margin-bottom: 0.75rem;
}

.auth-brand-title {
    font-size: 2rem;
    font-weight: 800;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.2;
}

.auth-brand-subtitle {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin: 0;
}

/* Direita: fundo azul primário, card branco centralizado */
.auth-form-side {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary);
    padding: 2rem;
    overflow-y: auto;
}

.auth-card {
    width: 100%;
    max-width: 400px;
    background: var(--bg-card);
    border-radius: 1.25rem;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
    padding: 1.75rem 2rem;
}

/* Compactar elementos de formulário dentro do card */
.auth-card :deep(.form-group) {
    margin-bottom: 1.1rem;
}

.auth-card :deep(.form-input),
.auth-card :deep(.form-select) {
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
}

.auth-card :deep(.form-label) {
    font-size: 0.85rem;
    margin-bottom: 0.3rem;
}

.auth-card :deep(.btn-lg) {
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
}
</style>
