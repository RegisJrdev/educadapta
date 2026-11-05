<script setup>
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import { useReducedMotion } from 'motion-v';
import puzzleSvg from './learningPuzzle.svg?raw';

const host = useTemplateRef('host');
const reduced = useReducedMotion();
const paused = ref(false);
const ready = ref(false);
const stopped = computed(() => paused.value || reduced.value);
let scene;
let disposed = false;

onMounted(async () => {
    if (reduced.value) return;
    try {
        const { createLearningScene } = await import('./learningScene.js');
        if (disposed || reduced.value) return;
        scene = createLearningScene(host.value, () => { ready.value = false; });
        ready.value = true;
        scene.setPaused(stopped.value);
    } catch {
        // A composição estática preserva o visual quando WebGL não está disponível.
        ready.value = false;
    }
});
watch(stopped, value => scene?.setPaused(value));
onUnmounted(() => { disposed = true; scene?.dispose(); });
</script>

<template>
    <div class="edu-scene" :class="{ 'is-ready': ready }">
        <div class="edu-scene-art" aria-hidden="true">
            <div class="edu-scene-fallback" v-html="puzzleSvg"></div>
            <div ref="host" class="edu-scene-canvas"></div>
            <span class="edu-scene-word edu-scene-word-top">Descobrir</span>
            <span class="edu-scene-word edu-scene-word-right">Experimentar</span>
            <span class="edu-scene-word edu-scene-word-bottom">Aprender</span>
        </div>
        <div class="edu-scene-caption">
            <p>Diferentes caminhos.<br /><strong>Um mundo de possibilidades.</strong></p>
            <button v-if="ready && !reduced" type="button" class="edu-animation-toggle" :aria-pressed="paused" @click="paused = !paused">
                <i :class="paused ? 'fas fa-play' : 'fas fa-pause'" aria-hidden="true"></i>
                {{ paused ? 'Retomar animação' : 'Pausar animação' }}
            </button>
        </div>
    </div>
</template>
