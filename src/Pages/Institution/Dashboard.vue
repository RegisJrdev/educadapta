<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head, Link, usePage } from '@/demo/navigation.js';
import DashboardBarChart from '@/Components/DashboardBarChart.vue';
import DashboardDonutChart from '@/Components/DashboardDonutChart.vue';
import DashboardLineChart from '@/Components/DashboardLineChart.vue';
import UiButton from '@/Components/ui/Button.vue';
import { computed } from 'vue';

const props = defineProps({
    totalTeachers: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    totalActivities: { type: Number, default: 0 },
    totalAdapted: { type: Number, default: 0 },
    totalCompleted: { type: Number, default: 0 },
    adaptationRate: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    topTeachers: { type: Array, default: () => [] },
    activitiesBySubject: { type: Array, default: () => [] },
    recentScreenings: { type: Array, default: () => [] },
    riskDistribution: { type: Object, default: () => ({}) },
    timelineLabels: { type: Array, default: () => [] },
    activityTrend: { type: Array, default: () => [] },
    screeningTrend: { type: Array, default: () => [] },
});

const page = usePage();
const user = computed(() => page.props.auth.user);
const totalScreenings = computed(() => Object.values(props.riskDistribution).reduce((sum, count) => sum + count, 0));
const subjectItems = computed(() => props.activitiesBySubject.map((item, index) => ({
    label: item.subject,
    value: item.total,
    color: ['var(--primary)', 'var(--accent-pink)', 'var(--accent-yellow)', 'var(--accent-purple)'][index % 4],
})));
const supportItems = computed(() => [
    { label: 'Rotina', value: props.riskDistribution.baixo || 0, color: 'var(--support-routine)' },
    { label: 'Atenção pontual', value: props.riskDistribution.atencao || 0, color: 'var(--support-attention)' },
    { label: 'Acompanhamento próximo', value: props.riskDistribution.moderado || 0, color: 'var(--support-followup)' },
    { label: 'Apoio prioritário', value: props.riskDistribution.alto || 0, color: 'var(--support-priority)' },
]);
const hasRoute = name => { try { route(name); return true; } catch { return false; } };
const initials = name => name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0].toLocaleUpperCase('pt-BR')).join('') || '?';
</script>

