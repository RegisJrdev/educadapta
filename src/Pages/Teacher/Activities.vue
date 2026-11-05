<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head, Link } from '@/demo/navigation.js';
import { ref } from 'vue';

const props = defineProps({
    activities: Object,
});

/** Atividade selecionada para preview no modal. */
const selectedActivity = ref(null);

const openPreview = (activity) => {
    selectedActivity.value = activity;
};

const closePreview = () => {
    selectedActivity.value = null;
};

const statusColor = (s) => {
    const map = { processando: 'var(--accent-yellow)', concluida: 'var(--accent-green)', erro: 'var(--accent-red)', pendente: 'var(--text-secondary)', falha: 'var(--accent-red)' };
    return map[s] || 'var(--text-secondary)';
};

const statusLabel = (s) => {
    const map = { processando: 'Processando', concluida: 'Concluída', erro: 'Erro', pendente: 'Pendente', falha: 'Falha' };
    return map[s] || s;
};

const statusIcon = (s) => {
    const map = { processando: 'fas fa-spinner fa-spin', concluida: 'fas fa-check-circle', erro: 'fas fa-exclamation-triangle', pendente: 'fas fa-clock', falha: 'fas fa-times-circle' };
    return map[s] || 'fas fa-circle';
};

const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};

/** Determina o status geral de uma atividade baseado nas adaptações. */
const overallStatus = (activity) => {
    const adaptations = activity.adapted_activities || [];
    if (!adaptations.length) return 'pendente';
    const allDone = adaptations.every(a => a.status === 'concluida');
    const anyError = adaptations.some(a => a.status === 'erro' || a.status === 'falha');
    if (allDone) return 'concluida';
    if (anyError) return 'erro';
    return 'processando';
};

/** Trunca o texto para preview. */
const truncate = (text, max = 150) => {
    if (!text) return '(sem conteúdo)';
    return text.length > max ? text.slice(0, max) + '...' : text;
};
</script>

