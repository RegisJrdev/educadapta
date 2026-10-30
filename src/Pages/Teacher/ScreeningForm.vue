<script setup>
import DashboardLayout from "@/Layouts/DashboardLayout.vue";
import { Head, useForm } from "@/demo/navigation.js";
import { ref, computed } from "vue";

const props = defineProps({
    student: { type: Object, required: true },
});

const currentStep = ref(0);

const areas = [
    {
        key: "atencao",
        title: "Atenção e Concentração",
        subtitle: "Organização e foco nas atividades",
        icon: "fas fa-eye",
        color: "var(--accent-blue)",
        questions: [
            "O aluno tem dificuldade em manter o foco durante atividades em sala?",
            "Distrai-se facilmente com estímulos irrelevantes?",
            "Tem dificuldade em organizar tarefas e materiais?",
            "Apresenta comportamento impulsivo (responde antes de pensar)?",
            "Mostra agitação motora excessiva (mexe mãos, pés, levanta)?",
        ],
    },
    {
        key: "leitura",
        title: "Leitura e Escrita",
        subtitle: "Fluência e compreensão",
        icon: "fas fa-book-open",
        color: "var(--accent-purple)",
        questions: [
            "Apresenta leitura lenta e/ou fragmentada?",
            "Troca letras semelhantes ao ler ou escrever (b/d, p/q)?",
            "Tem dificuldade em compreender textos lidos?",
            "A caligrafia é irregular ou difícil de ler?",
            "Comete muitos erros ortográficos não condizentes com a idade?",
        ],
    },
    {
        key: "raciocinio",
        title: "Raciocínio Lógico-Matemático",
        subtitle: "Estratégias matemáticas",
        icon: "fas fa-calculator",
        color: "var(--accent-cyan)",
        questions: [
            "Tem dificuldade em reconhecer números e quantidades?",
            "Apresenta dificuldade com operações matemáticas básicas?",
            "Não consegue seguir sequências numéricas (contar, ordenar)?",
            "Tem dificuldade em resolver problemas matemáticos simples?",
            "Confunde conceitos de geometria e medidas?",
        ],
    },
    {
        key: "comportamento",
        title: "Convivência e participação",
        subtitle: "Interação e autorregulação",
        icon: "fas fa-users",
        color: "var(--accent-yellow)",
        questions: [
            "Tem dificuldade em interagir com colegas de classe?",
            "Mostra rigidez em rotinas e resistência a mudanças?",
            "Apresenta dificuldade em demonstrar empatia ou entender emoções?",
            "Prefere ficar isolado(a) durante atividades em grupo?",
            "Demonstra ansiedade excessiva em situações sociais ou avaliações?",
        ],
    },
    {
        key: "coordenacao",
        title: "Coordenação Motora",
        subtitle: "Coordenação nas atividades escolares",
        icon: "fas fa-hand-paper",
        color: "var(--accent-green)",
        questions: [
            "Tem dificuldade com motricidade fina (segurar lápis, abotoar)?",
            "Apresenta dificuldade em recortar com tesoura ou usar régua?",
            "Demonstra falta de equilíbrio ou coordenação corporal?",
            "Os desenhos são desproporcionais ou difíceis de interpretar para a idade?",
            "A escrita manual é muito lenta ou requer esforço excessivo?",
        ],
    },
    {
        key: "comunicacao",
        title: "Comunicação",
        subtitle: "Expressão e compreensão",
        icon: "fas fa-comment-dots",
        color: "var(--accent-pink)",
        questions: [
            "Tem dificuldade em se expressar verbalmente de forma clara?",
            "Apresenta dificuldade em compreender instruções orais?",
            "Possui vocabulário limitado para a faixa etária?",
            "Apresenta dificuldades na pronúncia de palavras?",
            "Tem dificuldade em construir narrativas coerentes?",
        ],
    },
];

const scaleLabels = [
    { value: 0, label: "Nunca", short: "0", color: "var(--accent-green)" },
    { value: 1, label: "Às vezes", short: "1", color: "var(--accent-yellow)" },
    { value: 2, label: "Frequentemente", short: "2", color: "var(--accent-orange)" },
    { value: 3, label: "Sempre", short: "3", color: "var(--accent-red)" },
];

// Initialize form with empty answers
const initialAnswers = {};
areas.forEach((a) => {
    initialAnswers[a.key] = Array(a.questions.length).fill(null);
});

const form = useForm({
    student_id: props.student.id,
    answers: initialAnswers,
    observations: "",
});

const currentArea = computed(() => areas[currentStep.value]);
const isLastStep = computed(() => currentStep.value === areas.length - 1);
const isReviewStep = computed(() => currentStep.value === areas.length);
const totalSteps = areas.length + 1; // 6 areas + 1 review

