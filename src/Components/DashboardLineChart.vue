<script setup>
import { computed } from 'vue';
import { motion, useReducedMotion } from 'motion-v';

const MotionCircle = motion.circle;
const prefersReducedMotion = useReducedMotion();

const props = defineProps({
    labels: { type: Array, default: () => [] },
    series: { type: Array, default: () => [] },
    label: { type: String, default: 'Gráfico de linhas' },
});

const chart = computed(() => {
    const width = 560;
    const height = 260;
    const left = 44;
    const right = 18;
    const top = 24;
    const bottom = 48;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const max = Math.max(1, ...props.series.flatMap(item => item.values.map(value => Number(value) || 0)));
    const xAt = index => props.labels.length < 2 ? left + plotWidth / 2 : left + index * plotWidth / (props.labels.length - 1);
    const yAt = value => top + plotHeight - (Number(value) || 0) / max * plotHeight;
    return {
        width, height, left, right, top, bottom, plotWidth, plotHeight, max,
        ticks: [...new Set([0, Math.ceil(max / 2), max])],
        labels: props.labels.map((text, index) => ({ text, x: xAt(index) })),
        series: props.series.map(item => ({ ...item, points: item.values.map((value, index) => `${xAt(index)},${yAt(value)}`).join(' ') })),
    };
});
</script>

<template>
    <div v-if="labels.length && series.length" class="line-chart">
        <div class="chart-legend" aria-hidden="true"><span v-for="item in series" :key="item.label"><i :style="{ background: item.color }"></i>{{ item.label }}</span></div>
        <svg :viewBox="`0 0 ${chart.width} ${chart.height}`" aria-hidden="true">
            <title>{{ label }}</title>
            <g v-for="tick in chart.ticks" :key="tick">
                <line :x1="chart.left" :x2="chart.width - chart.right" :y1="chart.top + chart.plotHeight - tick / chart.max * chart.plotHeight" :y2="chart.top + chart.plotHeight - tick / chart.max * chart.plotHeight" class="chart-gridline" />
                <text :x="chart.left - 10" :y="chart.top + chart.plotHeight - tick / chart.max * chart.plotHeight + 4" text-anchor="end" class="chart-axis-label">{{ tick }}</text>
            </g>
            <g v-for="item in chart.series" :key="item.label">
                <polyline :points="item.points" fill="none" :stroke="item.color" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                <MotionCircle v-for="(value, index) in item.values" :key="index" :cx="chart.labels[index].x" :cy="chart.top + chart.plotHeight - (Number(value) || 0) / chart.max * chart.plotHeight" r="4" :fill="item.color" :initial="prefersReducedMotion ? false : { scale: .55, opacity: .65 }" :animate="{ scale: 1, opacity: 1 }" :transition="{ duration: prefersReducedMotion ? 0 : .2, delay: prefersReducedMotion ? 0 : index * .035 }" />
            </g>
            <text v-for="point in chart.labels" :key="point.text" :x="point.x" :y="chart.height - 17" text-anchor="middle" class="chart-axis-label">{{ point.text }}</text>
        </svg>
        <table class="sr-only">
            <caption>{{ label }}</caption>
            <thead><tr><th scope="col">Indicador</th><th v-for="point in chart.labels" :key="point.text" scope="col">{{ point.text }}</th></tr></thead>
            <tbody><tr v-for="item in chart.series" :key="item.label"><th scope="row">{{ item.label }}</th><td v-for="(value, index) in item.values" :key="index">{{ value }}</td></tr></tbody>
        </table>
    </div>
    <p v-else class="chart-empty">Ainda não há dados para este gráfico.</p>
</template>

<style scoped>
.line-chart { width: 100%; }
.chart-legend { display: flex; justify-content: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 8px; color: var(--text-secondary); font-size: .74rem; }
.chart-legend span { display: inline-flex; align-items: center; gap: 7px; }
.chart-legend i { width: 9px; height: 9px; border-radius: 50%; }
svg { display: block; width: 100%; height: auto; overflow: visible; font-family: inherit; }
.chart-gridline { stroke: var(--border); stroke-width: 1; }
.chart-axis-label { fill: var(--text-secondary); font-size: 11px; }
.chart-empty { padding: 32px 12px; color: var(--text-secondary); font-size: .85rem; text-align: center; }
</style>
