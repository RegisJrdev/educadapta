<script setup>
import DashboardLayout from "@/Layouts/DashboardLayout.vue";
import { Head, Link, usePage } from "@/demo/navigation.js";
import { computed } from "vue";

const props = defineProps({
    students: { type: Array, default: () => [] },
    screenings: { type: Array, default: () => [] },
});

const page = usePage();
const flash = computed(() => page.props.flash || {});

const riskConfig = {
    baixo: {
        label: "Baixo Risco",
        color: "#10b981",
        bg: "rgba(16,185,129,0.15)",
        icon: "🟢",
    },
    atencao: {
        label: "Atenção",
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.15)",
        icon: "🟡",
    },
    moderado: {
        label: "Moderado",
        color: "#f97316",
        bg: "rgba(249,115,22,0.15)",
        icon: "🟠",
    },
    alto: {
        label: "Alto Risco",
        color: "#ef4444",
        bg: "rgba(239,68,68,0.15)",
        icon: "🔴",
    },
};

const getRisk = (level) => riskConfig[level] || riskConfig.baixo;

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};
</script>

<template>
    <DashboardLayout role="teacher">
        <Head title="Triagem - EducAdapta" />

        <!-- Header -->
        <div
            style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
                flex-wrap: wrap;
                gap: 1rem;
            "
        >
            <div>
                <h1 style="font-size: 1.5rem; font-weight: 700">
                    <i
                        class="fas fa-clipboard-check"
                        style="color: var(--accent-blue)"
                    ></i>
                    Triagem
                </h1>
                <p style="color: var(--text-secondary); font-size: 0.875rem">
                    Questionário de rastreio para identificar possíveis
                    dificuldades de aprendizagem.
                </p>
            </div>
        </div>

        <!-- Flash message -->
        <div
            v-if="flash?.success"
            style="
                background: rgba(16, 185, 129, 0.15);
                border: 1px solid rgba(16, 185, 129, 0.3);
                color: #10b981;
                padding: 1rem;
                border-radius: var(--radius-md);
                margin-bottom: 1.5rem;
                font-size: 0.875rem;
            "
        >
            <i class="fas fa-check-circle"></i> {{ flash.success }}
        </div>

        <!-- Select student for new screening -->
        <div class="card" style="padding: 1.5rem; margin-bottom: 2rem">
            <h2
                style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem"
            >
                <i
                    class="fas fa-plus-circle"
                    style="color: var(--accent-green)"
                ></i>
                Nova Triagem
            </h2>
            <p
                style="
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    margin-bottom: 1rem;
                "
            >
                Selecione um aluno para iniciar o questionário de triagem.
            </p>

            <div
                v-if="students?.length"
                style="
                    display: grid;
                    grid-template-columns: repeat(
                        auto-fill,
                        minmax(220px, 1fr)
                    );
                    gap: 0.75rem;
                "
            >
                <Link
                    v-for="s in students"
                    :key="s.id"
                    :href="route('teacher.screenings.create', s.id)"
                    style="
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        padding: 0.75rem;
                        border-radius: var(--radius-md);
                        background: var(--bg-light);
                        text-decoration: none;
                        color: inherit;
                        transition: all 0.2s;
                        border: 1px solid transparent;
                    "
                    class="student-card-hover"
                >
                    <div
                        style="
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            background: var(--accent-purple);
                            color: white;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: 700;
                            font-size: 0.9rem;
                            flex-shrink: 0;
                        "
                    >
                        {{ s.user?.name?.charAt(0)?.toUpperCase() }}
                    </div>
                    <div>
                        <p style="font-weight: 600; font-size: 0.85rem">
                            {{ s.user?.name }}
                        </p>
                        <p
                            style="
                                font-size: 0.7rem;
                                color: var(--text-secondary);
                            "
                        >
                            Nível {{ s.level }}
                        </p>
                    </div>
                </Link>
            </div>
            <div
                v-else
                style="
                    text-align: center;
                    color: var(--text-secondary);
                    padding: 1rem;
                "
            >
                <i class="fas fa-info-circle"></i> Nenhum aluno disponível.
            </div>
        </div>

        <!-- Previous screenings -->
        <div class="card" style="padding: 1.5rem">
            <h2
                style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem"
            >
                <i class="fas fa-history" style="color: var(--accent-blue)"></i>
                Triagens Realizadas
            </h2>

            <div
                v-if="screenings?.length"
                style="display: flex; flex-direction: column; gap: 0.75rem"
            >
                <div
                    v-for="sc in screenings"
                    :key="sc.id"
                    style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 1rem;
                        background: var(--bg-light);
                        border-radius: var(--radius-md);
                        flex-wrap: wrap;
                        gap: 0.75rem;
                    "
                >
                    <div
                        style="display: flex; align-items: center; gap: 0.75rem"
                    >
                        <div
                            style="
                                width: 42px;
                                height: 42px;
                                border-radius: 50%;
                                background: var(--accent-blue);
                                color: white;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-weight: 700;
                                font-size: 0.9rem;
                                flex-shrink: 0;
                            "
                        >
                            {{
                                sc.student?.user?.name?.charAt(0)?.toUpperCase()
                            }}
                        </div>
                        <div>
                            <p style="font-weight: 600; font-size: 0.9rem">
                                {{ sc.student?.user?.name }}
                            </p>
                            <p
                                style="
                                    font-size: 0.7rem;
                                    color: var(--text-secondary);
                                "
                            >
                                {{ formatDate(sc.created_at) }}
                            </p>
                        </div>
                    </div>

                    <div
                        style="
                            display: flex;
                            align-items: center;
                            gap: 1rem;
                            flex-wrap: wrap;
                        "
                    >
                        <!-- Score geral -->
                        <div style="text-align: center">
                            <p
                                style="font-size: 1.1rem; font-weight: 800"
                                :style="{ color: getRisk(sc.risk_level).color }"
                            >
                                {{ sc.score_geral }}%
                            </p>
                            <p
                                style="
                                    font-size: 0.65rem;
                                    color: var(--text-secondary);
                                "
                            >
                                Score Geral
                            </p>
                        </div>

                        <!-- Risk badge -->
                        <span
                            style="
                                padding: 0.35rem 0.75rem;
                                border-radius: 20px;
                                font-size: 0.75rem;
                                font-weight: 600;
                            "
                            :style="{
                                background: getRisk(sc.risk_level).bg,
                                color: getRisk(sc.risk_level).color,
                            }"
                        >
                            {{ getRisk(sc.risk_level).icon }}
                            {{ getRisk(sc.risk_level).label }}
                        </span>
                    </div>

                    <!-- Mini area scores -->
                    <div
                        style="
                            display: flex;
                            gap: 0.4rem;
                            flex-wrap: wrap;
                            width: 100%;
                            margin-top: 0.25rem;
                        "
                    >
                        <span
                            v-for="(area, key) in {
                                atencao: 'Atenção',
                                leitura: 'Leitura',
                                raciocinio: 'Raciocínio',
                                comportamento: 'Social',
                                coordenacao: 'Motor',
                                comunicacao: 'Comunic.',
                            }"
                            :key="key"
                            style="
                                font-size: 0.6rem;
                                padding: 0.2rem 0.5rem;
                                border-radius: 10px;
                                background: var(--bg-dark);
                                color: var(--text-secondary);
                            "
                        >
                            {{ area }}:
                            <strong
                                :style="{
                                    color: getRisk(
                                        sc['score_' + key] > 75
                                            ? 'alto'
                                            : sc['score_' + key] > 50
                                              ? 'moderado'
                                              : sc['score_' + key] > 25
                                                ? 'atencao'
                                                : 'baixo',
                                    ).color,
                                }"
                                >{{ sc["score_" + key] }}%</strong
                            >
                        </span>
                    </div>
                </div>
            </div>

            <div
                v-else
                style="
                    text-align: center;
                    padding: 2rem;
                    color: var(--text-secondary);
                "
            >
                <i
                    class="fas fa-clipboard"
                    style="
                        font-size: 2.5rem;
                        color: var(--text-light);
                        margin-bottom: 0.75rem;
                        display: block;
                    "
                ></i>
                <p>Nenhuma triagem realizada ainda.</p>
                <p style="font-size: 0.75rem; margin-top: 0.25rem">
                    Selecione um aluno acima para começar.
                </p>
            </div>
        </div>
    </DashboardLayout>
</template>

<style scoped>
.student-card-hover:hover {
    border-color: var(--accent-blue) !important;
    background: rgba(59, 130, 246, 0.08) !important;
    transform: translateY(-1px);
}
</style>
