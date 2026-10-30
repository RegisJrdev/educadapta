<script setup>
import DashboardLayout from "@/Layouts/DashboardLayout.vue";
import { Head } from "@/demo/navigation.js";
import { ref, computed } from "vue";

const props = defineProps({
    screenings: { type: Array, default: () => [] },
    riskCounts: { type: Object, default: () => ({}) },
    totalScreenings: { type: Number, default: 0 },
});

const filterRisk = ref("all");

const riskConfig = {
    baixo: {
        label: "Rotina",
        color: "var(--accent-green)",
        bg: "color-mix(in srgb, var(--accent-green) 10%, var(--bg-card))",
        icon: "🟢",
    },
    atencao: {
        label: "Atenção pontual",
        color: "var(--accent-yellow)",
        bg: "color-mix(in srgb, var(--accent-yellow) 10%, var(--bg-card))",
        icon: "🟡",
    },
    moderado: {
        label: "Acompanhamento próximo",
        color: "var(--accent-orange)",
        bg: "color-mix(in srgb, var(--accent-orange) 10%, var(--bg-card))",
        icon: "🟠",
    },
    alto: {
        label: "Apoio prioritário",
        color: "var(--accent-red)",
        bg: "color-mix(in srgb, var(--accent-red) 10%, var(--bg-card))",
        icon: "🔴",
    },
};

const getRisk = (level) => riskConfig[level] || riskConfig.baixo;

const filtered = computed(() => {
    if (filterRisk.value === "all") return props.screenings;
    return props.screenings.filter((s) => s.risk_level === filterRisk.value);
});

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const areaLabels = {
    atencao: "Atenção",
    leitura: "Leitura",
    raciocinio: "Raciocínio",
    comportamento: "Social",
    coordenacao: "Motor",
    comunicacao: "Comunic.",
};
</script>

