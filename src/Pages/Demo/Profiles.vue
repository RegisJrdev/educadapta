<script setup>
import { Head, Link } from '@/demo/navigation.js';
import { roles } from '@/demo/data.js';
</script>
<template>
    <Head title="Explore os perfis" />
    <main class="demo-profiles container">
        <Link href="/" class="demo-back">← Conhecer o EducAdapta</Link>
        <div class="demo-intro">
            <img src="/images/logo.png" alt="" />
            <span class="badge badge-blue">Tour interativo</span>
            <h1>Uma plataforma.<br />Diferentes formas de cuidar.</h1>
            <p>Escolha um perfil para conhecer o EducAdapta por dentro. Explore as telas e experimente os fluxos com dados de exemplo, sem precisar de uma conta.</p>
        </div>
        <div class="demo-profile-grid">
            <Link v-for="role in roles" :key="role.id" :href="`/${role.id}/dashboard`" class="card demo-profile-card">
                <div class="demo-profile-icon"><i :class="`fas ${role.icon}`" aria-hidden="true"></i></div>
                <h2>{{ role.name }}</h2>
                <p>{{ role.description }}</p>
                <span>Explorar perfil <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
            </Link>
        </div>
        <p class="demo-footnote">Adaptações de IA e informações de acompanhamento são ilustrativas. Mensagens e cadastros ficam apenas no seu navegador. Use “Reiniciar demo” para começar novamente.</p>
    </main>
</template>