<template>
    <DashboardLayout role="teacher">
        <Head title="Atividades - EducAdapta" />

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <div>
                <h1 style="font-size: 1.5rem; font-weight: 700;"><i class="fas fa-file-alt" style="color: var(--accent-purple);"></i> Atividades</h1>
                <p style="color: var(--text-secondary); font-size: 0.875rem;">Clique na atividade para ver o conteúdo original e as adaptações.</p>
            </div>
            <Link :href="route('teacher.adapt.form')" class="btn btn-primary">
                <i class="fas fa-plus"></i> Nova Atividade
            </Link>
        </div>

        <div v-if="activities?.data?.length" class="card" style="overflow-x: auto; padding: 0;">
            <table style="width: 100%; min-width: 650px; border-collapse: collapse;">
                <thead>
                    <tr style="background: var(--bg-light);">
                        <th style="text-align: left; padding: 0.75rem 1rem; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Título</th>
                        <th style="text-align: left; padding: 0.75rem 1rem; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Matéria</th>
                        <th style="text-align: center; padding: 0.75rem 1rem; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Adaptações</th>
                        <th style="text-align: center; padding: 0.75rem 1rem; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Status</th>
                        <th style="text-align: right; padding: 0.75rem 1rem; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Data</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="a in activities.data"
                        :key="a.id"
                        @click="openPreview(a)"
                        style="border-top: 1px solid var(--border); cursor: pointer; transition: background 0.2s;"
                        class="activity-row"
                    >
                        <td style="padding: 0.75rem 1rem;">
                            <p style="font-weight: 600; font-size: 0.875rem;">{{ a.title }}</p>
                            <p style="font-size: 0.7rem; color: var(--text-light);">{{ a.type === 'pdf' ? '📄 PDF' : '✏️ Texto' }}</p>
                        </td>
                        <td style="padding: 0.75rem 1rem; font-size: 0.85rem; color: var(--text-secondary);">{{ a.subject || '-' }}</td>
                        <td style="padding: 0.75rem 1rem; text-align: center;">
                            <span style="font-weight: 700; font-size: 0.9rem;">{{ a.adapted_activities_count || 0 }}</span>
                        </td>
                        <td style="padding: 0.75rem 1rem; text-align: center;">
                            <span class="badge" :style="{ background: `color-mix(in srgb, ${statusColor(overallStatus(a))} 12%, transparent)`, color: statusColor(overallStatus(a)) }">
                                <i :class="statusIcon(overallStatus(a))" style="margin-right: 4px;"></i>
                                {{ statusLabel(overallStatus(a)) }}
                            </span>
                        </td>
                        <td style="padding: 0.75rem 1rem; text-align: right; font-size: 0.8rem; color: var(--text-secondary);">{{ formatDate(a.created_at) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else class="card" style="text-align: center; padding: 3rem;">
            <i class="fas fa-file-circle-plus" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
            <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Nenhuma atividade ainda</h3>
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1rem;">Envie sua primeira atividade para adaptação pela IA.</p>
            <Link :href="route('teacher.adapt.form')" class="btn btn-primary">
                <i class="fas fa-plus"></i> Criar Atividade
            </Link>
        </div>

        <!-- ══════════════════════════════════════════════ -->
        <!-- MODAL DE PREVIEW DA ATIVIDADE                 -->
        <!-- ══════════════════════════════════════════════ -->
        <Teleport to="body">
            <div v-if="selectedActivity" class="modal-overlay" @click.self="closePreview">
                <div class="modal-content">
                    <!-- Header do Modal -->
                    <div class="modal-header">
                        <div>
                            <h2 style="font-size: 1.1rem; font-weight: 700; margin: 0;">
                                <i class="fas fa-eye" style="color: var(--accent-purple); margin-right: 6px;"></i>
                                {{ selectedActivity.title }}
                            </h2>
                            <p style="font-size: 0.75rem; color: var(--text-light); margin: 4px 0 0;">
                                {{ selectedActivity.subject || 'Sem matéria' }} · {{ formatDate(selectedActivity.created_at) }}
                            </p>
                        </div>
                        <button @click="closePreview" class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <!-- Conteúdo Original -->
                    <div class="modal-section">
                        <h3 class="section-title">
                            <i class="fas fa-file-lines" style="color: var(--accent-blue);"></i>
                            Conteúdo Original
                        </h3>
                        <div class="content-box original-content">
                            <pre style="white-space: pre-wrap; font-family: inherit; margin: 0; font-size: 0.85rem; line-height: 1.6;">{{ selectedActivity.original_content || '(conteúdo não disponível)' }}</pre>
                        </div>
                    </div>

                    <!-- Adaptações por Aluno -->
                    <div class="modal-section" v-if="selectedActivity.adapted_activities?.length">
                        <h3 class="section-title">
                            <i class="fas fa-wand-magic-sparkles" style="color: var(--accent-purple);"></i>
                            Adaptações ({{ selectedActivity.adapted_activities.length }})
                        </h3>

                        <div
                            v-for="adapt in selectedActivity.adapted_activities"
                            :key="adapt.id"
                            class="adaptation-card"
                        >
                            <div class="adaptation-header">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div class="student-avatar">{{ (adapt.student?.user?.name || '?')[0] }}</div>
                                    <div>
                                        <p style="font-weight: 600; font-size: 0.85rem;">{{ adapt.student?.user?.name || 'Aluno' }}</p>
                                        <p style="font-size: 0.7rem; color: var(--text-light);">
                                            {{ adapt.modelo_ia || 'Demonstração local' }} · {{ adapt.duracao_ms ? (adapt.duracao_ms / 1000).toFixed(1) + 's' : '' }}
                                        </p>
                                    </div>
                                </div>
                                <span class="badge" :style="{ background: `color-mix(in srgb, ${statusColor(adapt.status)} 12%, transparent)`, color: statusColor(adapt.status) }">
                                    <i :class="statusIcon(adapt.status)" style="margin-right: 4px;"></i>
                                    {{ statusLabel(adapt.status) }}
                                </span>
                            </div>

                            <div v-if="adapt.adapted_content" class="content-box adapted-content">
                                <pre style="white-space: pre-wrap; font-family: inherit; margin: 0; font-size: 0.85rem; line-height: 1.6;">{{ adapt.adapted_content }}</pre>
                            </div>
                            <div v-else-if="adapt.status === 'processando'" style="text-align: center; padding: 1rem; color: var(--text-light);">
                                <i class="fas fa-spinner fa-spin" style="font-size: 1.2rem; margin-bottom: 0.5rem;"></i>
                                <p style="font-size: 0.8rem;">Aguardando adaptação da IA...</p>
                            </div>
                            <div v-else-if="adapt.status === 'erro' || adapt.status === 'falha'" style="text-align: center; padding: 1rem; color: var(--accent-red);">
                                <i class="fas fa-exclamation-triangle" style="font-size: 1.2rem; margin-bottom: 0.5rem;"></i>
                                <p style="font-size: 0.8rem;">{{ adapt.error_message || 'Ocorreu um erro na adaptação.' }}</p>
                            </div>
                        </div>
                    </div>

                    <div v-else class="modal-section" style="text-align: center; padding: 1.5rem; color: var(--text-light);">
                        <i class="fas fa-hourglass-half" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                        <p style="font-size: 0.85rem;">Nenhuma adaptação gerada ainda.</p>
                    </div>

                    <!-- Footer do Modal -->
                    <div class="modal-footer">
                        <button @click="closePreview" class="btn" style="background: var(--bg-light); color: var(--text-primary); border: 1px solid var(--border);">
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </DashboardLayout>
</template>

<style scoped>
.activity-row:hover {
    background: var(--bg-light);
}

/* ═══ Modal ═══ */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 2rem;
    z-index: 1000;
    overflow-y: auto;
    animation: fadeIn 0.2s ease;
}

.modal-content {
    background: var(--bg-card, #fff);
    border-radius: 12px;
    width: 100%;
    max-width: 700px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    animation: slideUp 0.3s ease;
    margin: auto 0;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border);
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.1rem;
    color: var(--text-light);
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s;
}

.modal-close:hover {
    background: var(--bg-light);
    color: var(--text-primary);
}

.modal-section {
    padding: 1rem 1.5rem;
}

.section-title {
    font-size: 0.85rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 6px;
}

.content-box {
    background: var(--bg-light, #f8f9fa);
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid var(--border);
    max-height: 250px;
    overflow-y: auto;
}

.original-content {
    border-left: 3px solid var(--accent-blue, #3B82F6);
}

.adapted-content {
    border-left: 3px solid var(--accent-green, #22c55e);
}

.adaptation-card {
    background: var(--bg-light, #f8f9fa);
    border-radius: 10px;
    margin-bottom: 0.75rem;
    border: 1px solid var(--border);
    overflow: hidden;
}

.adaptation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border);
}

.adaptation-card .content-box {
    margin: 0.75rem;
    border: none;
}

.student-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--primary);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.8rem;
}

.modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: flex-end;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
