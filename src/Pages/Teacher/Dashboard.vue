<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head, Link, usePage } from '@/demo/navigation.js';
import { computed } from 'vue';

const props = defineProps({
    totalStudents: { type: Number, default: 0 },
    totalActivities: { type: Number, default: 0 },
    pendingAdaptations: { type: Number, default: 0 },
    recentActivities: { type: Array, default: () => [] },
});

const page = usePage();
const user = computed(() => page.props.auth.user);
</script>

<template>
    <DashboardLayout role="teacher">
        <Head title="Painel Professor - EducAdapta" />

        <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem;">Olá, {{ user.name }}! </h1>

        <div class="grid grid-3" style="margin-bottom: 2rem;">
            <div class="card kpi-card">
                <div class="kpi-value">{{ totalStudents }}</div>
                <div class="kpi-label">Alunos</div>
            </div>
            <div class="card kpi-card">
                <div class="kpi-value">{{ totalActivities }}</div>
                <div class="kpi-label">Atividades</div>
            </div>
            <div class="card kpi-card">
                <div class="kpi-value" style="color: var(--accent-yellow);">{{ pendingAdaptations }}</div>
                <div class="kpi-label">Pendentes</div>
            </div>
        </div>

        <div class="grid grid-2">
            <div class="card">
                <h3 style="font-size: 1rem; margin-bottom: 1rem;"><i class="fas fa-magic" style="color: var(--accent-purple);"></i> Ação Rápida</h3>
                <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">Envie uma atividade para ser adaptada pela IA para cada aluno.</p>
                <Link :href="route('teacher.adapt.form')" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Adaptar Atividade
                </Link>
            </div>

            <div class="card">
                <h3 style="font-size: 1rem; margin-bottom: 1rem;"><i class="fas fa-clock" style="color: var(--accent-blue);"></i> Atividades Recentes</h3>
                <div v-if="recentActivities?.length">
                    <div v-for="a in recentActivities" :key="a.id" style="padding: 0.5rem 0; border-bottom: 1px solid var(--border);">
                        <p style="font-weight: 600; font-size: 0.875rem;">{{ a.title }}</p>
                        <p style="font-size: 0.75rem; color: var(--text-secondary);">{{ a.subject }}</p>
                    </div>
                </div>
                <p v-else style="color: var(--text-secondary); font-size: 0.875rem;">Nenhuma atividade ainda.</p>
            </div>
        </div>
    </DashboardLayout>
</template>
