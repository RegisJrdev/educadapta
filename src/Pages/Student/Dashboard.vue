<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head, Link, usePage } from '@/demo/navigation.js';
import { computed } from 'vue';

const props = defineProps({
    student: Object,
    todayActivity: Object,
    recentAchievements: Array,
    upcomingSessions: Array,
});

const page = usePage();
const user = computed(() => page.props.auth.user);
const xpProgress = computed(() => ((props.student?.xp ?? 0) % 500) / 500 * 100);
</script>

<template>
    <DashboardLayout role="student">
        <Head title="Meu Painel - EducAdapta" />

        <!-- Welcome + XP -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
            <div>
                <h1 style="font-size: 1.5rem; font-weight: 700;">Olá, {{ user.name }}! </h1>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">Meu Foco de Hoje</p>
            </div>
            <div class="card" style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1.25rem;">
                <span class="badge badge-purple">Nível {{ student?.level ?? 1 }}</span>
                <div class="xp-bar" style="min-width: 120px;">
                    <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: xpProgress + '%' }"></div>
                    </div>
                    <span class="xp-text">{{ student?.xp ?? 0 }} XP</span>
                </div>
            </div>
        </div>

        <!-- Today's Activity -->
        <div v-if="todayActivity" class="card fade-in-up" style="margin-bottom: 1.5rem; border-left: 4px solid var(--accent-blue);">
            <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h3 style="font-size: 1.1rem;">{{ todayActivity.activity?.title }}</h3>
                    <span class="badge badge-blue" style="margin-top: 0.5rem;">{{ todayActivity.activity?.subject ?? 'Atividade' }}</span>
                </div>
                <span class="badge badge-green">+{{ todayActivity.xp_earned }} XP</span>
            </div>
            <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-light); border-radius: var(--radius-md); font-size: 0.875rem; white-space: pre-wrap;">{{ todayActivity.adapted_content }}</div>
            <div style="margin-top: 1rem; text-align: right;">
                <Link :href="route('student.activities.complete', todayActivity.id)" method="post" as="button" class="btn btn-success">
                    <i class="fas fa-check"></i> Concluir Atividade
                </Link>
            </div>
        </div>

        <div v-else class="card" style="text-align: center; padding: 3rem; margin-bottom: 1.5rem;">
            <i class="fas fa-star" style="font-size: 3rem; color: var(--accent-yellow); margin-bottom: 1rem;"></i>
            <h3>Nenhuma atividade pendente!</h3>
            <p style="color: var(--text-secondary);">Continue assim, você está indo muito bem! 🎉</p>
        </div>

        <div class="grid grid-2">
            <!-- Upcoming Sessions -->
            <div class="card">
                <h3 style="font-size: 1rem; margin-bottom: 1rem;"><i class="fas fa-calendar" style="color: var(--accent-blue);"></i> Próximas Sessões</h3>
                <div v-if="upcomingSessions?.length">
                    <div v-for="session in upcomingSessions" :key="session.id" style="padding: 0.75rem 0; border-bottom: 1px solid var(--border);">
                        <p style="font-weight: 600; font-size: 0.875rem;">{{ session.focus }}</p>
                        <p style="font-size: 0.75rem; color: var(--text-secondary);">{{ session.professional?.name }}</p>
                    </div>
                </div>
                <p v-else style="color: var(--text-secondary); font-size: 0.875rem;">Nenhuma sessão agendada.</p>
            </div>

            <!-- Recent Achievements -->
            <div class="card">
                <h3 style="font-size: 1rem; margin-bottom: 1rem;"><i class="fas fa-trophy" style="color: var(--accent-yellow);"></i> Conquistas Recentes</h3>
                <div v-if="recentAchievements?.length">
                    <div v-for="a in recentAchievements" :key="a.id" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid var(--border);">
                        <i :class="a.icon || 'fas fa-medal'" style="font-size: 1.25rem; color: var(--accent-yellow);"></i>
                        <div>
                            <p style="font-weight: 600; font-size: 0.875rem;">{{ a.title }}</p>
                            <p style="font-size: 0.7rem; color: var(--text-secondary);">+{{ a.xp_reward }} XP</p>
                        </div>
                    </div>
                </div>
                <p v-else style="color: var(--text-secondary); font-size: 0.875rem;">Nenhuma conquista ainda. Continue praticando!</p>
            </div>
        </div>
    </DashboardLayout>
</template>
