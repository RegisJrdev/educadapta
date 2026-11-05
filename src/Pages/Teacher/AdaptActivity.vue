<script setup>
import DashboardLayout from "@/Layouts/DashboardLayout.vue";
import { Head, useForm, router, demoRequest } from "@/demo/navigation.js";
import { ref, computed } from "vue";

const props = defineProps({ students: Array });

const form = useForm({
    title: "",
    content: "",
    file: null,
    subject: "",
    student_ids: [],
});

const inputType = ref("texto");
const fileInput = ref(null);
const showPreview = ref(false);
const previewData = ref(null);
const previewLoading = ref(false);
const sending = ref(false);
const healthStatus = ref(null);
const healthLoading = ref(false);

const alunosSelecionados = computed(() => {
    return props.students?.filter((s) => form.student_ids.includes(s.id)) || [];
});

const handleFileUpload = (e) => {
    form.file = e.target.files[0];
};

const toggleStudent = (id) => {
    const idx = form.student_ids.indexOf(id);
    if (idx > -1) form.student_ids.splice(idx, 1);
    else form.student_ids.push(id);
};

const selectAll = () => {
    if (form.student_ids.length === props.students?.length) {
        form.student_ids = [];
    } else {
        form.student_ids = props.students?.map((s) => s.id) || [];
    }
};

/** Faz preview antes de enviar */
const submitPreview = async () => {
    previewLoading.value = true;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("subject", form.subject || "");
    form.student_ids.forEach((id, i) =>
        formData.append(`student_ids[${i}]`, id),
    );

    if (inputType.value === "pdf" && form.file) {
        formData.append("file", form.file);
    } else {
        formData.append("content", form.content);
    }

    try {
        const response = await demoRequest(route("teacher.adapt.preview"), {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": document.querySelector(
                    'meta[name="csrf-token"]',
                )?.content,
                Accept: "application/json",
            },
            body: formData,
        });

        if (!response.ok) {
            const err = await response.json();
            alert(
                "Erro na validação: " +
                    JSON.stringify(err.errors || err.message),
            );
            return;
        }

        previewData.value = await response.json();
        showPreview.value = true;
    } catch (e) {
        alert("Erro ao gerar preview: " + e.message);
    } finally {
        previewLoading.value = false;
    }
};

/** Confirma e envia para a IA */
const confirmSend = () => {
    sending.value = true;
    form.post(route("teacher.adapt.confirm"), {
        forceFormData: true,
        onFinish: () => {
            sending.value = false;
            showPreview.value = false;
        },
    });
};

/** Testa conexão com a IA */
const checkHealth = async () => {
    healthLoading.value = true;
    try {
        const response = await demoRequest(route("teacher.adapt.health"), {
            headers: {
                "X-CSRF-TOKEN": document.querySelector(
                    'meta[name="csrf-token"]',
                )?.content,
                Accept: "application/json",
            },
        });
        healthStatus.value = await response.json();
    } catch (e) {
        healthStatus.value = {
            ok: false,
            mensagem: "Falha na conexão: " + e.message,
        };
    } finally {
        healthLoading.value = false;
    }
};

const closePreview = () => {
    showPreview.value = false;
    previewData.value = null;
};
</script>

