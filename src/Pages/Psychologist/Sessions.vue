<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head, useForm } from '@/demo/navigation.js';
import { ref } from 'vue';

const props = defineProps({
    sessions: Object,
    students: { type: Array, default: () => [] },
});

const showForm = ref(false);

const form = useForm({
    student_id: '',
    scheduled_at: '',
    focus: '',
    notes: '',
});

const submit = () => {
    form.post(route('psychologist.sessions.store'), {
        onSuccess: () => { showForm.value = false; form.reset(); },
    });
};

const statusColor = (s) => {
    const map = { agendada: 'var(--accent-blue)', concluida: 'var(--accent-green)', cancelada: 'var(--accent-red)' };
    return map[s] || 'var(--text-light)';
};

const statusLabel = (s) => {
    const map = { agendada: 'Agendada', concluida: 'Concluída', cancelada: 'Cancelada' };
    return map[s] || s;
};

const formatDateTime = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};
</script>

<template>
    <DashboardLayout role="psychologist">
        <Head title="Sessões - EducAdapta" />

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <div>
                <h1 style="font-size: 1.5rem; font-weight: 700;"><i class="fas fa-calendar-check" style="color: var(--accent-blue);"></i> Sessões</h1>
                <p style="color: var(--text-secondary); font-size: 0.875rem;">Gerencie suas sessões de acompanhamento.</p>
            </div>
            <button @click="showForm = !showForm" class="btn btn-primary">
                <i class="fas fa-plus"></i> Nova Sessão
            </button>
        </div>

        <!-- New Session Form -->
        <div v-if="showForm" class="card" style="margin-bottom: 1.5rem; border-left: 4px solid var(--accent-blue);">
            <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 1rem;">Agendar Nova Sessão</h3>
            <form @submit.prevent="submit" class="responsive-form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label">Aluno</label>
                    <select v-model="form.student_id" class="form-select" required>
                        <option value="">Selecione</option>
                        <option v-for="s in students" :key="s.id" :value="s.id">{{ s.user?.name }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Data e Hora</label>
                    <input v-model="form.scheduled_at" type="datetime-local" class="form-input" required />
                </div>
                <div class="form-group">
                    <label class="form-label">Foco da Sessão</label>
                    <input v-model="form.focus" type="text" class="form-input" placeholder="Ex: Avaliação cognitiva" required />
                </div>
                <div class="form-group">
                    <label class="form-label">Observações</label>
                    <input v-model="form.notes" type="text" class="form-input" placeholder="Notas opcionais" />
                </div>
                <div style="grid-column: 1 / -1; display: flex; gap: 0.5rem; justify-content: flex-end;">
                    <button type="button" @click="showForm = false" class="btn btn-outline">Cancelar</button>
                    <button type="submit" class="btn btn-primary" :disabled="form.processing">
                        <i class="fas fa-save"></i> {{ form.processing ? 'Salvando...' : 'Agendar' }}
                    </button>
                </div>
            </form>
        </div>

        <!-- Sessions List -->
        <div v-if="sessions?.data?.length" style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div v-for="s in sessions.data" :key="s.id" class="card" style="display: flex; align-items: center; gap: 1rem; padding: 1rem;">
                <div style="width: 50px; height: 50px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-direction: column; flex-shrink: 0;"
                    :style="{ background: `color-mix(in srgb, ${statusColor(s.status)} 10%, transparent)`, color: statusColor(s.status) }">
                    <span style="font-weight: 700; font-size: 1rem; line-height: 1;">{{ new Date(s.scheduled_at).getDate() }}</span>
                    <span style="font-size: 0.6rem; text-transform: uppercase;">{{ new Date(s.scheduled_at).toLocaleDateString('pt-BR', { month: 'short' }) }}</span>
                </div>
                <div style="flex: 1;">
                    <p style="font-weight: 600; font-size: 0.9rem;">{{ s.focus }}</p>
                    <p style="font-size: 0.75rem; color: var(--text-secondary);">
                        <i class="fas fa-user-graduate"></i> {{ s.student?.user?.name }} • {{ formatDateTime(s.scheduled_at) }}
                    </p>
                    <p v-if="s.notes" style="font-size: 0.7rem; color: var(--text-light); margin-top: 0.25rem;">{{ s.notes }}</p>
                </div>
                <span class="badge" :style="{ background: `color-mix(in srgb, ${statusColor(s.status)} 12%, transparent)`, color: statusColor(s.status) }">
                    {{ statusLabel(s.status) }}
                </span>
            </div>
        </div>

        <div v-else class="card" style="text-align: center; padding: 3rem;">
            <i class="fas fa-calendar-plus" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
            <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Nenhuma sessão</h3>
            <p style="color: var(--text-secondary); font-size: 0.85rem;">Agende sua primeira sessão de acompanhamento.</p>
        </div>
    </DashboardLayout>
</template>
