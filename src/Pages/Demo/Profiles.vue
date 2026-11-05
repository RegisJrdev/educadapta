<script setup>
import { Head, Link, view, resetDemo } from '@/demo/navigation.js';
import { roles } from '@/demo/data.js';
import ThemeToggle from '@/Components/ThemeToggle.vue';
</script>
<template>
    <Head title="Explore os perfis" />
    <main class="demo-profiles container">
        <div class="demo-profile-header"><Link href="/" class="demo-back">← Conhecer o EducAdapta</Link><ThemeToggle /></div>
        <div class="demo-intro">
            <img src="/images/logo.png" alt="" />
            <span class="badge badge-blue">Tour interativo</span>
            <h1>Conheça o EducAdapta<br />por diferentes perspectivas.</h1>
            <p>Escolha um perfil e experimente como a plataforma conecta o trabalho de educadores e profissionais ao aprendizado dos alunos.</p>
        </div>
        <div class="demo-profile-grid">
            <Link v-for="(role, index) in roles" :key="role.id" :href="`/${role.id}/dashboard`" class="card demo-profile-card">
                <div class="demo-profile-card-top">
                    <div class="demo-profile-icon"><i :class="`fas ${role.icon}`" aria-hidden="true"></i></div>
                    <span class="demo-profile-index">0{{ index + 1 }}</span>
                </div>
                <h2>{{ role.name }}</h2>
                <p>{{ role.description }}</p>
                <span class="demo-profile-person"><i class="fas fa-user-circle" aria-hidden="true"></i> Exemplo: {{ role.user }}</span>
                <span class="demo-profile-action">Explorar perfil <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
            </Link>
        </div>
        <p class="demo-footnote"><i class="fas fa-info-circle" aria-hidden="true"></i> Dados fictícios para apresentação. {{ view.backend ? 'As alterações ficam compartilhadas nesta demonstração.' : 'As alterações ficam neste navegador enquanto o backend não estiver conectado.' }} Use “Reiniciar demo” para restaurar os exemplos.</p>
        <div class="demo-reset"><button type="button" class="btn btn-outline btn-sm" @click="resetDemo">Reiniciar demo</button></div>
    </main>
</template>
