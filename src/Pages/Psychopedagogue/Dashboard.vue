<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head, Link, usePage } from '@/demo/navigation.js';
import DashboardBarChart from '@/Components/DashboardBarChart.vue';
import DashboardDonutChart from '@/Components/DashboardDonutChart.vue';
import { computed } from 'vue';

const props = defineProps({
    totalStudents: { type: Number, default: 0 },
    totalProfiles: { type: Number, default: 0 },
    totalPlans: { type: Number, default: 0 },
    linkedStudents: { type: Array, default: () => [] },
    plans: { type: Object, default: () => ({ data: [] }) },
});

const page = usePage();
const user = computed(() => page.props.auth.user);
const profileCoverage = computed(() => props.totalStudents ? Math.round(props.totalProfiles / props.totalStudents * 100) : 0);
const profileItems = computed(() => [
    { label: 'Configurados', value: props.totalProfiles, color: 'var(--support-attention)' },
    { label: 'Pendentes', value: Math.max(0, props.totalStudents - props.totalProfiles), color: 'var(--support-followup)' },
]);
const planItems = computed(() => {
    const counts = new Map();
    for (const plan of props.plans?.data ?? []) {
        const status = plan.status || 'Sem status';
        counts.set(status, (counts.get(status) || 0) + 1);
    }
    return [...counts].map(([label, value]) => ({ label: label[0].toUpperCase() + label.slice(1), value }));
});
</script>

<template>
    <DashboardLayout role="psychopedagogue">
        <Head title="Painel Psicopedagogo - EducAdapta" />
        <div class="dashboard-page psychopedagogue-chart-theme">
            <header class="dashboard-heading"><div><h1>Olá, {{ user.name }}</h1><p>Perfis de adaptação e planos pedagógicos em um só lugar.</p></div><div class="dashboard-heading-actions"><Link :href="route('psychopedagogue.train-ai')" class="btn btn-primary"><i class="fas fa-sliders" aria-hidden="true"></i> Configurar perfil</Link><Link :href="route('psychopedagogue.plans')" class="btn btn-outline"><i class="fas fa-plus" aria-hidden="true"></i> Novo plano</Link></div></header>

            <section class="dashboard-stats" aria-label="Resumo psicopedagógico">
                <article class="card dashboard-stat"><div class="dashboard-stat-copy"><div class="kpi-value">{{ totalStudents }}</div><div class="kpi-label">Alunos acompanhados</div></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-blue)"><i class="fas fa-user-group" aria-hidden="true"></i></span></article>
                <article class="card dashboard-stat"><div class="dashboard-stat-copy"><div class="kpi-value">{{ totalProfiles }}</div><div class="kpi-label">Perfis configurados</div></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-purple)"><i class="fas fa-sliders" aria-hidden="true"></i></span></article>
                <article class="card dashboard-stat"><div class="dashboard-stat-copy"><div class="kpi-value">{{ totalPlans }}</div><div class="kpi-label">Planos pedagógicos</div></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-green)"><i class="fas fa-clipboard-list" aria-hidden="true"></i></span></article>
                <article class="card dashboard-stat"><div class="dashboard-stat-copy"><div class="kpi-value">{{ profileCoverage }}%</div><div class="kpi-label">Cobertura de perfis</div></div><span class="dashboard-stat-icon" style="--stat-color:var(--accent-pink)"><i class="fas fa-chart-pie" aria-hidden="true"></i></span></article>
            </section>

            <section class="dashboard-panels dashboard-chart-panels balanced-panels">
                <article class="card dashboard-panel"><div class="dashboard-panel-heading"><div><h2>Perfis de adaptação</h2><p>Alunos com configuração ativa ou pendente</p></div></div><DashboardDonutChart label="Alunos com perfil de adaptação configurado ou pendente" center-label="alunos" :items="profileItems" /></article>
                <article class="card dashboard-panel"><div class="dashboard-panel-heading"><div><h2>Planos pedagógicos</h2><p>{{ totalPlans }} planos registrados por situação</p></div><Link :href="route('psychopedagogue.plans')" class="dashboard-inline-link">Ver planos <i class="fas fa-arrow-right" aria-hidden="true"></i></Link></div><DashboardBarChart label="Planos pedagógicos por situação" :items="planItems" color="var(--support-routine)" /></article>
            </section>

            <section class="dashboard-panels dashboard-chart-panels balanced-panels">
                <article class="card dashboard-panel">
                    <div class="dashboard-panel-heading"><div><h2>Alunos vinculados</h2><p>Acesse os dados de adaptação de cada aluno</p></div><Link :href="route('psychopedagogue.students')" class="dashboard-inline-link">Ver todos <i class="fas fa-arrow-right" aria-hidden="true"></i></Link></div>
                    <div v-if="linkedStudents.length" class="dashboard-data-list"><div v-for="student in linkedStudents.slice(0, 6)" :key="student.id" class="dashboard-data-row"><div class="dashboard-data-main"><strong>{{ student.user?.name }}</strong><span>{{ student.grade }} · {{ student.ai_profile ? 'Perfil configurado' : 'Perfil pendente' }}</span></div><span class="dashboard-data-meta">Nível {{ student.level }}</span></div></div>
                    <p v-else class="dashboard-empty">Nenhum aluno vinculado.</p>
                </article>

                <article class="dashboard-feature">
                    <span class="dashboard-pill"><i class="fas fa-wand-magic-sparkles" aria-hidden="true"></i> Adaptação de atividades</span>
                    <h2>Personalize o apoio para cada aluno</h2>
                    <p>Configure preferências, complexidade e orientações que ajudam a adaptar as atividades.</p>
                    <Link :href="route('psychopedagogue.train-ai')" class="btn"><i class="fas fa-sliders" aria-hidden="true"></i> Abrir perfis de adaptação</Link>
                </article>
            </section>
        </div>
    </DashboardLayout>
</template>
