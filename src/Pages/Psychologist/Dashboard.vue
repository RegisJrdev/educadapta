<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head, Link, usePage } from '@/demo/navigation.js';
import DashboardBarChart from '@/Components/DashboardBarChart.vue';
import DashboardDonutChart from '@/Components/DashboardDonutChart.vue';
import { summarizePsychologistSessions } from '@/demo/data.js';
import { computed } from 'vue';

const props = defineProps({
    psychologistSessions: { type: Array, default: () => [] },
});

const page = usePage();
const user = computed(() => page.props.auth.user);
const summary = computed(() => summarizePsychologistSessions(props.psychologistSessions));
const upcomingSessions = computed(() => summary.value.upcoming);
const studentCount = computed(() => summary.value.studentCount);
const colors = ['var(--support-routine)', 'var(--support-attention)', 'var(--support-followup)', 'var(--support-priority)'];
const colored = items => items.map((item, index) => ({ ...item, color: colors[index % colors.length] }));
const statusStyles = { agendada: ['Agendada', 'var(--support-routine)'], concluida: ['Concluída', 'var(--support-attention)'], cancelada: ['Cancelada', 'var(--support-priority)'] };
const statusItems = computed(() => summary.value.statuses.map(item => ({ ...item, label: statusStyles[item.label]?.[0] || item.label, color: statusStyles[item.label]?.[1] || 'var(--support-followup)' })));
const focusItems = computed(() => colored(summary.value.focuses));
const sessionsByDay = computed(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + index);
    const key = date.toLocaleDateString('en-CA');
    return {
        label: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        value: upcomingSessions.value.filter(session => new Date(session.scheduled_at).toLocaleDateString('en-CA') === key).length,
    };
}));
</script>

<template>
    <DashboardLayout role="psychologist">
        <Head title="Painel Psicólogo - EducAdapta" />
        <div class="dashboard-page">
            <header class="dashboard-heading"><div><h1>Olá, {{ user.name }}</h1><p>Visão rápida dos alunos e dos atendimentos agendados.</p></div><div class="dashboard-heading-actions"><Link :href="route('psychologist.sessions')" class="btn btn-primary"><i class="fas fa-calendar-plus" aria-hidden="true"></i> Agendar sessão</Link></div></header>

            <section class="dashboard-stats dashboard-stats-three" aria-label="Resumo dos atendimentos">
                <article class="card dashboard-stat"><div class="dashboard-stat-copy"><div class="kpi-value">{{ studentCount }}</div><div class="kpi-label">Alunos com sessões registradas</div></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-blue)"><i class="fas fa-user-group" aria-hidden="true"></i></span></article>
                <article class="card dashboard-stat"><div class="dashboard-stat-copy"><div class="kpi-value">{{ psychologistSessions.length }}</div><div class="kpi-label">Sessões registradas</div></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-purple)"><i class="fas fa-calendar-check" aria-hidden="true"></i></span></article>
                <article class="card dashboard-stat"><div class="dashboard-stat-copy"><div class="kpi-value">{{ upcomingSessions.length }}</div><div class="kpi-label">Próximas sessões</div></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-pink)"><i class="fas fa-clock" aria-hidden="true"></i></span></article>
            </section>

            <section class="dashboard-panels dashboard-chart-panels psychologist-panels">
                <article class="card dashboard-panel">
                    <div class="dashboard-panel-heading"><div><h2>Agenda de atendimentos</h2><p>Próximos encontros e foco planejado</p></div><Link :href="route('psychologist.sessions')" class="dashboard-inline-link">Abrir agenda <i class="fas fa-arrow-right" aria-hidden="true"></i></Link></div>
                    <div v-if="upcomingSessions.length" class="dashboard-data-list"><div v-for="session in upcomingSessions.slice(0, 5)" :key="session.id" class="dashboard-data-row"><div class="dashboard-data-main"><strong>{{ session.student?.user?.name }}</strong><span>{{ session.focus }}</span></div><span class="dashboard-data-meta">{{ new Date(session.scheduled_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) }}</span></div></div>
                    <p v-else class="dashboard-empty">Nenhum atendimento agendado.</p>
                </article>
                <article class="card dashboard-panel psychologist-chart-panel">
                    <div class="dashboard-panel-heading"><div><h2>Sessões nos próximos dias</h2><p>Quantidade de horários agendados por data</p></div></div>
                    <DashboardBarChart label="Sessões agendadas nos próximos sete dias" :items="sessionsByDay" color="var(--support-routine)" />
                    <Link :href="route('psychologist.students')" class="dashboard-inline-link">Ver alunos acompanhados <i class="fas fa-arrow-right" aria-hidden="true"></i></Link>
                </article>
            </section>

            <section class="dashboard-panels dashboard-chart-panels psychologist-panels">
                <article class="card dashboard-panel psychologist-chart-panel">
                    <div class="dashboard-panel-heading"><div><h2>Situação das sessões</h2><p>Todos os seus registros, por status informado</p></div></div>
                    <DashboardDonutChart label="Minhas sessões por status" center-label="sessões" :items="statusItems" />
                </article>
                <article class="card dashboard-panel psychologist-chart-panel">
                    <div class="dashboard-panel-heading"><div><h2>Focos registrados</h2><p>Quantidade de sessões por foco informado</p></div></div>
                    <div v-if="focusItems.length" class="psychologist-focus-list">
                        <div v-for="item in focusItems" :key="item.label" class="psychologist-focus-row">
                            <div class="psychologist-focus-label"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></div>
                            <div class="dashboard-chart-track" aria-hidden="true"><div class="dashboard-chart-bar" :style="{ width: `${item.value / focusItems[0].value * 100}%`, '--chart-color': item.color }"></div></div>
                        </div>
                    </div>
                    <p v-else class="dashboard-empty">Nenhuma sessão registrada.</p>
                </article>
            </section>
        </div>
    </DashboardLayout>
</template>
