<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { Link } from '@/demo/navigation.js';
import ThemeToggle from '@/Components/ThemeToggle.vue';

const open = ref(false);
const scrolled = ref(false);
const focused = ref(false);
const expanded = computed(() => scrolled.value || focused.value || open.value);
const toggle = useTemplateRef('toggle');
const navigation = useTemplateRef('navigation');

function updateScroll() {
    // Dois limites evitam oscilar enquanto a rolagem suave termina perto do topo.
    if (window.scrollY > 24) scrolled.value = true;
    else if (window.scrollY <= 4) scrolled.value = false;
}
onMounted(() => {
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
});
onUnmounted(() => window.removeEventListener('scroll', updateScroll));

function updateFocus(event) {
    focused.value = event.currentTarget.contains(event.relatedTarget);
}
function focusBrand(event) {
    event.currentTarget.focus();
}
async function toggleMenu() {
    open.value = !open.value;
    if (open.value) {
        await nextTick();
        navigation.value?.querySelector('a')?.focus();
    }
}
function closeOnEscape() {
    if (!open.value) return;
    open.value = false;
    toggle.value?.focus();
}
</script>

<template>
    <header class="edu-header" :class="{ 'is-expanded': expanded }" @focusin="focused = true" @focusout="updateFocus" @keydown.esc="closeOnEscape">
        <div class="edu-header-surface edu-glass" aria-hidden="true"></div>
        <div class="edu-header-inner edu-wrap">
            <Link href="/" class="edu-brand" aria-label="EducAdapta, início" @click="focusBrand"><img src="/images/logo.png" alt="" width="36" height="36" /><span>EducAdapta<span class="edu-brand-period">.</span></span></Link>
            <nav ref="navigation" id="landing-navigation" class="edu-navigation" :class="{ 'is-open': open }" :inert="!expanded" aria-label="Navegação principal" @click="open = false">
                <a href="#about">Sobre</a>
                <a href="#features">Funcionalidades</a>
                <a href="#how-it-works">Como funciona</a>
                <Link href="/demo" class="edu-nav-demo">Explorar os perfis <span aria-hidden="true">↗</span></Link>
            </nav>
            <div class="edu-header-tools" :inert="!expanded">
                <ThemeToggle />
                <button ref="toggle" type="button" class="edu-menu-toggle" :aria-expanded="open" aria-controls="landing-navigation" :aria-label="open ? 'Fechar menu' : 'Abrir menu'" @click="toggleMenu">
                    <i :class="open ? 'fas fa-times' : 'fas fa-bars'" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </header>
</template>
