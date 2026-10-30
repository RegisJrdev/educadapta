<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head } from '@/demo/navigation.js';

const props = defineProps({
    sessions: { type: Array, default: () => [] },
});

const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
};

const formatTime = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const statusColor = (status) => {
    const map = { agendada: 'var(--accent-blue)', concluida: 'var(--accent-green)', cancelada: 'var(--accent-red)' };
    return map[status] || 'var(--text-light)';
};

const statusLabel = (status) => {
    const map = { agendada: 'Agendada', concluida: 'Concluída', cancelada: 'Cancelada' };
    return map[status] || status;
};

const upcomingSessions = props.sessions?.filter(s => s.status === 'agendada' && new Date(s.scheduled_at) >= new Date()) || [];
const pastSessions = props.sessions?.filter(s => s.status !== 'agendada' || new Date(s.scheduled_at) < new Date()) || [];
</script>

<template>
    <DashboardLayout role="student">
        <Head title="Agenda - EducAdapta" />

        <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">
            <i class="fas fa-calendar-alt" style="color: var(--accent-blue);"></i> Minha Agenda
        </h1>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Suas sessões de acompanhamento agendadas.</p>

        <!-- Upcoming -->
        <h2 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem;"><i class="fas fa-clock" style="color: var(--accent-yellow);"></i> Próximas Sessões</h2>
        <div v-if="upcomingSessions.length" style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem;">
            <div v-for="s in upcomingSessions" :key="s.id" class="card" style="display: flex; align-items: center; gap: 1rem; padding: 1rem;">
                <div style="width: 50px; height: 50px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-direction: column; flex-shrink: 0;"
                    :style="{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)' }">
                    <span style="font-weight: 700; font-size: 1rem; line-height: 1;">{{ new Date(s.scheduled_at).getDate() }}</span>
                    <span style="font-size: 0.6rem; text-transform: uppercase;">{{ new Date(s.scheduled_at).toLocaleDateString('pt-BR', { month: 'short' }) }}</span>
                </div>
                <div style="flex: 1;">
                    <p style="font-weight: 600; font-size: 0.9rem;">{{ s.focus }}</p>
                    <p style="font-size: 0.75rem; color: var(--text-secondary);">
                        <i class="fas fa-user-md"></i> {{ s.professional?.name || 'Profissional' }} • {{ formatTime(s.scheduled_at) }}
                    </p>
                </div>
                <span class="badge" :style="{ background: `color-mix(in srgb, ${statusColor(s.status)} 12%, transparent)`, color: statusColor(s.status) }">
                    {{ statusLabel(s.status) }}
                </span>
            </div>
        </div>
        <div v-else class="card" style="text-align: center; padding: 2rem; margin-bottom: 2rem;">
            <i class="fas fa-calendar-check" style="font-size: 2rem; color: var(--text-light); margin-bottom: 0.5rem;"></i>
            <p style="color: var(--text-secondary); font-size: 0.85rem;">Nenhuma sessão agendada</p>
        </div>

        <!-- Past -->
        <h2 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem;"><i class="fas fa-history" style="color: var(--text-light);"></i> Histórico</h2>
        <div v-if="pastSessions.length" style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div v-for="s in pastSessions" :key="s.id" class="card" style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem;">
                <div style="width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--bg-light); display: flex; align-items: center; justify-content: center; flex-direction: column; flex-shrink: 0;">
                    <span style="font-weight: 700; font-size: 0.85rem; line-height: 1;">{{ new Date(s.scheduled_at).getDate() }}</span>
                    <span style="font-size: 0.55rem; text-transform: uppercase; color: var(--text-light);">{{ new Date(s.scheduled_at).toLocaleDateString('pt-BR', { month: 'short' }) }}</span>
                </div>
                <div style="flex: 1;">
                    <p style="font-weight: 600; font-size: 0.85rem;">{{ s.focus }}</p>
                    <p style="font-size: 0.7rem; color: var(--text-secondary);">{{ s.professional?.name }}</p>
                </div>
                <span class="badge" :style="{ background: `color-mix(in srgb, ${statusColor(s.status)} 12%, transparent)`, color: statusColor(s.status), fontSize: '0.65rem' }">
                    {{ statusLabel(s.status) }}
                </span>
            </div>
        </div>
        <div v-else class="card" style="text-align: center; padding: 2rem;">
            <p style="color: var(--text-secondary); font-size: 0.85rem;">Nenhuma sessão no histórico</p>
        </div>
    </DashboardLayout>
</template>
