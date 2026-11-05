<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head, Link } from '@/demo/navigation.js';

const props = defineProps({
    students: { type: Array, default: () => [] },
});
</script>

<template>
    <DashboardLayout role="psychopedagogue">
        <Head title="Alunos - EducAdapta" />

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <div>
                <h1 style="font-size: 1.5rem; font-weight: 700;"><i class="fas fa-user-graduate" style="color: var(--accent-blue);"></i> Alunos</h1>
                <p style="color: var(--text-secondary); font-size: 0.875rem;">Todos os alunos disponíveis para configuração de perfil IA.</p>
            </div>
            <Link :href="route('psychopedagogue.train-ai')" class="btn btn-primary">
                <i class="fas fa-brain"></i> Treinar IA
            </Link>
        </div>

        <div v-if="students?.length" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 1rem;">
            <div v-for="s in students" :key="s.id" class="card" style="padding: 1.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                    <div style="width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; color: white;"
                        :style="{ background: s.ai_profile ? 'var(--accent-green-solid)' : 'var(--accent-purple-solid)' }">
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

                <div v-if="s.ai_profile" style="padding: 0.5rem; background: var(--bg-light); border-radius: var(--radius-sm); font-size: 0.75rem; margin-bottom: 0.75rem;">
                    <p><strong>Complexidade:</strong> {{ s.ai_profile.complexity_level }}</p>
                    <p><strong>Preferência:</strong> {{ s.ai_profile.sensory_preference }}</p>
                </div>

                <div style="display: flex; gap: 0.5rem;">
                    <Link :href="route('psychopedagogue.train-ai')" class="btn btn-sm btn-outline" style="flex: 1; font-size: 0.75rem;">
                        <i class="fas fa-cog"></i> {{ s.ai_profile ? 'Editar Perfil' : 'Criar Perfil' }}
                    </Link>
                </div>
            </div>
        </div>

        <div v-else class="card" style="text-align: center; padding: 3rem;">
            <i class="fas fa-users" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
            <p style="color: var(--text-secondary);">Nenhum aluno cadastrado no sistema.</p>
        </div>
    </DashboardLayout>
</template>
