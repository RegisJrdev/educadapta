<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head, Link, usePage } from '@/demo/navigation.js';
import { computed } from 'vue';

const props = defineProps({
    activities: Object,
});

const page = usePage();
const user = computed(() => page.props.auth.user);
</script>

<template>
    <DashboardLayout role="student">
        <Head title="Atividades - EducAdapta" />

        <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem;">
            <i class="fas fa-book" style="color: var(--accent-blue);"></i> Minhas Atividades
        </h1>

        <div v-if="activities?.data?.length">
            <div v-for="a in activities.data" :key="a.id" class="card fade-in-up" style="margin-bottom: 1rem; border-left: 4px solid var(--accent-blue);">
                <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 0.5rem;">
                    <div>
                        <h3 style="font-size: 1rem;">{{ a.activity?.title }}</h3>
                        <span class="badge badge-blue" style="margin-top: 0.25rem;">{{ a.activity?.subject ?? 'Atividade' }}</span>
                    </div>
                    <div>
                        <span v-if="a.completed_by_student" class="badge badge-green">Concluída ✓</span>
                        <span v-else class="badge badge-yellow">Pendente</span>
                    </div>
                </div>
                <div style="margin-top: 1rem; white-space: pre-wrap; font-size: .875rem;">{{ a.adapted_content }}</div>
                <Link v-if="!a.completed_by_student" :href="route('student.activities.complete', a.id)" method="post" as="button" class="btn btn-success" style="margin-top: 1rem;">Concluir atividade · +{{ a.xp_earned }} XP</Link>
            </div>
        </div>

        <div v-else class="card" style="text-align: center; padding: 3rem;">
            <i class="fas fa-inbox" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
            <h3>Nenhuma atividade ainda</h3>
            <p style="color: var(--text-secondary);">Quando seus professores enviarem atividades adaptadas, elas aparecerão aqui.</p>
        </div>
    </DashboardLayout>
</template>
