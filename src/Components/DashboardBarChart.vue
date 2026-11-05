<script setup>
import { computed } from 'vue';

const props = defineProps({
    items: { type: Array, default: () => [] },
    label: { type: String, default: 'Gráfico de barras' },
    color: { type: String, default: '#1558C9' },
});

const chart = computed(() => {
    const width = 560;
    const height = 250;
    const left = 42;
    const right = 16;
    const top = 24;
    const bottom = 48;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const max = Math.max(1, ...props.items.map(item => Number(item.value) || 0));
    const slot = props.items.length ? plotWidth / props.items.length : plotWidth;
    const bars = props.items.map((item, index) => {
        const value = Math.max(0, Number(item.value) || 0);
        const barHeight = value / max * plotHeight;
        const barWidth = Math.min(slot * .6, 80);
        const labelX = left + slot * index + slot / 2;
        return { ...item, value, x: labelX - barWidth / 2, y: top + plotHeight - barHeight, width: barWidth, height: barHeight, labelX };
    });
    return { width, height, left, top, plotWidth, plotHeight, max, bars, ticks: [...new Set([0, Math.ceil(max / 2), max])] };
});
</script>

<template>
    <div v-if="items.length" class="chart-wrap">
        <svg :viewBox="`0 0 ${chart.width} ${chart.height}`" role="img" :aria-label="label">
            <title>{{ label }}</title>
            <g v-for="tick in chart.ticks" :key="tick">
                <line :x1="chart.left" :x2="chart.left + chart.plotWidth" :y1="chart.top + chart.plotHeight - tick / chart.max * chart.plotHeight" :y2="chart.top + chart.plotHeight - tick / chart.max * chart.plotHeight" class="chart-gridline" />
                <text :x="chart.left - 10" :y="chart.top + chart.plotHeight - tick / chart.max * chart.plotHeight + 4" text-anchor="end" class="chart-axis-label">{{ tick }}</text>
            </g>
            <g v-for="bar in chart.bars" :key="bar.label">
                <rect :x="bar.x" :y="bar.y" :width="bar.width" :height="bar.height" rx="4" :fill="bar.color || color" />
                <text :x="bar.labelX" :y="Math.max(chart.top + 12, bar.y - 8)" text-anchor="middle" class="chart-value">{{ bar.value }}</text>
                <text :x="bar.labelX" :y="chart.height - 18" text-anchor="middle" class="chart-axis-label">{{ bar.label }}</text>
            </g>
        </svg>
        <table class="sr-only">
            <caption>{{ label }}</caption>
            <thead><tr><th scope="col">Categoria</th><th scope="col">Quantidade</th></tr></thead>
            <tbody><tr v-for="bar in chart.bars" :key="bar.label"><th scope="row">{{ bar.label }}</th><td>{{ bar.value }}</td></tr></tbody>
        </table>
    </div>
    <p v-else class="chart-empty">Ainda não há dados para este gráfico.</p>
</template>

<style scoped>
.chart-wrap { width: 100%; min-height: 210px; }
svg { display: block; width: 100%; height: auto; min-height: 190px; overflow: visible; font-family: inherit; }
.chart-gridline { stroke: var(--border); stroke-width: 1; }
.chart-axis-label { fill: var(--text-secondary); font-size: 11px; }
.chart-value { fill: var(--text-primary); font-size: 12px; font-weight: 700; }
.chart-empty { padding: 32px 12px; color: var(--text-secondary); font-size: .85rem; text-align: center; }
</style>
