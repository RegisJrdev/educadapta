<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head, Link, usePage } from '@/demo/navigation.js';
import DashboardBarChart from '@/Components/DashboardBarChart.vue';
import DashboardDonutChart from '@/Components/DashboardDonutChart.vue';
import { computed } from 'vue';

const props = defineProps({
    student: { type: Object, default: () => ({}) },
    todayActivity: { type: Object, default: null },
    recentAchievements: { type: Array, default: () => [] },
    upcomingSessions: { type: Array, default: () => [] },
    activities: { type: Object, default: () => ({ data: [], total: 0 }) },
});

const page = usePage();
const user = computed(() => page.props.auth.user);
const xpToNextLevel = computed(() => 500 - ((props.student?.xp ?? 0) % 500));
const subjectItems = computed(() => {
    const counts = new Map();
    for (const item of props.activities?.data ?? []) {
        const subject = item.activity?.subject || 'Outros';
        counts.set(subject, (counts.get(subject) || 0) + 1);
    }
    return [...counts].map(([label, value]) => ({ label, value }));
});
const completedActivities = computed(() => (props.activities?.data ?? []).filter(item => item.completed_by_student).length);
const completionItems = computed(() => [
    { label: 'Concluídas', value: completedActivities.value, color: 'var(--support-attention)' },
    { label: 'Para fazer', value: Math.max(0, (props.activities?.total ?? 0) - completedActivities.value), color: 'var(--support-followup)' },
]);
const xpItems = computed(() => [
    { label: 'Neste nível', value: (props.student?.xp ?? 0) % 500, color: 'var(--support-routine)' },
    { label: 'Para avançar', value: xpToNextLevel.value, color: 'var(--bg-secondary)' },
]);
</script>

