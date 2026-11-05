<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head, useForm } from '@/demo/navigation.js';
import { ref } from 'vue';

const props = defineProps({
    plans: Object,
    students: { type: Array, default: () => [] },
});

const showForm = ref(false);

const form = useForm({
    student_id: '',
    title: '',
    goals: '',
    strategies: '',
    resources: '',
    start_date: '',
    end_date: '',
});

const submit = () => {
    form.post(route('psychopedagogue.plans.store'), {
        onSuccess: () => { showForm.value = false; form.reset(); },
    });
};

const statusColor = (s) => {
    const map = { ativo: 'var(--accent-green)', pausado: 'var(--accent-yellow)', concluido: 'var(--accent-blue)' };
    return map[s] || 'var(--text-light)';
};

const statusLabel = (s) => {
    const map = { ativo: 'Ativo', pausado: 'Pausado', concluido: 'Concluído' };
    return map[s] || s;
};

const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};
</script>

<template>
    <DashboardLayout role="psychopedagogue">
        <Head title="Planos de Intervenção - EducAdapta" />

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <div>
                <h1 style="font-size: 1.5rem; font-weight: 700;"><i class="fas fa-clipboard-list" style="color: var(--accent-green);"></i> Planos de Intervenção</h1>
                <p style="color: var(--text-secondary); font-size: 0.875rem;">Crie e gerencie planos individualizados para os alunos.</p>
            </div>
            <button @click="showForm = !showForm" class="btn btn-primary">
                <i class="fas fa-plus"></i> Novo Plano
            </button>
        </div>

        <!-- New Plan Form -->
        <div v-if="showForm" class="card" style="margin-bottom: 1.5rem; border-left: 4px solid var(--accent-green);">
            <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 1rem;">Novo Plano de Intervenção</h3>
            <form @submit.prevent="submit">
                <div class="responsive-form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Aluno</label>
                        <select v-model="form.student_id" class="form-select" required>
                            <option value="">Selecione</option>
                            <option v-for="s in students" :key="s.id" :value="s.id">{{ s.user?.name }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Título do Plano</label>
                        <input v-model="form.title" type="text" class="form-input" placeholder="Ex: Plano de Leitura" required />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Data Início</label>
                        <input v-model="form.start_date" type="date" class="form-input" required />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Data Término</label>
                        <input v-model="form.end_date" type="date" class="form-input" />
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Objetivos</label>
                    <textarea v-model="form.goals" class="form-textarea" rows="3" placeholder="Descreva os objetivos do plano..." required></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Estratégias</label>
                    <textarea v-model="form.strategies" class="form-textarea" rows="2" placeholder="Estratégias pedagógicas a serem utilizadas..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Recursos</label>
                    <textarea v-model="form.resources" class="form-textarea" rows="2" placeholder="Materiais e recursos necessários..."></textarea>
                </div>
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                    <button type="button" @click="showForm = false" class="btn btn-outline">Cancelar</button>
                    <button type="submit" class="btn btn-primary" :disabled="form.processing">
                        <i class="fas fa-save"></i> {{ form.processing ? 'Salvando...' : 'Criar Plano' }}
                    </button>
                </div>
            </form>
        </div>

        <!-- Plans List -->
        <div v-if="plans?.data?.length" style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div v-for="p in plans.data" :key="p.id" class="card" style="padding: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                    <div>
                        <h3 style="font-weight: 700; font-size: 1rem;">{{ p.title }}</h3>
                        <p style="font-size: 0.75rem; color: var(--text-secondary);">
                            <i class="fas fa-user-graduate"></i> {{ p.student?.user?.name }} •
                            {{ formatDate(p.start_date) }} → {{ formatDate(p.end_date) }}
                        </p>
                    </div>
                    <span class="badge" :style="{ background: `color-mix(in srgb, ${statusColor(p.status)} 12%, transparent)`, color: statusColor(p.status) }">
                        {{ statusLabel(p.status) }}
                    </span>
                </div>
                <div style="background: var(--bg-light); border-radius: var(--radius-sm); padding: 0.75rem; font-size: 0.8rem;">
                    <p><strong>Objetivos:</strong> {{ p.goals }}</p>
                    <p v-if="p.strategies" style="margin-top: 0.25rem;"><strong>Estratégias:</strong> {{ p.strategies }}</p>
                    <p v-if="p.resources" style="margin-top: 0.25rem;"><strong>Recursos:</strong> {{ p.resources }}</p>
                </div>
            </div>
        </div>

        <div v-else class="card" style="text-align: center; padding: 3rem;">
            <i class="fas fa-clipboard" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
            <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Nenhum plano criado</h3>
            <p style="color: var(--text-secondary); font-size: 0.85rem;">Crie planos de intervenção individualizados.</p>
        </div>
    </DashboardLayout>
</template>
