<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head } from '@/demo/navigation.js';

const props = defineProps({
    students: { type: Array, default: () => [] },
});
</script>

<template>
    <DashboardLayout role="institution">
        <Head title="Alunos - EducAdapta" />

        <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">
            <i class="fas fa-user-graduate" style="color: var(--accent-purple);"></i> Alunos
        </h1>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Todos os alunos cadastrados na plataforma.</p>

        <div v-if="students?.length" class="card" style="overflow: hidden; padding: 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: var(--bg-light);">
                        <th style="text-align: left; padding: 0.75rem 1rem; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Aluno</th>
                        <th style="text-align: left; padding: 0.75rem 1rem; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Email</th>
                        <th style="text-align: center; padding: 0.75rem 1rem; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Nível</th>
                        <th style="text-align: center; padding: 0.75rem 1rem; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">XP</th>
                        <th style="text-align: center; padding: 0.75rem 1rem; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Perfil IA</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="s in students" :key="s.id" style="border-top: 1px solid var(--border);">
                        <td style="padding: 0.75rem 1rem;">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <div style="width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; color: white;"
                                    :style="{ background: s.ai_profile ? 'var(--accent-green)' : 'var(--accent-purple)' }">
                                    {{ s.user?.name?.charAt(0)?.toUpperCase() }}
                                </div>
                                <span style="font-weight: 600; font-size: 0.875rem;">{{ s.user?.name }}</span>
                            </div>
                        </td>
                        <td style="padding: 0.75rem 1rem; font-size: 0.85rem; color: var(--text-secondary);">{{ s.user?.email }}</td>
                        <td style="padding: 0.75rem 1rem; text-align: center;">
                            <span style="font-weight: 700;">{{ s.level }}</span>
                        </td>
                        <td style="padding: 0.75rem 1rem; text-align: center;">
                            <span style="font-weight: 600; color: var(--accent-blue);">{{ s.xp }}</span>
                        </td>
                        <td style="padding: 0.75rem 1rem; text-align: center;">
                            <span v-if="s.ai_profile" class="badge badge-green" style="font-size: 0.65rem;">Configurado</span>
                            <span v-else class="badge badge-yellow" style="font-size: 0.65rem;">Pendente</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else class="card" style="text-align: center; padding: 3rem;">
            <i class="fas fa-users" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
            <p style="color: var(--text-secondary);">Nenhum aluno cadastrado.</p>
        </div>
    </DashboardLayout>
</template>