<template>
    <DashboardLayout role="student">
        <Head title="Meu Painel - EducAdapta" />
        <div class="dashboard-page student-chart-theme">
            <header class="dashboard-heading">
                <div><h1>Olá, {{ user.name }}</h1><p>Seu espaço de aprendizagem, atividades e conquistas.</p></div>
                <span class="dashboard-pill"><i class="fas fa-graduation-cap" aria-hidden="true"></i> {{ student?.grade || 'Aluno' }}</span>
            </header>

            <section class="dashboard-stats" aria-label="Meu progresso">
                <article class="card dashboard-stat"><div class="dashboard-stat-copy"><div class="kpi-value">{{ student?.level ?? 1 }}</div><div class="kpi-label">Nível atual</div></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-purple)"><i class="fas fa-layer-group" aria-hidden="true"></i></span></article>
                <article class="card dashboard-stat"><div class="dashboard-stat-copy"><div class="kpi-value">{{ student?.xp ?? 0 }}</div><div class="kpi-label">Pontos de experiência</div></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-yellow)"><i class="fas fa-star" aria-hidden="true"></i></span></article>
                <article class="card dashboard-stat"><div class="dashboard-stat-copy"><div class="kpi-value">{{ activities?.total ?? 0 }}</div><div class="kpi-label">Atividades recebidas</div></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-blue)"><i class="fas fa-book-open" aria-hidden="true"></i></span></article>
                <article class="card dashboard-stat"><div class="dashboard-stat-copy"><div class="kpi-value">{{ recentAchievements.length }}</div><div class="kpi-label">Conquistas</div></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-pink)"><i class="fas fa-trophy" aria-hidden="true"></i></span></article>
            </section>

            <section class="dashboard-panels dashboard-chart-panels balanced-panels">
                <article v-if="todayActivity" class="dashboard-feature">
                    <div class="dashboard-panel-heading"><span class="dashboard-pill"><i class="fas fa-bullseye" aria-hidden="true"></i> Para hoje</span><span class="dashboard-pill">+{{ todayActivity.xp_earned }} XP</span></div>
                    <h2>{{ todayActivity.activity?.title }}</h2>
                    <p>{{ todayActivity.activity?.subject }} · {{ todayActivity.adapted_content?.slice(0, 240) }}{{ todayActivity.adapted_content?.length > 240 ? '…' : '' }}</p>
                    <Link :href="route('student.activities.complete', todayActivity.id)" method="post" as="button" class="btn"><i class="fas fa-check" aria-hidden="true"></i> Concluir atividade</Link>
                </article>
                <article v-else class="card dashboard-panel"><h2>Tudo em dia</h2><p class="dashboard-empty">Nenhuma atividade pendente agora. Continue explorando seus conteúdos.</p><Link :href="route('student.activities')" class="dashboard-inline-link">Ver atividades <i class="fas fa-arrow-right" aria-hidden="true"></i></Link></article>

                <article class="card dashboard-panel">
                    <div class="dashboard-panel-heading"><div><h2>Próximo nível</h2><p>{{ xpToNextLevel }} XP para avançar</p></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-yellow)"><i class="fas fa-arrow-up" aria-hidden="true"></i></span></div>
                    <DashboardDonutChart label="Progresso de XP para o próximo nível" center-label="XP" :center-value="(student?.xp ?? 0) % 500" :items="xpItems" />
                </article>
            </section>

            <section class="dashboard-panels dashboard-chart-panels balanced-panels">
                <article class="card dashboard-panel"><div class="dashboard-panel-heading"><div><h2>Minhas atividades</h2><p>{{ completedActivities }} de {{ activities?.total ?? 0 }} concluídas</p></div><Link :href="route('student.activities')" class="dashboard-inline-link">Ver todas <i class="fas fa-arrow-right" aria-hidden="true"></i></Link></div><DashboardBarChart label="Minhas atividades por componente curricular" :items="subjectItems" color="var(--support-routine)" /></article>
                <article class="card dashboard-panel"><div class="dashboard-panel-heading"><div><h2>Meu andamento</h2><p>Atividades concluídas e para fazer</p></div></div><DashboardDonutChart label="Atividades concluídas e para fazer" center-label="atividades" :items="completionItems" /></article>
            </section>

            <section class="dashboard-panels dashboard-chart-panels balanced-panels">
                <article class="card dashboard-panel">
                    <div class="dashboard-panel-heading"><div><h2>Próximas sessões</h2><p>Encontros agendados com sua equipe</p></div><Link :href="route('student.schedule')" class="dashboard-inline-link">Ver agenda <i class="fas fa-arrow-right" aria-hidden="true"></i></Link></div>
                    <div v-if="upcomingSessions.length" class="dashboard-data-list"><div v-for="session in upcomingSessions" :key="session.id" class="dashboard-data-row"><div class="dashboard-data-main"><strong>{{ session.focus }}</strong><span>{{ session.professional?.name }}</span></div><span class="dashboard-data-meta">{{ new Date(session.scheduled_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) }}</span></div></div>
                    <p v-else class="dashboard-empty">Nenhuma sessão agendada.</p>
                </article>
                <article class="card dashboard-panel">
                    <div class="dashboard-panel-heading"><div><h2>Conquistas recentes</h2><p>Marcos da sua jornada</p></div><Link :href="route('student.achievements')" class="dashboard-inline-link">Ver todas <i class="fas fa-arrow-right" aria-hidden="true"></i></Link></div>
                    <div v-if="recentAchievements.length" class="dashboard-data-list"><div v-for="achievement in recentAchievements.slice(0, 4)" :key="achievement.id" class="dashboard-data-row"><div class="dashboard-data-main"><strong><i :class="achievement.icon || 'fas fa-medal'" aria-hidden="true"></i> {{ achievement.title }}</strong><span>{{ achievement.description }}</span></div><span class="dashboard-data-meta">+{{ achievement.xp_reward }} XP</span></div></div>
                    <p v-else class="dashboard-empty">Suas conquistas vão aparecer aqui.</p>
                </article>
            </section>
        </div>
    </DashboardLayout>
</template>
