<script setup>
import { computed } from 'vue';

const props = defineProps({
    items: { type: Array, default: () => [] },
    label: { type: String, default: 'Gráfico de distribuição' },
    centerLabel: { type: String, default: 'total' },
    centerValue: { type: [Number, String], default: null },
});

const chart = computed(() => {
    const circumference = 2 * Math.PI * 43;
    const total = props.items.reduce((sum, item) => sum + Math.max(0, Number(item.value) || 0), 0);
    let offset = 0;
    const items = props.items.map(item => {
        const value = Math.max(0, Number(item.value) || 0);
        const length = total ? value / total * circumference : 0;
        const result = { ...item, value, length, offset: offset * -1, percent: total ? Math.round(value / total * 100) : 0 };
        offset += length;
        return result;
    });
    return { circumference, total, items };
});
</script>

<template>
    <div class="donut-chart">
        <svg viewBox="0 0 120 120" role="img" :aria-label="`${label}: ${chart.total}`">
            <title>{{ label }}</title>
            <circle cx="60" cy="60" r="43" fill="none" stroke="var(--bg-secondary)" stroke-width="13" />
            <circle v-for="item in chart.items" :key="item.label" cx="60" cy="60" r="43" fill="none" :stroke="item.color" stroke-width="13" :stroke-dasharray="`${item.length} ${chart.circumference - item.length}`" :stroke-dashoffset="item.offset" transform="rotate(-90 60 60)" />
            <text x="60" y="57" text-anchor="middle" class="donut-total">{{ centerValue ?? chart.total }}</text>
            <text x="60" y="73" text-anchor="middle" class="donut-center-label">{{ centerLabel }}</text>
        </svg>
        <ul v-if="chart.items.length" class="donut-legend">
            <li v-for="item in chart.items" :key="item.label"><span><i :style="{ background: item.color }"></i>{{ item.label }}</span><strong>{{ item.value }} <small>{{ item.percent }}%</small></strong></li>
        </ul>
        <p v-if="!chart.total" class="chart-empty">Ainda não há dados para esta distribuição.</p>
    </div>
</template>

<style scoped>
.donut-chart { display: grid; grid-template-columns: minmax(120px, 160px) minmax(0, 1fr); align-items: center; gap: 20px; }
svg { display: block; width: 100%; max-width: 160px; margin: auto; transform: rotate(0deg); }
circle:nth-of-type(n+2) { stroke-linecap: butt; }
.donut-total { fill: var(--text-primary); font-size: 19px; font-weight: 750; }
.donut-center-label { fill: var(--text-secondary); font-size: 9px; }
.donut-legend { display: grid; gap: 12px; margin: 0; padding: 0; list-style: none; }
.donut-legend li, .donut-legend li > span { display: flex; align-items: center; justify-content: space-between; gap: 10px; color: var(--text-secondary); font-size: .76rem; }
.donut-legend li > span { justify-content: flex-start; }
.donut-legend i { display: inline-block; width: 9px; height: 9px; flex: 0 0 9px; border-radius: 50%; }
.donut-legend strong { color: var(--text-primary); font-size: .8rem; white-space: nowrap; }
.donut-legend small { color: var(--text-secondary); font-size: .68rem; font-weight: 500; }
.chart-empty { grid-column: 1 / -1; padding: 12px; color: var(--text-secondary); font-size: .85rem; text-align: center; }
@media (max-width: 480px) { .donut-chart { grid-template-columns: 1fr; } .donut-chart svg { max-width: 145px; } }
</style>
