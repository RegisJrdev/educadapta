<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head, Link, usePage } from '@/demo/navigation.js';
import { computed } from 'vue';

const props = defineProps({
    totalStudents: { type: Number, default: 0 },
    totalProfiles: { type: Number, default: 0 },
    totalPlans: { type: Number, default: 0 },
    linkedStudents: { type: Array, default: () => [] },
});

const page = usePage();
const user = computed(() => page.props.auth.user);
</script>

<template>
    <DashboardLayout role="psychopedagogue">
        <Head title="Painel Psicopedagoga - EducAdapta" />

        <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem;">Olá, {{ user.name }}! </h1>

        <div class="grid grid-3" style="margin-bottom: 2rem;">
            <div class="card kpi-card">
                <div class="kpi-value">{{ totalStudents }}</div>
                <div class="kpi-label">Alunos Vinculados</div>
            </div>
            <div class="card kpi-card">
                <div class="kpi-value" style="color: var(--accent-purple);">{{ totalProfiles }}</div>
                <div class="kpi-label">Perfis IA</div>
            </div>
            <div class="card kpi-card">
                <div class="kpi-value" style="color: var(--accent-green);">{{ totalPlans }}</div>
                <div class="kpi-label">Planos</div>
            </div>
        </div>

        <div class="grid grid-2">
            <div class="card">
                <h3 style="font-size: 1rem; margin-bottom: 1rem;"><i class="fas fa-brain" style="color: var(--accent-purple);"></i> Ação Rápida</h3>
                <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">Configure perfis de IA para personalizar a adaptação das atividades dos alunos.</p>
                <Link :href="route('psychopedagogue.train-ai')" class="btn btn-primary">
                    <i class="fas fa-cog"></i> Treinar IA
                </Link>
            </div>

            <div class="card">
                <h3 style="font-size: 1rem; margin-bottom: 1rem;"><i class="fas fa-user-graduate" style="color: var(--accent-blue);"></i> Alunos Vinculados</h3>
                <div v-if="linkedStudents?.length">
                    <div v-for="s in linkedStudents" :key="s.id" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid var(--border);">
                        <div style="width: 32px; height: 32px; background: var(--accent-blue); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem;">
                            {{ s.user?.name?.charAt(0) }}
                        </div>
                        <div>
                            <p style="font-weight: 600; font-size: 0.875rem;">{{ s.user?.name }}</p>
                            <p style="font-size: 0.7rem; color: var(--text-secondary);">Nível {{ s.level }} • {{ s.xp }} XP</p>
                        </div>
                    </div>
                </div>
                <p v-else style="color: var(--text-secondary); font-size: 0.875rem;">Nenhum aluno vinculado ainda.</p>
            </div>
        </div>
    </DashboardLayout>
</template>
