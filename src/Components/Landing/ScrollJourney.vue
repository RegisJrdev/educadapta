<script setup>
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion-v';
import ScrollStoryText from './ScrollStoryText.vue';
import JourneyVisual from './JourneyVisual.vue';
import './journey.css';

const track = useTemplateRef('storyTrack');
const reduced = useReducedMotion();
const spacious = ref(false);
const enhanced = computed(() => spacious.value && !reduced.value);
const active = ref(0);
const { scrollYProgress } = useScroll({ target: track, offset: ['start 0.45', 'end 0.55'] });
const smoothProgress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: .6, restDelta: .0001 });
const steps = [
    { title: 'Conhecer', text: 'Tudo começa com um olhar para o que torna cada aluno único.', detail: 'O especialista registra necessidades, preferências e estratégias de aprendizagem. Esse perfil orienta o trabalho da equipe.', icon: 'fa-fingerprint' },
    { title: 'Adaptar', text: 'A atividade encontra uma nova forma de fazer sentido.', detail: 'O professor prepara a proposta, revisa a adaptação e ajusta a linguagem, as etapas e os apoios para aquele aluno.', icon: 'fa-sliders-h' },
    { title: 'Acompanhar', text: 'Cada descoberta ajuda a escolher o próximo passo.', detail: 'O aluno realiza a atividade. A equipe acompanha o progresso e usa esse olhar para planejar novos desafios.', icon: 'fa-seedling' },
];
useMotionValueEvent(smoothProgress, 'change', progress => {
    const next = Math.min(2, Math.max(0, Math.floor(progress * 3)));
    if (active.value !== next) active.value = next;
});
let media;
const updateViewport = () => { spacious.value = media.matches; };
onMounted(() => {
    media = window.matchMedia('(min-width: 1050px) and (min-height: 760px)');
    updateViewport();
    media.addEventListener('change', updateViewport);
});
onUnmounted(() => media?.removeEventListener('change', updateViewport));
</script>

<template>
    <section id="how-it-works" class="edu-scroll-journey edu-wrap" :class="{ 'is-scroll-story': enhanced }" aria-labelledby="journey-title">
        <div class="edu-section-heading"><h2 id="journey-title">Do olhar atento<br /><span>à próxima conquista.</span></h2><p>Conhecer, adaptar e acompanhar. Uma jornada construída em conjunto.</p></div>
        <div ref="storyTrack" class="edu-story-track">
            <ol class="edu-story-steps">
                <li v-for="(step, index) in steps" :key="step.title" class="edu-story-step" :class="{ 'is-current': active === index }">
                    <div class="edu-story-step-name"><span class="edu-story-number">{{ index + 1 }}</span><h3>{{ step.title }}</h3><i :class="['fas', step.icon]" aria-hidden="true"></i></div>
                    <ScrollStoryText :text="step.text" :progress="smoothProgress" :start="index / 3" :end="index / 3 + .24" :enabled="enhanced" />
                    <p class="edu-story-detail">{{ step.detail }}</p>
                </li>
            </ol>
            <JourneyVisual v-if="enhanced" :progress="smoothProgress" :active="active" />
        </div>
    </section>
</template>
