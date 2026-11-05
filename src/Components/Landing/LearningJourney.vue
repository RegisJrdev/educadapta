<script setup>
import { computed, ref } from 'vue';
import { motion, useReducedMotion } from 'motion-v';
import { Link } from '@/demo/navigation.js';

const MotionDiv = motion.div;
const MotionLi = motion.li;
const MotionSpan = motion.span;
const MotionButton = motion.button;
const reduced = useReducedMotion();
const selected = ref('teacher');
const roles = [
    { id: 'teacher', label: 'Professor', icon: 'fa-chalkboard-teacher', title: 'Planejar com cada aluno em mente.', description: 'Organize suas turmas, prepare atividades e revise adaptações antes de compartilhar.', tasks: ['Atividades com prévia da adaptação', 'Acompanhamento das turmas', 'Troca com os profissionais'] },
    { id: 'student', label: 'Aluno', icon: 'fa-graduation-cap', title: 'Aprender e reconhecer cada conquista.', description: 'Encontre suas atividades, acompanhe a agenda e veja o progresso ao concluir novos desafios.', tasks: ['Atividades adaptadas', 'Agenda de aprendizagem', 'XP e conquistas na demonstração'] },
    { id: 'psychopedagogue', label: 'Psicopedagogo', icon: 'fa-brain', title: 'Conhecer o aluno muda a proposta.', description: 'Registre estratégias, preferências e objetivos que orientam a adaptação das atividades.', tasks: ['Perfis de adaptação por aluno', 'Planos de acompanhamento', 'Orientações para os educadores'] },
    { id: 'psychologist', label: 'Psicólogo', icon: 'fa-heart', title: 'Cuidar também faz parte de aprender.', description: 'Organize sessões e acompanhe os alunos em diálogo com a equipe educacional.', tasks: ['Agenda de sessões', 'Acompanhamento dos alunos', 'Mensagens para a equipe'] },
    { id: 'institution', label: 'Instituição', icon: 'fa-school', title: 'Enxergar a jornada como um todo.', description: 'Reúna a visão de alunos, professores e acompanhamentos para apoiar as decisões da instituição.', tasks: ['Indicadores de acompanhamento', 'Gestão de alunos e professores', 'Relatórios demonstrativos'] },
];
const current = computed(() => roles.find(role => role.id === selected.value));
</script>

<template>
    <section class="edu-roles-section edu-wrap" aria-labelledby="roles-title">
        <div class="edu-section-heading">
            <h2 id="roles-title">Ninguém aprende sozinho.</h2>
            <p>Cinco perspectivas conectadas por um mesmo propósito. Escolha um perfil para conhecer.</p>
        </div>
        <div class="edu-roles edu-glass">
            <div class="edu-role-selector" role="group" aria-label="Perfis da plataforma">
                <MotionButton v-for="role in roles" :key="role.id" type="button" :aria-pressed="selected === role.id" :while-press="reduced ? undefined : { scale: .97 }" :transition="{ type: 'spring', stiffness: 420, damping: 28 }" @click="selected = role.id"><i :class="['fas', role.icon]" aria-hidden="true"></i>{{ role.label }}<span aria-hidden="true">↗</span></MotionButton>
            </div>
            <div class="edu-role-panel" aria-live="polite" aria-atomic="true">
                <MotionDiv :key="current.id" :initial="reduced ? false : { y: 12 }" :while-in-view="{ y: 0 }" :in-view-options="{ once: true, amount: .2 }" :transition="{ duration: .3 }">
                    <MotionSpan class="edu-role-icon" :initial="reduced ? false : { scale: .8, rotate: -12 }" :while-in-view="{ scale: 1, rotate: 0 }" :in-view-options="{ once: true }" :transition="{ type: 'spring', stiffness: 280, damping: 22 }"><i :class="['fas', current.icon]" aria-hidden="true"></i></MotionSpan>
                    <h3>{{ current.title }}</h3><p>{{ current.description }}</p>
                    <ul><MotionLi v-for="(task, index) in current.tasks" :key="task" :initial="reduced ? false : { x: 12, opacity: .6 }" :while-in-view="{ x: 0, opacity: 1 }" :in-view-options="{ once: true, amount: .2 }" :transition="{ duration: .22, delay: index * .06 }"><i class="fas fa-check" aria-hidden="true"></i>{{ task }}</MotionLi></ul>
                    <Link :href="`/${current.id}/dashboard`" class="edu-text-link">Explorar perfil de {{ current.label.toLowerCase() }} <span aria-hidden="true">↗</span></Link>
                </MotionDiv>
            </div>
        </div>
    </section>
</template>
