<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head, Link, usePage } from '@/demo/navigation.js';
import DashboardBarChart from '@/Components/DashboardBarChart.vue';
import DashboardDonutChart from '@/Components/DashboardDonutChart.vue';
import { computed } from 'vue';

const props = defineProps({
    totalStudents: { type: Number, default: 0 },
    teacherDashboard: { type: Object, default: () => ({ riskDistribution: {}, recentActivities: [] }) },
    classRooms: { type: Array, default: () => [] },
});

const page = usePage();
const user = computed(() => page.props.auth.user);
const supportItems = computed(() => [
    { label: 'Rotina', value: props.teacherDashboard.riskDistribution?.baixo || 0, color: 'var(--support-routine)' },
    { label: 'Atenção', value: props.teacherDashboard.riskDistribution?.atencao || 0, color: 'var(--support-attention)' },
    { label: 'Próximo', value: props.teacherDashboard.riskDistribution?.moderado || 0, color: 'var(--support-followup)' },
    { label: 'Prioritário', value: props.teacherDashboard.riskDistribution?.alto || 0, color: 'var(--support-priority)' },
]);
const adaptationItems = computed(() => [
    { label: 'Concluídas pelo aluno', value: props.teacherDashboard.completedAdaptations || 0, color: 'var(--support-attention)' },
    { label: 'Ainda não concluídas', value: (props.teacherDashboard.totalAdapted || 0) - (props.teacherDashboard.completedAdaptations || 0), color: 'var(--support-routine)' },
]);
</script>

<template>
    <DashboardLayout role="teacher">
        <Head title="Painel Professor - EducAdapta" />
        <div class="dashboard-page">
            <header class="dashboard-heading">
                <div>
                    <h1>Olá, {{ user.name }}</h1>
                    <p>Acompanhe suas turmas e prepare novas atividades.</p>
                </div>
                <div class="dashboard-heading-actions">
                    <Link :href="route('teacher.adapt.form')" class="btn btn-primary"><i class="fas fa-wand-magic-sparkles" aria-hidden="true"></i> Adaptar atividade</Link>
                </div>
            </header>

            <section class="dashboard-stats" aria-label="Resumo do professor">
                <article class="card dashboard-stat"><div class="dashboard-stat-copy"><div class="kpi-value">{{ totalStudents }}</div><div class="kpi-label">Alunos cadastrados</div></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-blue)"><i class="fas fa-user-group" aria-hidden="true"></i></span></article>
                <article class="card dashboard-stat"><div class="dashboard-stat-copy"><div class="kpi-value">{{ teacherDashboard.totalActivities }}</div><div class="kpi-label">Atividades criadas</div></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-pink)"><i class="fas fa-book-open" aria-hidden="true"></i></span></article>
                <article class="card dashboard-stat"><div class="dashboard-stat-copy"><div class="kpi-value">{{ teacherDashboard.totalAdapted }}</div><div class="kpi-label">Adaptações preparadas</div></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-purple)"><i class="fas fa-wand-magic-sparkles" aria-hidden="true"></i></span></article>
                <article class="card dashboard-stat"><div class="dashboard-stat-copy"><div class="kpi-value">{{ teacherDashboard.totalScreenings }}</div><div class="kpi-label">Triagens registradas</div></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-green)"><i class="fas fa-clipboard-check" aria-hidden="true"></i></span></article>
            </section>

            <section class="dashboard-panels dashboard-chart-panels">
                <article class="card dashboard-panel teacher-chart-panel">
                    <div class="dashboard-panel-heading"><div><h2>Andamento das adaptações</h2><p>Conclusões dos alunos nas atividades criadas por você</p></div></div>
                    <DashboardDonutChart label="Adaptações das minhas atividades por conclusão do aluno" center-label="adaptações" :items="adaptationItems" />
                </article>
                <article class="card dashboard-panel teacher-chart-panel teacher-bar-panel">
                    <div class="dashboard-panel-heading"><div><h2>Minhas triagens por faixa</h2><p>{{ teacherDashboard.totalScreenings }} registros feitos por você; faixas baseadas no questionário</p></div><Link :href="route('teacher.screenings')" class="dashboard-inline-link">Ver triagens <i class="fas fa-arrow-right" aria-hidden="true"></i></Link></div>
                    <DashboardBarChart label="Minhas triagens por faixa de acompanhamento" :items="supportItems" />
                </article>
            </section>

            <section>
                <article class="card dashboard-panel">
                    <div class="dashboard-panel-heading"><div><h2>Turmas cadastradas</h2><p>Alunos por grupo</p></div><Link :href="route('teacher.classes')" class="dashboard-inline-link">Ver turmas <i class="fas fa-arrow-right" aria-hidden="true"></i></Link></div>
                    <div v-if="classRooms.length" class="dashboard-data-list"><div v-for="room in classRooms" :key="room.id" class="dashboard-data-row"><div class="dashboard-data-main"><strong>{{ room.name }}</strong><span>{{ room.grade }} · {{ room.year }}</span></div><span class="dashboard-pill">{{ room.students_count }} alunos</span></div></div>
                    <p v-else class="dashboard-empty">Nenhuma turma cadastrada.</p>
                </article>
            </section>

            <section class="card dashboard-panel"><div class="dashboard-panel-heading"><div><h2>Atividades recentes</h2><p>Últimos materiais preparados por você</p></div><Link :href="route('teacher.adapt.form')" class="dashboard-inline-link">Criar atividade <i class="fas fa-arrow-right" aria-hidden="true"></i></Link></div><div v-if="teacherDashboard.recentActivities?.length" class="dashboard-data-list"><div v-for="activity in teacherDashboard.recentActivities.slice(0, 5)" :key="activity.id" class="dashboard-data-row"><div class="dashboard-data-main"><strong>{{ activity.title }}</strong><span>{{ activity.subject }} · {{ activity.adapted_activities_count }} adaptações</span></div><span class="dashboard-pill">{{ activity.status }}</span></div></div><p v-else class="dashboard-empty">Nenhuma atividade cadastrada ainda.</p></section>
        </div>
    </DashboardLayout>
</template>
