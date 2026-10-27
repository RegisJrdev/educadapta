<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head } from '@/demo/navigation.js';

const props = defineProps({
    teachers: { type: Array, default: () => [] },
});
</script>

<template>
    <DashboardLayout role="institution">
        <Head title="Professores - EducAdapta" />

        <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">
            <i class="fas fa-chalkboard-teacher" style="color: var(--accent-blue);"></i> Professores
        </h1>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Todos os professores cadastrados na plataforma.</p>

        <div v-if="teachers?.length" class="card" style="overflow: hidden; padding: 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: var(--bg-light);">
                        <th style="text-align: left; padding: 0.75rem 1rem; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Professor</th>
                        <th style="text-align: left; padding: 0.75rem 1rem; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Email</th>
                        <th style="text-align: center; padding: 0.75rem 1rem; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Atividades</th>
                        <th style="text-align: right; padding: 0.75rem 1rem; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Cadastro</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="t in teachers" :key="t.id" style="border-top: 1px solid var(--border);">
                        <td style="padding: 0.75rem 1rem;">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--accent-blue); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem;">
                                    {{ t.name?.charAt(0)?.toUpperCase() }}
                                </div>
                                <span style="font-weight: 600; font-size: 0.875rem;">{{ t.name }}</span>
                            </div>
                        </td>
                        <td style="padding: 0.75rem 1rem; font-size: 0.85rem; color: var(--text-secondary);">{{ t.email }}</td>
                        <td style="padding: 0.75rem 1rem; text-align: center;">
                            <span style="font-weight: 700; font-size: 0.9rem;">{{ t.total_activities || 0 }}</span>
                        </td>
                        <td style="padding: 0.75rem 1rem; text-align: right; font-size: 0.8rem; color: var(--text-secondary);">
                            {{ new Date(t.created_at).toLocaleDateString('pt-BR') }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else class="card" style="text-align: center; padding: 3rem;">
            <i class="fas fa-chalkboard-teacher" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
            <p style="color: var(--text-secondary);">Nenhum professor cadastrado.</p>
        </div>
    </DashboardLayout>
</template>
