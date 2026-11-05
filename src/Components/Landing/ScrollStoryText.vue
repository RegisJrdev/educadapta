<script setup>
import { motion, useTransform } from 'motion-v';

const { text, progress, start, end, enabled } = defineProps({
    text: { type: String, required: true },
    progress: { type: Object, required: true },
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    enabled: Boolean,
});
const MotionSpan = motion.span;
const parts = text.split(' ');
const words = parts.map((word, index) => ({
    text: word,
    opacity: useTransform(progress, [start + index / parts.length * (end - start), start + (index + 1) / parts.length * (end - start)], [.22, 1]),
}));
</script>

<template>
    <p class="edu-story-writing">
        <span class="edu-sr-only">{{ text }}</span>
        <span aria-hidden="true"><MotionSpan v-for="(word, index) in words" :key="index" :style="enabled ? { opacity: word.opacity } : { opacity: 1 }">{{ word.text }}{{ index < words.length - 1 ? ' ' : '' }}</MotionSpan></span>
    </p>
</template>
