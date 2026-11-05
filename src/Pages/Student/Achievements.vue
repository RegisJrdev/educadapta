<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head } from '@/demo/navigation.js';
import { computed } from 'vue';

const props = defineProps({
    student: Object,
    achievements: { type: Array, default: () => [] },
});

const totalXp = computed(() => {
    if (props.student?.xp > 0) return props.student.xp;
    return (props.achievements || []).reduce((sum, a) => sum + (a.xp_reward || 0), 0);
});

const currentLevel = computed(() => Math.floor(totalXp.value / 500) + 1);
const xpProgress = computed(() => (totalXp.value % 500) / 5);
const xpToNext = computed(() => 500 - (totalXp.value % 500));

const iconMap = {
    'Primeira Atividade': 'fas fa-star',
    'Streak 3': 'fas fa-fire',
    'Streak 7': 'fas fa-fire-alt',
    'Nível 2': 'fas fa-arrow-up',
    'Nível 5': 'fas fa-rocket',
    'XP 100': 'fas fa-gem',
    'XP 500': 'fas fa-crown',
};

const getIcon = (title) => iconMap[title] || 'fas fa-trophy';

const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};
</script>

<template>
    <DashboardLayout role="student">
        <Head title="Conquistas - EducAdapta" />

        <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">
            <i class="fas fa-trophy" style="color: var(--accent-yellow);"></i> Minhas Conquistas
        </h1>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Seus troféus e badges ganhos ao completar atividades.</p>

        <!-- Level & XP Banner -->
        <div class="card" style="margin-bottom: 2rem; background: var(--primary); color: white; display: flex; align-items: center; flex-wrap: wrap; gap: 2rem; padding: 1.5rem;">
            <div style="text-align: center;">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700;">
                    {{ currentLevel }}
                </div>
                <p style="font-size: 0.75rem; margin-top: 0.25rem;">Nível</p>
            </div>
            <div style="flex: 1;">
                <p style="font-size: 1.1rem; font-weight: 600;">{{ totalXp }} XP</p>
                <div style="background: rgba(255,255,255,0.2); border-radius: 999px; height: 8px; margin-top: 0.5rem;">
                    <div style="height: 100%; border-radius: 999px; background: var(--lime); transition: width 0.5s;"
                        :style="{ width: xpProgress + '%' }"></div>
                </div>
                <p style="font-size: 0.7rem; margin-top: 0.25rem;">{{ xpToNext }} XP para o próximo nível</p>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 2rem; font-weight: 700;">{{ achievements?.length || 0 }}</div>
                <p style="font-size: 0.75rem;">Conquistas</p>
            </div>
        </div>

        <!-- Achievements Grid -->
        <div v-if="achievements?.length" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
            <div v-for="a in achievements" :key="a.id" class="card" style="text-align: center; padding: 1.5rem;">
                <div style="width: 60px; height: 60px; margin: 0 auto 0.75rem; border-radius: 50%; background: var(--lime); display: flex; align-items: center; justify-content: center;">
                    <i :class="a.icon || getIcon(a.title)" style="font-size: 1.5rem; color: #111b08;"></i>
                </div>
                <h3 style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.25rem;">{{ a.title }}</h3>
                <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.5rem;">{{ a.description }}</p>
                <div style="display: flex; justify-content: center; gap: 1rem; font-size: 0.7rem; color: var(--text-light);">
                    <span><i class="fas fa-gem"></i> +{{ a.xp_reward }} XP</span>
                    <span><i class="fas fa-calendar"></i> {{ formatDate(a.earned_at) }}</span>
                </div>
            </div>
        </div>

        <div v-else class="card" style="text-align: center; padding: 3rem;">
            <i class="fas fa-medal" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
            <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Nenhuma conquista ainda</h3>
            <p style="color: var(--text-secondary); font-size: 0.85rem;">Complete atividades para ganhar XP e desbloquear conquistas!</p>
        </div>
    </DashboardLayout>
</template>
