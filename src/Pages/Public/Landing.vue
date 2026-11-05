<script setup>
import { motion, useReducedMotion } from 'motion-v';
import { onMounted, onUnmounted } from 'vue';
import { Head, Link } from '@/demo/navigation.js';
import LandingHeader from '@/Components/Landing/LandingHeader.vue';
import LearningScene from '@/Components/Landing/LearningScene.vue';
import AdaptationPreview from '@/Components/Landing/AdaptationPreview.vue';
import ScrollJourney from '@/Components/Landing/ScrollJourney.vue';
import LearningJourney from '@/Components/Landing/LearningJourney.vue';
import LandingQuestions from '@/Components/Landing/LandingQuestions.vue';
import '@/Components/Landing/landing.css';
import 'lenis/dist/lenis.css';

const MotionDiv = motion.div;
const reduced = useReducedMotion();
let smoothScroll;
let disposed = false;
onMounted(async () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    try {
        const { default: Lenis } = await import('lenis');
        if (disposed) return;
        smoothScroll = new Lenis({ autoRaf: true, lerp: .1, smoothWheel: true, syncTouch: false, anchors: true, allowNestedScroll: true, stopInertiaOnNavigate: true });
    } catch {
        // A rolagem nativa continua disponível se o módulo não carregar.
    }
});
onUnmounted(() => { disposed = true; smoothScroll?.destroy(); });
</script>

<template>
    <Head title="EducAdapta | Cada aluno, um jeito de aprender" />
    <div class="edu-landing">
        <a class="edu-skip" href="#conteudo">Pular para o conteúdo</a>
        <LandingHeader />
        <main id="conteudo" tabindex="-1">
            <section class="edu-hero edu-wrap" aria-labelledby="hero-title">
                <MotionDiv class="edu-hero-copy" :initial="reduced ? false : { y: 24 }" :animate="{ y: 0 }" :transition="{ duration: .7, ease: [.16, 1, .3, 1] }">
                    <h1 id="hero-title">Cada aluno.<br />Um jeito de <span>aprender.</span></h1>
                    <p class="edu-hero-description">Conecte educadores, especialistas e atividades adaptadas. Abra espaço para o potencial de cada aluno.</p>
                    <div class="edu-actions">
                        <Link href="/demo" class="edu-button edu-button-primary">Explorar os perfis <span aria-hidden="true">↗</span></Link>
                        <a href="#how-it-works" class="edu-text-link">Conhecer a plataforma <span aria-hidden="true">↓</span></a>
                    </div>
                </MotionDiv>
                <LearningScene />
            </section>

            <section id="about" class="edu-about edu-wrap" aria-labelledby="about-title">
                <div class="edu-about-image">
                    <img src="/images/carrosel1.jpg" width="1254" height="837" loading="lazy" alt="Criança desenhando e colorindo um coração em uma atividade criativa" />
                </div>
                <MotionDiv class="edu-about-copy" :initial="reduced ? false : { y: 22 }" :while-in-view="{ y: 0 }" :in-view-options="{ once: true, amount: .3 }" :transition="{ duration: .6 }">
                    <h2 id="about-title">A mesma oportunidade.<br /><span>Outros caminhos.</span></h2>
                    <p>Uma atividade pode ganhar frases mais claras, etapas menores ou novos apoios. O objetivo continua o mesmo: aprender com autonomia.</p>
                    <p>O EducAdapta aproxima quem ensina de quem acompanha o desenvolvimento. A tecnologia apoia. O olhar humano orienta.</p>
                    <a href="#features" class="edu-text-link">Veja a adaptação em ação <span aria-hidden="true">↗</span></a>
                </MotionDiv>
            </section>

            <AdaptationPreview />
            <ScrollJourney />
            <LearningJourney />
            <LandingQuestions />

            <section class="edu-final edu-wrap" aria-labelledby="final-title">
                <h2 id="final-title">Mais possibilidades.<br /><span>Para cada aluno.</span></h2>
                <p>Explore os cinco perfis e descubra como cada pessoa participa da jornada.</p>
                <Link href="/demo" class="edu-button edu-button-primary">Explorar os perfis <span aria-hidden="true">↗</span></Link>
            </section>
        </main>
        <footer class="edu-footer edu-wrap">
            <Link href="/" class="edu-brand" aria-label="EducAdapta, início"><img src="/images/logo.png" alt="" width="36" height="36" /><span>EducAdapta<span class="edu-brand-period">.</span></span></Link>
            <p>Educação que reconhece cada jeito de aprender.</p>
            <small>© {{ new Date().getFullYear() }} EducAdapta</small>
        </footer>
    </div>
</template>