<template>
    <DashboardLayout role="institution">
        <Head title="Triagem - EducAdapta" />

        <div style="margin-bottom: 2rem">
            <h1 style="font-size: 1.5rem; font-weight: 700">
                <i
                    class="fas fa-clipboard-check"
                    style="color: var(--accent-blue)"
                ></i>
                Painel de Triagem
            </h1>
            <p style="color: var(--text-secondary); font-size: 0.875rem">
                Visão geral de todos os alunos triados pelos professores.
            </p>
        </div>

        <!-- KPI Cards -->
        <div
            style="
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            "
        >
            <div class="card" style="padding: 1.25rem; text-align: center">
                <p
                    style="
                        font-size: 2rem;
                        font-weight: 800;
                        color: var(--accent-blue);
                    "
                >
                    {{ totalScreenings }}
                </p>
                <p style="font-size: 0.75rem; color: var(--text-secondary)">
                    Total Triagens
                </p>
            </div>
            <div
                v-for="(config, level) in riskConfig"
                :key="level"
                class="card"
                style="
                    padding: 1.25rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                "
                :style="{
                    borderColor:
                        filterRisk === level ? config.color : 'transparent',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                }"
                @click="filterRisk = filterRisk === level ? 'all' : level"
            >
                <p
                    style="font-size: 2rem; font-weight: 800"
                    :style="{ color: config.color }"
                >
                    {{ riskCounts[level] || 0 }}
                </p>
                <p style="font-size: 0.75rem; color: var(--text-secondary)">
                    {{ config.icon }} {{ config.label }}
                </p>
            </div>
        </div>

        <!-- Filter indicator -->
        <div
            v-if="filterRisk !== 'all'"
            style="
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
            "
        >
            <span style="font-size: 0.8rem; color: var(--text-secondary)">
                Filtrando por:
                <strong :style="{ color: getRisk(filterRisk).color }">{{
                    getRisk(filterRisk).label
                }}</strong>
            </span>
            <button
                @click="filterRisk = 'all'"
                style="
                    background: none;
                    border: none;
                    color: var(--accent-blue);
                    cursor: pointer;
                    font-size: 0.75rem;
                    text-decoration: underline;
                "
            >
                Limpar
            </button>
        </div>

        <!-- Screenings table -->
        <div class="card" style="padding: 1.5rem; overflow-x: auto">
            <table
                v-if="filtered.length"
                style="
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.85rem;
                "
            >
                <thead>
                    <tr
                        style="
                            text-align: left;
                            border-bottom: 1px solid var(--border);
                        "
                    >
                        <th style="padding: 0.75rem 0.5rem; font-weight: 600">
                            Aluno
                        </th>
                        <th style="padding: 0.75rem 0.5rem; font-weight: 600">
                            Professor
                        </th>
                        <th style="padding: 0.75rem 0.5rem; font-weight: 600">
                            Data
                        </th>
                        <th style="padding: 0.75rem 0.5rem; font-weight: 600">
                            Score
                        </th>
                        <th style="padding: 0.75rem 0.5rem; font-weight: 600">
                            Acompanhamento
                        </th>
                        <th style="padding: 0.75rem 0.5rem; font-weight: 600">
                            Áreas
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="sc in filtered"
                        :key="sc.id"
                        style="
                            border-bottom: 1px solid var(--border);
                            transition: background 0.2s;
                        "
                        class="table-row-hover"
                    >
                        <td style="padding: 0.75rem 0.5rem">
                            <div
                                style="
                                    display: flex;
                                    align-items: center;
                                    gap: 0.5rem;
                                "
                            >
                                <div
                                    style="
                                        width: 32px;
                                        height: 32px;
                                        border-radius: 50%;
                                        background: var(--accent-purple-solid);
                                        color: white;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-weight: 700;
                                        font-size: 0.75rem;
                                        flex-shrink: 0;
                                    "
                                >
                                    {{
                                        sc.student?.user?.name
                                            ?.charAt(0)
                                            ?.toUpperCase()
                                    }}
                                </div>
                                <span style="font-weight: 600">{{
                                    sc.student?.user?.name
                                }}</span>
                            </div>
                        </td>
                        <td
                            style="
                                padding: 0.75rem 0.5rem;
                                color: var(--text-secondary);
                            "
                        >
                            {{ sc.teacher?.name }}
                        </td>
                        <td
                            style="
                                padding: 0.75rem 0.5rem;
                                color: var(--text-secondary);
                                font-size: 0.8rem;
                            "
                        >
                            {{ formatDate(sc.created_at) }}
                        </td>
                        <td style="padding: 0.75rem 0.5rem">
                            <span
                                style="font-weight: 800; font-size: 1rem"
                                :style="{ color: getRisk(sc.risk_level).color }"
                            >
                                {{ sc.score_geral }}%
                            </span>
                        </td>
                        <td style="padding: 0.75rem 0.5rem">
                            <span
                                style="
                                    padding: 0.3rem 0.65rem;
                                    border-radius: 20px;
                                    font-size: 0.7rem;
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
                        </td>
                        <td style="padding: 0.75rem 0.5rem">
                            <div
                                style="
                                    display: flex;
                                    gap: 0.3rem;
                                    flex-wrap: wrap;
                                "
                            >
                                <span
                                    v-for="(label, key) in areaLabels"
                                    :key="key"
                                    style="
                                        font-size: 0.55rem;
                                        padding: 0.15rem 0.35rem;
                                        border-radius: 8px;
                                        background: var(--bg-dark);
                                    "
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
                                >
                                    {{ label }}: {{ sc["score_" + key] }}%
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

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
                <p>
                    {{
                        filterRisk !== "all"
                            ? "Nenhuma triagem nessa faixa de acompanhamento."
                            : "Nenhuma triagem realizada ainda."
                    }}
                </p>
            </div>
        </div>
    </DashboardLayout>
</template>

<style scoped>
.table-row-hover:hover {
    background: var(--bg-secondary);
}
</style>