<template>
    <DashboardLayout role="institution">
        <Head title="Painel Instituição - EducAdapta" />
        <div class="dashboard-page">
            <header class="dashboard-heading"><div><h1>Olá, {{ user.name }}</h1><p>Visão geral da instituição e das atividades na plataforma.</p></div><div class="dashboard-heading-actions"><UiButton v-if="hasRoute('institution.screenings')" variant="outline" as-child><Link :href="route('institution.screenings')"><i class="fas fa-clipboard-check" aria-hidden="true"></i> Triagens</Link></UiButton><UiButton v-if="hasRoute('institution.reports')" as-child><Link :href="route('institution.reports')"><i class="fas fa-chart-column" aria-hidden="true"></i> Relatórios</Link></UiButton></div></header>

            <section class="dashboard-stats" aria-label="Resumo institucional">
                <article class="card dashboard-stat"><div class="dashboard-stat-copy"><div class="kpi-value">{{ totalTeachers }}</div><div class="kpi-label">Professores</div></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-blue)"><i class="fas fa-chalkboard-teacher" aria-hidden="true"></i></span></article>
                <article class="card dashboard-stat"><div class="dashboard-stat-copy"><div class="kpi-value">{{ totalStudents }}</div><div class="kpi-label">Alunos</div></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-pink)"><i class="fas fa-user-graduate" aria-hidden="true"></i></span></article>
                <article class="card dashboard-stat"><div class="dashboard-stat-copy"><div class="kpi-value">{{ totalActivities }}</div><div class="kpi-label">Atividades</div></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-purple)"><i class="fas fa-book-open" aria-hidden="true"></i></span></article>
                <article class="card dashboard-stat"><div class="dashboard-stat-copy"><div class="kpi-value">{{ totalAdapted }}</div><div class="kpi-label">Adaptações preparadas</div></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-green)"><i class="fas fa-wand-magic-sparkles" aria-hidden="true"></i></span></article>
            </section>

            <section class="dashboard-panels dashboard-chart-panels institution-chart-panels">
                <article class="card dashboard-panel">
                    <div class="dashboard-panel-heading"><div><h2>Atividades e triagens</h2><p>Últimos sete dias do histórico</p></div></div>
                    <DashboardLineChart label="Atividades e triagens registradas por data" :labels="timelineLabels" :series="[{ label: 'Atividades', values: activityTrend, color: 'var(--primary)' }, { label: 'Triagens', values: screeningTrend, color: 'var(--accent-yellow)' }]" />
                </article>
                <article class="card dashboard-panel institution-bar-panel">
                    <div class="dashboard-panel-heading"><div><h2>Atividades por componente</h2><p>Distribuição das atividades cadastradas</p></div></div>
                    <DashboardBarChart label="Atividades cadastradas por componente curricular" :items="subjectItems" />
                </article>
            </section>

            <section class="dashboard-panels institution-detail-panels">
                <article class="card dashboard-panel institution-support-panel">
                    <div class="dashboard-panel-heading"><div><h2>Acompanhamento pedagógico</h2><p>{{ totalScreenings }} registros · faixas baseadas no questionário, sem uso de notas</p></div><Link :href="route('institution.screenings')" class="dashboard-inline-link">Abrir painel <i class="fas fa-arrow-right" aria-hidden="true"></i></Link></div>
                    <DashboardDonutChart label="Distribuição das triagens por faixa de acompanhamento" center-label="triagens" :items="supportItems" />
                </article>
                <article class="card dashboard-panel">
                    <div class="dashboard-panel-heading"><div><h2>Triagens recentes</h2><p>Observações registradas pelos professores</p></div><Link :href="route('institution.screenings')" class="dashboard-inline-link">Ver todas <i class="fas fa-arrow-right" aria-hidden="true"></i></Link></div>
                    <div v-if="recentScreenings.length" class="dashboard-data-list"><div v-for="screening in recentScreenings" :key="screening.id" class="dashboard-data-row"><div class="dashboard-data-main"><strong>{{ screening.student }}</strong><span>Registrada em {{ screening.created_at }}</span></div><span class="dashboard-pill">{{ screening.score_geral }}%</span></div></div>
                    <p v-else class="dashboard-empty">Nenhuma triagem registrada.</p>
                </article>

                <article class="card dashboard-panel">
                    <div class="dashboard-panel-heading"><div><h2>Visão de participação</h2><p>Resumo demonstrativo das atividades</p></div></div>
                    <div class="dashboard-data-list">
                        <div class="dashboard-data-row"><div class="dashboard-data-main"><strong>Atividades concluídas</strong><span>Registros marcados como concluídos</span></div><span class="dashboard-data-meta">{{ totalCompleted }}</span></div>
                        <div class="dashboard-data-row"><div class="dashboard-data-main"><strong>Conclusão</strong><span>Concluídas entre as adaptações</span></div><span class="dashboard-data-meta">{{ completionRate }}%</span></div>
                        <div class="dashboard-data-row"><div class="dashboard-data-main"><strong>Adaptação</strong><span>Atividades com adaptação preparada</span></div><span class="dashboard-data-meta">{{ adaptationRate }}%</span></div>
                    </div>
                </article>
                <article class="card dashboard-panel">
                    <div class="dashboard-panel-heading"><div><h2>Professores</h2><p>Atividades cadastradas por integrante</p></div><Link :href="route('institution.teachers')" class="dashboard-inline-link">Ver equipe</Link></div>
                    <ul v-if="topTeachers.length" class="dashboard-data-list teacher-list">
                        <li v-for="(teacher, index) in topTeachers" :key="teacher.id" class="dashboard-data-row teacher-row">
                            <div class="teacher-avatar" :style="{ '--teacher-color': ['var(--accent-blue)', 'var(--accent-pink)', 'var(--accent-purple)', 'var(--accent-green)'][index % 4] }" aria-hidden="true">{{ initials(teacher.name) }}</div>
                            <div class="dashboard-data-main"><strong>{{ teacher.name }}</strong><span>Professor(a)</span></div>
                            <span class="teacher-count">{{ teacher.total_activities }} {{ teacher.total_activities === 1 ? 'atividade' : 'atividades' }}</span>
                        </li>
                    </ul>
                    <p v-else class="dashboard-empty">Nenhum professor cadastrado.</p>
                </article>
            </section>
        </div>
    </DashboardLayout>
</template>
