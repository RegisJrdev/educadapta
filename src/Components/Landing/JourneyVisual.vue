<script setup>
import { motion, useTransform } from 'motion-v';

const { progress, active } = defineProps({ progress: { type: Object, required: true }, active: { type: Number, required: true } });
const MotionDiv = motion.div;
const MotionSpan = motion.span;
const fadeRanges = [[0, .29, .37], [.29, .37, .62, .7], [.62, .7, 1]];
const fadeValues = [[1, 1, 0], [0, 1, 1, 0], [0, 1, 1]];
const entrance = index => ({
    ...useTransform(progress, [index / 3, index / 3 + .1], { y: [28, 0], scale: [.96, 1] }),
    opacity: useTransform(progress, fadeRanges[index], fadeValues[index]),
});
const panels = [entrance(0), entrance(1), entrance(2)];
const preferences = ['Instruções curtas', 'Apoio visual', 'Tempo para responder'].map((label, index) => ({
    label, style: useTransform(progress, [.025 + index * .045, .09 + index * .045], { x: [26, 0], opacity: [.35, 1] }),
}));
const instructions = ['Leia o problema', 'Separe em grupos', 'Conte e descubra'].map((label, index) => ({
    label, style: useTransform(progress, [.36 + index * .045, .42 + index * .045], { y: [22, 0], opacity: [.35, 1] }),
}));
const growth = useTransform(progress, [.69, .93], { scaleX: [0, 1] });
const achievements = ['Atividade concluída', 'Revisão da equipe', 'Novo desafio'].map((label, index) => ({
    label, style: useTransform(progress, [.7 + index * .07, .75 + index * .07], { scale: [.8, 1], opacity: [.3, 1] }),
}));
</script>

<template>
    <div class="edu-journey-visual" aria-hidden="true">
        <div class="edu-journey-aura"><span></span><span></span></div>
        <div class="edu-journey-window edu-glass">
            <div class="edu-story-markers"><span v-for="(name, index) in ['Conhecer', 'Adaptar', 'Acompanhar']" :key="name" :class="{ 'is-active': active === index }">{{ name }}</span></div>
            <div class="edu-story-panels">
            <MotionDiv class="edu-story-illustration" :style="panels[0]">
                <div class="edu-story-emblem"><i class="fas fa-fingerprint"></i></div>
                <h4>Um perfil singular.</h4><p>Estratégias que partem de quem aprende.</p>
                <div class="edu-preference-stack"><MotionDiv v-for="item in preferences" :key="item.label" :style="item.style" class="edu-glass"><i class="fas fa-check"></i><span>{{ item.label }}</span></MotionDiv></div>
            </MotionDiv>
            <MotionDiv class="edu-story-illustration" :style="panels[1]">
                <div class="edu-story-equation"><b>12</b><span>lápis para</span><b>3</b><span>amigos</span></div>
                <h4>Clareza em cada etapa.</h4><p>O mesmo desafio, com novos apoios.</p>
                <div class="edu-instruction-stack"><MotionDiv v-for="(item, index) in instructions" :key="item.label" :style="item.style" class="edu-glass"><span>{{ index + 1 }}</span><strong>{{ item.label }}</strong></MotionDiv></div>
            </MotionDiv>
            <MotionDiv class="edu-story-illustration" :style="panels[2]">
                <div class="edu-story-emblem"><i class="fas fa-seedling"></i></div>
                <h4>Uma conquista abre outra.</h4><p>Aprender, observar e seguir em frente.</p>
                <div class="edu-achievement-path"><MotionSpan class="edu-achievement-line" :style="growth" /><MotionDiv v-for="(item, index) in achievements" :key="item.label" :style="item.style"><span class="edu-achievement-node"><i :class="index === 2 ? 'fas fa-arrow-right' : 'fas fa-check'"></i></span><strong>{{ item.label }}</strong></MotionDiv></div>
            </MotionDiv>
            </div>
            <span class="edu-story-caption">Representação ilustrativa da jornada</span>
        </div>
    </div>
</template>
