<script setup>
import { computed, ref } from 'vue';
import { motion, useReducedMotion } from 'motion-v';
import { Link } from '@/demo/navigation.js';

const selected = ref('steps');
const reduced = useReducedMotion();
const MotionDiv = motion.div;
const MotionLi = motion.li;
const MotionButton = motion.button;
const options = [
    { id: 'steps', label: 'Passo a passo', icon: 'fa-list-ol', title: 'Uma coisa de cada vez.', description: 'A atividade é dividida em ações curtas, com uma orientação por etapa.', steps: ['Leia: Ana tem 12 lápis.', 'Separe os lápis em 3 grupos iguais.', 'Conte os lápis de um grupo. Quantos são?'] },
    { id: 'reading', label: 'Leitura simplificada', icon: 'fa-align-left', title: 'Mais clareza para começar.', description: 'Frases diretas e informações separadas ajudam a acompanhar o enunciado.', steps: ['Ana tem 12 lápis.', 'Ela divide os lápis igualmente entre 3 amigos.', 'Quantos lápis cada amigo recebe?'] },
    { id: 'visual', label: 'Apoio visual', icon: 'fa-shapes', title: 'Ver também é aprender.', description: 'Grupos visuais ajudam a relacionar a quantidade ao problema.', steps: ['Observe os 3 grupos abaixo.', 'Cada grupo representa um amigo.', 'Conte os lápis de um grupo para encontrar a resposta.'] },
];
const current = computed(() => options.find(option => option.id === selected.value));
</script>

<template>
    <section id="features" class="edu-preview-section" aria-labelledby="preview-title">
        <div class="edu-wrap">
            <div class="edu-section-heading">
                <h2 id="preview-title">Uma atividade.<br /><span>Mais formas de entender.</span></h2>
                <p>Escolha uma abordagem e veja como a mesma proposta pode ser apresentada.</p>
            </div>
            <div class="edu-adaptation edu-glass">
                <div class="edu-original">
                    <span class="edu-paper-label"><i class="far fa-file-alt" aria-hidden="true"></i> Atividade original</span>
                    <h3>Vamos dividir?</h3>
                    <p>Ana possui uma coleção de 12 lápis de cor e deseja distribuí-los igualmente entre 3 amigos. Determine a quantidade de lápis que cada amigo receberá.</p>
                    <span class="edu-subject">Matemática · Divisão</span>
                </div>
                <div class="edu-adapted">
                    <div class="edu-adaptation-options" role="group" aria-label="Forma de apresentar a atividade">
                        <MotionButton v-for="option in options" :key="option.id" type="button" :aria-pressed="selected === option.id" :while-press="reduced ? undefined : { scale: .96 }" :transition="{ type: 'spring', stiffness: 420, damping: 28 }" @click="selected = option.id">
                            <i :class="['fas', option.icon]" aria-hidden="true"></i>{{ option.label }}
                        </MotionButton>
                    </div>
                    <div class="edu-adaptation-result" aria-live="polite" aria-atomic="true">
                        <MotionDiv :key="current.id" :initial="reduced ? false : { y: 10 }" :while-in-view="{ y: 0 }" :in-view-options="{ once: true, amount: .2 }" :transition="{ duration: .25 }">
                            <span class="edu-paper-label">Exemplo adaptado</span>
                            <h3>{{ current.title }}</h3>
                            <p>{{ current.description }}</p>
                            <div v-if="current.id === 'visual'" class="edu-pencil-groups" role="img" aria-label="Três grupos de quatro lápis, totalizando doze lápis">
                                <MotionDiv v-for="group in 3" :key="group" :initial="reduced ? false : { scale: .85, rotate: -7 }" :animate="{ scale: 1, rotate: 0 }" :transition="{ type: 'spring', stiffness: 300, damping: 22, delay: (group - 1) * .07 }"><i v-for="pencil in 4" :key="pencil" class="fas fa-pencil-alt" aria-hidden="true"></i></MotionDiv>
                            </div>
                            <ol class="edu-example-steps"><MotionLi v-for="(step, index) in current.steps" :key="step" :initial="reduced ? false : { x: 14, opacity: .6 }" :while-in-view="{ x: 0, opacity: 1 }" :in-view-options="{ once: true, amount: .2 }" :transition="{ duration: .25, delay: index * .06 }">{{ step }}</MotionLi></ol>
                        </MotionDiv>
                    </div>
                </div>
            </div>
            <div class="edu-preview-note">
                <p><i class="fas fa-info-circle" aria-hidden="true"></i> Exemplo ilustrativo. Nesta demonstração, a adaptação é simulada e deve ser revisada pelo educador.</p>
                <Link href="/teacher/adapt" class="edu-text-link">Experimentar com um texto <span aria-hidden="true">↗</span></Link>
            </div>
        </div>
    </section>
</template>