const currentStepValid = computed(() => {
    if (isReviewStep.value) return true;
    const answers = form.answers[currentArea.value.key];
    return answers && answers.every((a) => a !== null);
});

const allValid = computed(() => {
    return areas.every((area) => {
        const answers = form.answers[area.key];
        return answers && answers.every((a) => a !== null);
    });
});

const progress = computed(() => {
    let answered = 0;
    let total = 0;
    areas.forEach((area) => {
        area.questions.forEach((_, i) => {
            total++;
            if (form.answers[area.key][i] !== null) answered++;
        });
    });
    return total > 0 ? Math.round((answered / total) * 100) : 0;
});

const setAnswer = (questionIndex, value) => {
    form.answers[currentArea.value.key][questionIndex] = value;
};

const nextStep = () => {
    if (currentStep.value < totalSteps - 1) {
        currentStep.value++;
    }
};

const prevStep = () => {
    if (currentStep.value > 0) {
        currentStep.value--;
    }
};

const submit = () => {
    form.post(route("teacher.screenings.store"));
};

const getAreaScore = (areaKey) => {
    const answers = form.answers[areaKey];
    if (!answers || answers.some((a) => a === null)) return null;
    const sum = answers.reduce((a, b) => a + b, 0);
    return Math.round((sum / (answers.length * 3)) * 100);
};

const getRiskLevel = (score) => {
    if (score === null) return null;
    if (score <= 25) return { label: "Rotina", color: "var(--accent-green)", icon: "🟢" };
    if (score <= 50) return { label: "Atenção pontual", color: "var(--accent-yellow)", icon: "🟡" };
    if (score <= 75) return { label: "Acompanhamento próximo", color: "var(--accent-orange)", icon: "🟠" };
    return { label: "Apoio prioritário", color: "var(--accent-red)", icon: "🔴" };
};
</script>