<template>
    <DashboardLayout role="teacher">
        <Head title="Adaptar Atividade - EducAdapta" />

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div>
                <h1 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.1rem;">
                    <i
                        class="fas fa-magic"
                        style="color: var(--accent-purple)"
                    ></i>
                    Adaptar Atividade com IA
                </h1>
                <p style="color: var(--text-secondary); font-size: 0.85rem;">
                    Simule uma adaptação com dados locais. A IA não é executada nesta demonstração.
                </p>
            </div>
            <button
                type="button"
                class="btn btn-outline"
                @click="checkHealth"
                :disabled="healthLoading"
                style="white-space: nowrap"
            >
                <i
                    :class="
                        healthLoading
                            ? 'fas fa-spinner fa-spin'
                            : 'fas fa-heartbeat'
                    "
                ></i>
                {{ healthLoading ? "Testando..." : "Ver modo demonstrativo" }}
            </button>
        </div>

        <!-- Health Status Banner -->
        <div
            v-if="healthStatus"
            class="card"
            :style="{
                marginBottom: '1.5rem',
                padding: '1rem 1.25rem',
                borderLeft: `4px solid ${healthStatus.ok ? 'var(--accent-green)' : 'var(--accent-red)'}`,
                background: healthStatus.ok
                    ? 'rgba(16,185,129,0.05)'
                    : 'rgba(239,68,68,0.05)',
            }"
        >
            <div style="display: flex; align-items: center; gap: 0.75rem">
                <i
                    :class="
                        healthStatus.ok
                            ? 'fas fa-check-circle'
                            : 'fas fa-exclamation-triangle'
                    "
                    :style="{
                        color: healthStatus.ok
                            ? 'var(--accent-green)'
                            : 'var(--accent-red)',
                        fontSize: '1.25rem',
                    }"
                ></i>
                <div>
                    <p style="font-weight: 600; font-size: 0.9rem">
                        {{ healthStatus.mensagem }}
                    </p>
                    <p style="font-size: 0.75rem; color: var(--text-secondary)">
                        Modelo: {{ healthStatus.modelo || 'Exemplo local' }} &bull; Latência:
                        {{ healthStatus.latencia_ms ?? 0 }}ms
                    </p>
                </div>
                <button
                    @click="healthStatus = null"
                    style="
                        margin-left: auto;
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: var(--text-secondary);
                    "
                >
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>

        <!-- Layout de 2 colunas -->
        <form @submit.prevent="submitPreview" class="adapt-grid">

            <!-- Coluna esquerda: campos da atividade -->
            <div class="card adapt-col">
                <h3 class="col-title"><i class="fas fa-file-alt"></i> Atividade</h3>

                <div class="form-group">
                    <label class="form-label">Título</label>
                    <input
                        v-model="form.title"
                        type="text"
                        class="form-input"
                        placeholder="Ex: Exercícios de Matemática - Frações"
                        required
                    />
                    <p v-if="form.errors.title" class="form-error">{{ form.errors.title }}</p>
                </div>

                <div class="form-group">
                    <label class="form-label">Matéria</label>
                    <select v-model="form.subject" class="form-select">
                        <option value="">Selecione</option>
                        <option value="Português">Português</option>
                        <option value="Matemática">Matemática</option>
                        <option value="Ciências">Ciências</option>
                        <option value="História">História</option>
                        <option value="Geografia">Geografia</option>
                        <option value="Outra">Outra</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Tipo de Envio</label>
                    <div style="display: flex; gap: 0.5rem">
                        <button type="button" :class="['btn', inputType === 'texto' ? 'btn-primary' : 'btn-outline']" @click="inputType = 'texto'" style="flex: 1; font-size: 0.82rem;">
                            <i class="fas fa-keyboard"></i> Digitar Texto
                        </button>
                        <button type="button" :class="['btn', inputType === 'pdf' ? 'btn-primary' : 'btn-outline']" @click="inputType = 'pdf'" style="flex: 1; font-size: 0.82rem;">
                            <i class="fas fa-file-pdf"></i> Anexar PDF
                        </button>
                    </div>
                </div>

                <div v-if="inputType === 'texto'" class="form-group" style="flex: 1; display: flex; flex-direction: column;">
                    <label class="form-label">Conteúdo da Atividade</label>
                    <textarea
                        v-model="form.content"
                        class="form-textarea adapt-textarea"
                        placeholder="Cole ou digite o conteúdo da atividade aqui..."
                        required
                    ></textarea>
                    <p v-if="form.errors.content" class="form-error">{{ form.errors.content }}</p>
                </div>

                <div v-if="inputType === 'pdf'" class="form-group">
                    <label class="form-label">Arquivo PDF</label>
                    <input type="file" ref="fileInput" @change="handleFileUpload" accept=".pdf" class="form-input" />
                    <p v-if="form.errors.file" class="form-error">{{ form.errors.file }}</p>
                </div>
            </div>

            <!-- Coluna direita: alunos + botão -->
            <div class="card adapt-col">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <h3 class="col-title" style="margin: 0"><i class="fas fa-users"></i> Alunos</h3>
                    <button
                        v-if="students?.length"
                        type="button"
                        class="btn btn-outline"
                        @click="selectAll"
                        style="font-size: 0.7rem; padding: 0.25rem 0.6rem"
                    >
                        {{ form.student_ids.length === students.length ? "Desmarcar Todos" : "Selecionar Todos" }}
                    </button>
                </div>

                <p v-if="!students?.length" style="color: var(--text-secondary); font-size: 0.8rem">
                    Nenhum aluno com perfil IA configurado encontrado.
                </p>

                <div class="students-list">
                    <label
                        v-for="s in students"
                        :key="s.id"
                        class="custom-check student-item"
                        :style="{
                            borderColor: form.student_ids.includes(s.id) ? 'var(--accent-blue)' : 'var(--border)',
                            background: form.student_ids.includes(s.id) ? 'var(--bg-secondary)' : 'var(--bg-card)',
                        }"
                    >
                        <input type="checkbox" :value="s.id" @change="toggleStudent(s.id)" :checked="form.student_ids.includes(s.id)" />
                        <div>
                            <p style="font-weight: 600; font-size: 0.8rem; margin: 0">{{ s.user?.name }}</p>
                            <p v-if="s.ai_profile" style="font-size: 0.65rem; color: var(--text-secondary); margin: 0">
                                {{ s.ai_profile.disorders?.join(", ") }}
                            </p>
                            <p v-else style="font-size: 0.65rem; color: var(--accent-red); margin: 0">Sem perfil IA</p>
                        </div>
                    </label>
                </div>
                <p v-if="form.errors.student_ids" class="form-error">{{ form.errors.student_ids }}</p>

                <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="previewLoading || form.student_ids.length === 0"
                    style="width: 100%; margin-top: auto; padding-top: 0.7rem; padding-bottom: 0.7rem;"
                >
                    <i :class="previewLoading ? 'fas fa-spinner fa-spin' : 'fas fa-eye'"></i>
                    {{ previewLoading ? "Gerando Preview..." : "Visualizar antes de Enviar" }}
                </button>
            </div>

        </form>

        <!-- Modal de Preview -->
        <Teleport to="body">
            <div
                v-if="showPreview"
                style="
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                "
                @click.self="closePreview"
            >
                <!-- Backdrop -->
                <div
                    style="
                        position: absolute;
                        inset: 0;
                        background: rgba(0, 0, 0, 0.6);
                        backdrop-filter: blur(4px);
                    "
                ></div>

                <!-- Modal Content -->
                <div
                    style="
                        position: relative;
                        background: var(--bg-card, white);
                        border-radius: 1rem;
                        max-width: 700px;
                        width: 95%;
                        max-height: 85vh;
                        overflow-y: auto;
                        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
                        padding: 2rem;
                    "
                >
                    <!-- Header -->
                    <div
                        style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 1.5rem;
                        "
                    >
                        <h2 style="font-size: 1.25rem; font-weight: 700">
                            <i
                                class="fas fa-eye"
                                style="color: var(--accent-purple)"
                            ></i>
                            Preview da Atividade
                        </h2>
                        <button
                            @click="closePreview"
                            style="
                                background: none;
                                border: none;
                                font-size: 1.5rem;
                                cursor: pointer;
                                color: var(--text-secondary);
                                padding: 0.25rem;
                            "
                        >
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <template v-if="previewData">
                        <!-- Info da Atividade -->
                        <div
                            class="card"
                            style="
                                padding: 1.25rem;
                                margin-bottom: 1rem;
                                border-left: 4px solid var(--accent-blue);
                            "
                        >
                            <h3
                                style="
                                    font-weight: 700;
                                    font-size: 1.1rem;
                                    margin-bottom: 0.5rem;
                                "
                            >
                                {{ previewData.titulo }}
                            </h3>
                            <div
                                style="
                                    display: flex;
                                    gap: 1rem;
                                    font-size: 0.8rem;
                                    color: var(--text-secondary);
                                "
                            >
                                <span v-if="previewData.materia"
                                    ><i class="fas fa-book"></i>
                                    {{ previewData.materia }}</span
                                >
                                <span
                                    ><i class="fas fa-file-alt"></i>
                                    {{
                                        previewData.tipo === "pdf"
                                            ? "PDF"
                                            : "Texto"
                                    }}</span
                                >
                            </div>
                        </div>

                        <!-- Conteúdo Original -->
                        <div style="margin-bottom: 1.25rem">
                            <h4
                                style="
                                    font-weight: 600;
                                    font-size: 0.9rem;
                                    margin-bottom: 0.5rem;
                                    color: var(--text-secondary);
                                "
                            >
                                <i class="fas fa-file-alt"></i> Conteúdo
                                Original
                            </h4>
                            <div
                                style="
                                    background: var(--bg-secondary, #f8f9fa);
                                    border-radius: 0.5rem;
                                    padding: 1rem;
                                    max-height: 200px;
                                    overflow-y: auto;
                                    font-size: 0.85rem;
                                    line-height: 1.6;
                                    white-space: pre-wrap;
                                    border: 1px solid var(--border);
                                "
                            >
                                {{ previewData.conteudo }}
                            </div>
                        </div>

                        <!-- Alunos -->
                        <div style="margin-bottom: 1.25rem">
                            <h4
                                style="
                                    font-weight: 600;
                                    font-size: 0.9rem;
                                    margin-bottom: 0.5rem;
                                    color: var(--text-secondary);
                                "
                            >
                                <i class="fas fa-users"></i> Alunos Selecionados
                            </h4>
                            <div style="display: grid; gap: 0.5rem">
                                <div
                                    v-for="aluno in previewData.alunos"
                                    :key="aluno.id"
                                    class="card"
                                    style="
                                        padding: 0.75rem 1rem;
                                        display: flex;
                                        align-items: center;
                                        gap: 0.75rem;
                                    "
                                    :style="{
                                        borderLeftColor: aluno.possui_perfil_ia
                                            ? 'var(--accent-green)'
                                            : 'var(--accent-red)',
                                        borderLeftWidth: '3px',
                                        borderLeftStyle: 'solid',
                                    }"
                                >
                                    <i
                                        :class="
                                            aluno.possui_perfil_ia
                                                ? 'fas fa-check-circle'
                                                : 'fas fa-exclamation-circle'
                                        "
                                        :style="{
                                            color: aluno.possui_perfil_ia
                                                ? 'var(--accent-green)'
                                                : 'var(--accent-red)',
                                        }"
                                    ></i>
                                    <div style="flex: 1">
                                        <p
                                            style="
                                                font-weight: 600;
                                                font-size: 0.85rem;
                                            "
                                        >
                                            {{ aluno.nome }}
                                        </p>
                                        <p
                                            v-if="aluno.possui_perfil_ia"
                                            style="
                                                font-size: 0.7rem;
                                                color: var(--text-secondary);
                                            "
                                        >
                                            {{
                                                aluno.transtornos.join(", ")
                                            }}
                                            &bull; Nível:
                                            {{ aluno.nivel_complexidade }}
                                        </p>
                                        <p
                                            v-else
                                            style="
                                                font-size: 0.7rem;
                                                color: var(--accent-red);
                                            "
                                        >
                                            Sem perfil IA — será ignorado
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Resumo -->
                        <div
                            class="card"
                            style="
                                padding: 1rem;
                                margin-bottom: 1.5rem;
                                background: rgba(59, 130, 246, 0.05);
                                border: 1px solid rgba(59, 130, 246, 0.2);
                            "
                        >
                            <div
                                style="
                                    display: flex;
                                    justify-content: space-around;
                                    text-align: center;
                                "
                            >
                                <div>
                                    <p
                                        style="
                                            font-size: 1.5rem;
                                            font-weight: 700;
                                            color: var(--accent-blue);
                                        "
                                    >
                                        {{ previewData.resumo.total_alunos }}
                                    </p>
                                    <p
                                        style="
                                            font-size: 0.7rem;
                                            color: var(--text-secondary);
                                        "
                                    >
                                        Total
                                    </p>
                                </div>
                                <div>
                                    <p
                                        style="
                                            font-size: 1.5rem;
                                            font-weight: 700;
                                            color: var(--accent-green);
                                        "
                                    >
                                        {{ previewData.resumo.com_perfil_ia }}
                                    </p>
                                    <p
                                        style="
                                            font-size: 0.7rem;
                                            color: var(--text-secondary);
                                        "
                                    >
                                        Serão Adaptados
                                    </p>
                                </div>
                                <div
                                    v-if="previewData.resumo.sem_perfil_ia > 0"
                                >
                                    <p
                                        style="
                                            font-size: 1.5rem;
                                            font-weight: 700;
                                            color: var(--accent-red);
                                        "
                                    >
                                        {{ previewData.resumo.sem_perfil_ia }}
                                    </p>
                                    <p
                                        style="
                                            font-size: 0.7rem;
                                            color: var(--text-secondary);
                                        "
                                    >
                                        Sem Perfil IA
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Ações -->
                        <div style="display: flex; gap: 0.75rem">
                            <button
                                type="button"
                                class="btn btn-outline"
                                @click="closePreview"
                                style="flex: 1"
                            >
                                <i class="fas fa-arrow-left"></i> Voltar e
                                Editar
                            </button>
                            <button
                                type="button"
                                class="btn btn-primary btn-lg"
                                @click="confirmSend"
                                :disabled="
                                    sending ||
                                    previewData.resumo.com_perfil_ia === 0
                                "
                                style="flex: 2"
                            >
                                <i
                                    :class="
                                        sending
                                            ? 'fas fa-spinner fa-spin'
                                            : 'fas fa-paper-plane'
                                    "
                                ></i>
                                {{
                                    sending
                                        ? "Enviando..."
                                        : "Criar adaptação de exemplo"
                                }}
                            </button>
                        </div>

                        <p
                            v-if="previewData.resumo.com_perfil_ia === 0"
                            style="
                                text-align: center;
                                color: var(--accent-red);
                                font-size: 0.8rem;
                                margin-top: 0.75rem;
                            "
                        >
                            <i class="fas fa-exclamation-triangle"></i> Nenhum
                            aluno selecionado possui perfil de IA configurado.
                        </p>
                    </template>
                </div>
            </div>
        </Teleport>
    </DashboardLayout>
</template>

<style scoped>
.adapt-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    height: calc(100vh - 160px);
}

.adapt-col {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 1.25rem;
}

.col-title {
    font-size: 0.9rem;
    font-weight: 700;
    margin: 0 0 0.75rem 0;
    color: var(--link);
    gap: 0.4rem;
    display: flex;
    align-items: center;
}

.adapt-textarea {
    flex: 1;
    resize: none;
    min-height: 0;
}

.students-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 0.75rem;
}

.student-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    border: 1.5px solid var(--border);
    cursor: pointer;
    transition: all 0.15s ease;
}
</style>
