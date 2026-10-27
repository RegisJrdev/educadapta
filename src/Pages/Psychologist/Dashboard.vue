<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head, Link, usePage } from '@/demo/navigation.js';
import { computed } from 'vue';

const props = defineProps({
    totalStudents: { type: Number, default: 0 },
    upcomingSessions: { type: Array, default: () => [] },
    totalSessions: { type: Number, default: 0 },
});

const page = usePage();
const user = computed(() => page.props.auth.user);
</script>

<template>
    <DashboardLayout role="psychologist">
        <Head title="Painel Psicólogo - EducAdapta" />

        <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem;">Olá, {{ user.name }}! </h1>

        <div class="grid grid-3" style="margin-bottom: 2rem;">
            <div class="card kpi-card">
                <div class="kpi-value">{{ totalStudents }}</div>
                <div class="kpi-label">Alunos Vinculados</div>
            </div>
            <div class="card kpi-card">
                <div class="kpi-value">{{ totalSessions }}</div>
                <div class="kpi-label">Total Sessões</div>
            </div>
            <div class="card kpi-card">
                <div class="kpi-value" style="color: var(--accent-green);">{{ upcomingSessions?.length ?? 0 }}</div>
                <div class="kpi-label">Próximas</div>
            </div>
        </div>

        <div class="grid grid-2">
            <div class="card">
                <h3 style="font-size: 1rem; margin-bottom: 1rem;"><i class="fas fa-calendar-check" style="color: var(--accent-blue);"></i> Próximas Sessões</h3>
                <div v-if="upcomingSessions?.length">
                    <div v-for="session in upcomingSessions" :key="session.id" style="padding: 0.5rem 0; border-bottom: 1px solid var(--border);">
                        <p style="font-weight: 600; font-size: 0.875rem;">{{ session.focus }}</p>
                        <p style="font-size: 0.75rem; color: var(--text-secondary);">{{ session.student?.user?.name }}</p>
                    </div>
                </div>
                <p v-else style="color: var(--text-secondary); font-size: 0.875rem;">Nenhuma sessão agendada.</p>
            </div>

            <div class="card">
                <h3 style="font-size: 1rem; margin-bottom: 1rem;"><i class="fas fa-plus-circle" style="color: var(--accent-green);"></i> Ações Rápidas</h3>
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <Link :href="route('psychologist.sessions')" class="btn btn-primary">
                        <i class="fas fa-calendar-plus"></i> Ver Sessões
                    </Link>
                    <Link :href="route('psychologist.students')" class="btn btn-outline">
                        <i class="fas fa-user-graduate"></i> Ver Alunos
                    </Link>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>
