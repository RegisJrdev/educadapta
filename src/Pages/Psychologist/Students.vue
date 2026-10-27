<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head } from '@/demo/navigation.js';

const props = defineProps({
    students: { type: Array, default: () => [] },
});
</script>

<template>
    <DashboardLayout role="psychologist">
        <Head title="Alunos - EducAdapta" />

        <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">
            <i class="fas fa-user-graduate" style="color: var(--accent-blue);"></i> Meus Alunos
        </h1>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Alunos que você acompanha nas sessões.</p>

        <div v-if="students?.length" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">
            <div v-for="s in students" :key="s.id" class="card" style="padding: 1.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                    <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--accent-blue); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem;">
                        {{ s.user?.name?.charAt(0)?.toUpperCase() }}
                    </div>
                    <div>
                        <h3 style="font-weight: 700; font-size: 0.95rem;">{{ s.user?.name }}</h3>
                        <p style="font-size: 0.75rem; color: var(--text-secondary);">Nível {{ s.level }} • {{ s.xp }} XP</p>
                    </div>
                </div>

                <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem;">
                    <span v-if="s.ai_profile" class="badge badge-green" style="font-size: 0.65rem;">Perfil IA ✓</span>
                    <span v-else class="badge badge-yellow" style="font-size: 0.65rem;">Sem perfil IA</span>
                    <span v-for="d in (s.ai_profile?.disorders || [])" :key="d" class="badge" style="font-size: 0.6rem; background: rgba(139,92,246,0.1); color: var(--accent-purple);">{{ d }}</span>
                </div>

                <div style="padding-top: 0.75rem; border-top: 1px solid var(--border); display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary);">
                    <span><i class="fas fa-envelope"></i> {{ s.user?.email }}</span>
                </div>
            </div>
        </div>

        <div v-else class="card" style="text-align: center; padding: 3rem;">
            <i class="fas fa-users" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
            <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Nenhum aluno vinculado</h3>
            <p style="color: var(--text-secondary); font-size: 0.85rem;">Agende sessões para vincular alunos ao seu perfil.</p>
        </div>
    </DashboardLayout>
</template>
