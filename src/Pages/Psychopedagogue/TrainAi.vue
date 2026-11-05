<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head, useForm } from '@/demo/navigation.js';
import { ref } from 'vue';

const props = defineProps({ students: Array });
const selectedStudent = ref(null);

const disorderOptions = [
    'Dislexia', 'Discalculia', 'Disgrafia', 'TDAH', 'TEA',
    'Deficiência Intelectual', 'Transtorno de Linguagem', 'Outro',
];

const form = useForm({
    student_id: null,
    disorders: [],
    complexity_level: 'medio',
    sensory_preference: 'visual',
    general_notes: '',
    rules: [{ category: 'geral', rule_description: '', priority: 0 }],
});

const selectStudent = (student) => {
    selectedStudent.value = student;
    form.student_id = student.id;
    if (student.ai_profile) {
        form.disorders = student.ai_profile.disorders || [];
        form.complexity_level = student.ai_profile.complexity_level;
        form.sensory_preference = student.ai_profile.sensory_preference;
        form.general_notes = student.ai_profile.general_notes || '';
        form.rules = student.ai_profile.rules?.length
            ? student.ai_profile.rules.map(r => ({ category: r.category, rule_description: r.rule_description, priority: r.priority }))
            : [{ category: 'geral', rule_description: '', priority: 0 }];
    } else {
        form.disorders = [];
        form.complexity_level = 'medio';
        form.sensory_preference = 'visual';
        form.general_notes = '';
        form.rules = [{ category: 'geral', rule_description: '', priority: 0 }];
    }
};

const addRule = () => {
    form.rules.push({ category: 'geral', rule_description: '', priority: 0 });
};
const removeRule = (i) => { form.rules.splice(i, 1); };

const submit = () => {
    form.post(route('psychopedagogue.train-ai.save'));
};
</script>

<template>
    <DashboardLayout role="psychopedagogue">
        <Head title="Treinar IA - EducAdapta" />

        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <div>
                <h1 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.1rem;"><i class="fas fa-brain" style="color: var(--accent-purple);"></i> Treinar IA</h1>
                <p style="color: var(--text-secondary); font-size: 0.8rem;">Selecione um aluno e defina as regras de adaptação.</p>
            </div>
        </div>

        <div class="training-layout" style="display: grid; grid-template-columns: 220px 1fr; gap: 1rem; height: calc(100vh - 140px);">
            <!-- Student List -->
            <div class="card" style="overflow-y: auto; padding: 1rem;">
                <h3 style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); margin-bottom: 0.75rem;">Alunos</h3>
                <button v-for="s in students" :key="s.id" type="button" :aria-pressed="selectedStudent?.id === s.id"
                    @click="selectStudent(s)"
                    style="display: block; width: 100%; text-align: left; font: inherit; color: var(--text-primary); border: 0; padding: 0.5rem 0.625rem; border-radius: var(--radius-md); cursor: pointer; margin-bottom: 0.3rem; transition: all 0.2s;"
                    :style="{ background: selectedStudent?.id === s.id ? 'rgba(59,130,246,0.1)' : 'transparent', borderLeft: selectedStudent?.id === s.id ? '3px solid var(--accent-blue)' : '3px solid transparent' }">
                    <p style="font-weight: 600; font-size: 0.8rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ s.user?.name }}</p>
                    <span v-if="s.ai_profile" class="badge badge-green" style="font-size: 0.58rem; padding: 0.1rem 0.4rem;">IA ✓</span>
                    <span v-else class="badge badge-yellow" style="font-size: 0.58rem; padding: 0.1rem 0.4rem;">Sem perfil</span>
                </button>
            </div>

            <!-- Profile Form -->
            <div v-if="selectedStudent" class="card" style="overflow-y: auto; padding: 1.25rem;">
                <h3 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 1rem;">Perfil IA: {{ selectedStudent.user?.name }}</h3>

                <form @submit.prevent="submit">
                    <div class="form-group">
                        <label class="form-label">Transtornos</label>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            <label v-for="d in disorderOptions" :key="d" class="custom-check">
                                <input type="checkbox" :value="d" v-model="form.disorders" />
                                {{ d }}
                            </label>
                        </div>
                    </div>

                    <div class="responsive-form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Nível de Complexidade</label>
                            <select v-model="form.complexity_level" class="form-select">
                                <option value="baixo">Baixo</option>
                                <option value="medio">Médio</option>
                                <option value="alto">Alto</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Preferência Sensorial</label>
                            <select v-model="form.sensory_preference" class="form-select">
                                <option value="visual">Visual</option>
                                <option value="auditivo">Auditivo</option>
                                <option value="tatil">Tátil</option>
                                <option value="misto">Misto</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Observações Gerais</label>
                        <textarea v-model="form.general_notes" class="form-textarea" rows="2" placeholder="Informações adicionais sobre o aluno..."></textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label" style="display: flex; justify-content: space-between; align-items: center;">
                            Regras de Adaptação
                            <button type="button" class="btn btn-sm btn-outline" @click="addRule"><i class="fas fa-plus"></i> Adicionar</button>
                        </label>
                        <div v-for="(rule, i) in form.rules" :key="i" style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; align-items: center;">
                            <select v-model="rule.category" class="form-select" style="width: 130px; flex-shrink: 0;">
                                <option value="geral">Geral</option>
                                <option value="leitura">Leitura</option>
                                <option value="escrita">Escrita</option>
                                <option value="matematica">Matemática</option>
                                <option value="comportamento">Comportamento</option>
                            </select>
                            <input v-model="rule.rule_description" class="form-input" placeholder="Ex: Usar frases curtas, max 10 palavras" />
                            <button type="button" @click="removeRule(i)" style="background: none; border: none; color: var(--accent-red); cursor: pointer; padding: 0.35rem; flex-shrink: 0;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary" :disabled="form.processing" style="width: 100%;">
                        <i class="fas fa-save"></i>
                        {{ form.processing ? 'Salvando...' : 'Salvar Perfil IA' }}
                    </button>
                </form>
            </div>

            <div v-else class="card" style="display: flex; align-items: center; justify-content: center; text-align: center;">
                <div>
                    <i class="fas fa-arrow-left" style="font-size: 1.5rem; color: var(--text-light); margin-bottom: 0.75rem;"></i>
                    <p style="color: var(--text-secondary); font-size: 0.85rem;">Selecione um aluno para configurar o perfil IA.</p>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>