<template>
    <DashboardLayout role="teacher">
        <Head :title="`Triagem: ${student.user?.name} - EducAdapta`" />

        <p class="card" style="padding: 1rem; margin-bottom: 1.25rem; color: var(--text-secondary); font-size: 0.85rem;">
            Este índice resume a frequência das observações nos 30 itens: Nunca vale 0, Às vezes 1, Frequentemente 2 e Sempre 3. As respostas têm o mesmo peso e são convertidas em percentual; o índice não usa notas ou histórico escolar e serve apenas como apoio à conversa pedagógica.
        </p>

        <!-- Header with student info -->
        <div
            style="
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1.5rem;
                flex-wrap: wrap;
            "
        >
            <div
                style="
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: var(--accent-purple-solid);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 1.3rem;
                "
            >
                {{ student.user?.name?.charAt(0)?.toUpperCase() }}
            </div>
            <div>
                <h1 style="font-size: 1.3rem; font-weight: 700">
                    <i
                        class="fas fa-clipboard-check"
                        style="color: var(--accent-blue)"
                    ></i>
                    Triagem
                </h1>
                <p style="color: var(--text-secondary); font-size: 0.85rem">
                    Aluno: <strong>{{ student.user?.name }}</strong> · Nível
                    {{ student.level }}
                </p>
            </div>
        </div>

        <!-- Progress bar -->
        <div style="margin-bottom: 1.5rem">
            <div
                style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                "
            >
                <span style="font-size: 0.75rem; color: var(--text-secondary)"
                    >Progresso: {{ progress }}%</span
                >
                <span style="font-size: 0.75rem; color: var(--text-secondary)"
                    >Etapa {{ currentStep + 1 }} de {{ totalSteps }}</span
                >
            </div>
            <div
                style="
                    height: 8px;
                    background: var(--bg-dark);
                    border-radius: 10px;
                    overflow: hidden;
                "
            >
                <div
                    style="
                        height: 100%;
                        border-radius: 10px;
                        transition: width 0.5s ease;
                    "
                    :style="{
                        width: progress + '%',
                        background:
                            'var(--accent-blue)',
                    }"
                ></div>
            </div>
            <!-- Step indicators -->
            <div
                style="
                    display: flex;
                    justify-content: space-between;
                    margin-top: 0.5rem;
                "
            >
                <button
                    v-for="(area, idx) in areas"
                    :key="area.key"
                    @click="currentStep = idx"
                    style="
                        font-size: 0.6rem;
                        padding: 0.2rem 0.5rem;
                        border-radius: 10px;
                        cursor: pointer;
                        border: none;
                        transition: all 0.2s;
                    "
                    :style="{
                        background:
                            idx === currentStep
                                ? `color-mix(in srgb, ${area.color} 13%, transparent)`
                                : 'var(--bg-dark)',
                        color:
                            idx === currentStep
                                ? area.color
                                : 'var(--text-secondary)',
                        fontWeight: idx === currentStep ? '700' : '400',
                        border:
                            idx === currentStep
                                ? `1px solid ${area.color}`
                                : '1px solid transparent',
                    }"
                >
                    {{ area.title.split(" ")[0] }}
                </button>
                <button
                    @click="currentStep = areas.length"
                    style="
                        font-size: 0.6rem;
                        padding: 0.2rem 0.5rem;
                        border-radius: 10px;
                        cursor: pointer;
                        border: none;
                        transition: all 0.2s;
                    "
                    :style="{
                        background: isReviewStep
                            ? 'rgba(16,185,129,0.15)'
                            : 'var(--bg-dark)',
                        color: isReviewStep
                            ? 'var(--accent-green)'
                            : 'var(--text-secondary)',
                        fontWeight: isReviewStep ? '700' : '400',
                    }"
                >
                    Resumo
                </button>
            </div>
        </div>

        <!-- Questions section (non-review steps) -->
        <div v-if="!isReviewStep" class="card" style="padding: 2rem">
            <div
                style="
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                "
            >
                <div
                    style="
                        width: 48px;
                        height: 48px;
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.2rem;
                    "
                    :style="{
                        background: `color-mix(in srgb, ${currentArea.color} 13%, transparent)`,
                        color: currentArea.color,
                    }"
                >
                    <i :class="currentArea.icon"></i>
                </div>
                <div>
                    <h2 style="font-size: 1.1rem; font-weight: 700">
                        {{ currentArea.title }}
                    </h2>
                    <p style="font-size: 0.8rem; color: var(--text-secondary)">
                        {{ currentArea.subtitle }}
                    </p>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1.5rem">
                <div
                    v-for="(question, qIdx) in currentArea.questions"
                    :key="qIdx"
                    style="
                        padding: 1.25rem;
                        border-radius: var(--radius-md);
                        background: var(--bg-light);
                        border: 1px solid transparent;
                        transition: border-color 0.2s;
                    "
                    :style="{
                        borderColor:
                            form.answers[currentArea.key][qIdx] !== null
                                ? currentArea.color
                                : 'transparent',
                    }"
                >
                    <p
                        style="
                            font-size: 0.875rem;
                            font-weight: 500;
                            margin-bottom: 0.75rem;
                            line-height: 1.5;
                        "
                    >
                        <span
                            style="font-weight: 700; color: var(--accent-blue)"
                            >{{ qIdx + 1 }}.</span
                        >
                        {{ question }}
                    </p>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap">
                        <button
                            v-for="option in scaleLabels"
                            :key="option.value"
                            @click="setAnswer(qIdx, option.value)"
                            style="
                                padding: 0.5rem 1rem;
                                border-radius: var(--radius-md);
                                font-size: 0.8rem;
                                cursor: pointer;
                                transition: all 0.2s;
                                border: 2px solid transparent;
                                flex: 1;
                                min-width: 90px;
                                text-align: center;
                            "
                            :style="{
                                background:
                                    form.answers[currentArea.key][qIdx] ===
                                    option.value
                                        ? `color-mix(in srgb, ${option.color} 13%, transparent)`
                                        : 'var(--bg-dark)',
                                color:
                                    form.answers[currentArea.key][qIdx] ===
                                    option.value
                                        ? option.color
                                        : 'var(--text-secondary)',
                                borderColor:
                                    form.answers[currentArea.key][qIdx] ===
                                    option.value
                                        ? option.color
                                        : 'transparent',
                                fontWeight:
                                    form.answers[currentArea.key][qIdx] ===
                                    option.value
                                        ? '700'
                                        : '400',
                            }"
                        >
                            <span style="font-size: 0.7rem; display: block">{{
                                option.short
                            }}</span>
                            {{ option.label }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Review step -->
        <div v-else class="card" style="padding: 2rem">
            <h2
                style="
                    font-size: 1.1rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                "
            >
                <i
                    class="fas fa-chart-bar"
                    style="color: var(--accent-green)"
                ></i>
                Resumo da Triagem
            </h2>

            <!-- Area scores -->
            <div
                style="
                    display: grid;
                    grid-template-columns: repeat(
                        auto-fill,
                        minmax(280px, 1fr)
                    );
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                "
            >
                <div
                    v-for="area in areas"
                    :key="area.key"
                    style="
                        padding: 1rem;
                        border-radius: var(--radius-md);
                        background: var(--bg-light);
                    "
                >
                    <div
                        style="
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            margin-bottom: 0.5rem;
                        "
                    >
                        <div
                            style="
                                display: flex;
                                align-items: center;
                                gap: 0.5rem;
                            "
                        >
                            <i
                                :class="area.icon"
                                :style="{
                                    color: area.color,
                                    fontSize: '0.9rem',
                                }"
                            ></i>
                            <span
                                style="font-weight: 600; font-size: 0.85rem"
                                >{{ area.title }}</span
                            >
                        </div>
                        <span
                            v-if="getAreaScore(area.key) !== null"
                            style="font-weight: 800; font-size: 0.9rem"
                            :style="{
                                color: getRiskLevel(getAreaScore(area.key))
                                    ?.color,
                            }"
                        >
                            {{ getAreaScore(area.key) }}%
                        </span>
                        <span
                            v-else
                            style="color: var(--text-light); font-size: 0.75rem"
                            >Incompleto</span
                        >
                    </div>
                    <!-- Score bar -->
                    <div
                        style="
                            height: 6px;
                            background: var(--bg-dark);
                            border-radius: 10px;
                            overflow: hidden;
                        "
                    >
                        <div
                            style="
                                height: 100%;
                                border-radius: 10px;
                                transition: width 0.5s ease;
                            "
                            :style="{
                                width: (getAreaScore(area.key) || 0) + '%',
                                background:
                                    getRiskLevel(getAreaScore(area.key))
                                        ?.color || 'var(--text-secondary)',
                            }"
                        ></div>
                    </div>
                    <div
                        v-if="getRiskLevel(getAreaScore(area.key))"
                        style="margin-top: 0.35rem"
                    >
                        <span
                            style="font-size: 0.65rem"
                            :style="{
                                color: getRiskLevel(getAreaScore(area.key))
                                    .color,
                            }"
                        >
                            {{ getRiskLevel(getAreaScore(area.key)).icon }}
                            {{ getRiskLevel(getAreaScore(area.key)).label }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Observations -->
            <div style="margin-bottom: 1.5rem">
                <label
                    style="
                        font-weight: 600;
                        font-size: 0.875rem;
                        display: block;
                        margin-bottom: 0.5rem;
                    "
                >
                    <i
                        class="fas fa-sticky-note"
                        style="color: var(--accent-yellow)"
                    ></i>
                    Observações (opcional)
                </label>
                <textarea
                    v-model="form.observations"
                    rows="4"
                    placeholder="Adicione observações sobre o comportamento geral do aluno, contexto familiar, etc."
                    style="
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: var(--radius-md);
                        background: var(--bg-dark);
                        color: var(--text-primary);
                        font-size: 0.85rem;
                        resize: vertical;
                        font-family: inherit;
                    "
                ></textarea>
            </div>

            <!-- Validation warning -->
            <div
                v-if="!allValid"
                style="
                    background: rgba(245, 158, 11, 0.15);
                    border: 1px solid rgba(245, 158, 11, 0.3);
                    color: var(--accent-yellow);
                    padding: 0.75rem;
                    border-radius: var(--radius-md);
                    margin-bottom: 1rem;
                    font-size: 0.8rem;
                "
            >
                <i class="fas fa-exclamation-triangle"></i> Algumas perguntas
                ainda não foram respondidas. Volte nas etapas para completar.
            </div>
        </div>

        <!-- Navigation buttons -->
        <div
            style="
                display: flex;
                justify-content: space-between;
                margin-top: 1.5rem;
                gap: 1rem;
                flex-wrap: wrap;
            "
        >
            <button
                @click="prevStep"
                :disabled="currentStep === 0"
                class="btn btn-outline"
                :style="{ opacity: currentStep === 0 ? 0.4 : 1 }"
            >
                <i class="fas fa-arrow-left"></i> Anterior
            </button>

            <div style="display: flex; gap: 0.75rem">
                <button
                    v-if="!isReviewStep"
                    @click="nextStep"
                    class="btn btn-primary"
                    :disabled="!currentStepValid"
                    :style="{ opacity: currentStepValid ? 1 : 0.5 }"
                >
                    Próximo <i class="fas fa-arrow-right"></i>
                </button>
                <button
                    v-else
                    @click="submit"
                    class="btn btn-primary"
                    :disabled="!allValid || form.processing"
                    :style="{
                        opacity: allValid ? 1 : 0.5,
                        background: allValid
                            ? 'var(--accent-green)'
                            : undefined,
                    }"
                >
                    <i class="fas fa-check-circle"></i>
                    {{ form.processing ? "Salvando..." : "Finalizar Triagem" }}
                </button>
            </div>
        </div>
    </DashboardLayout>
</template>
