<script setup>
import { Primitive } from 'reka-ui';

defineProps({
    as: { type: [String, Object], default: 'button' },
    asChild: { type: Boolean, default: false },
    type: { type: String, default: 'button' },
    variant: { type: String, default: 'primary' },
    size: { type: String, default: 'default' },
});
</script>

<template>
    <Primitive :as="as" :as-child="asChild" :type="!asChild && as === 'button' ? type : undefined" :class="['ui-button', `ui-button-${variant}`, `ui-button-${size}`]">
        <slot />
    </Primitive>
</template>

<style scoped>
.ui-button { display: inline-flex; align-items: center; justify-content: center; gap: .55rem; min-height: 40px; border: 1px solid transparent; border-radius: 9px; padding: .68rem 1rem; color: var(--text-white); font: inherit; font-size: .84rem; font-weight: 650; line-height: 1.1; text-decoration: none; cursor: pointer; transition: background-color .16s ease, border-color .16s ease, color .16s ease, transform .16s ease; }
.ui-button:not(:disabled):hover { transform: translateY(-1px); }
.ui-button-primary { background: var(--primary); }
.ui-button-primary:not(:disabled):hover { background: var(--primary-light); }
.ui-button-outline { border-color: var(--input-border); background: transparent; color: var(--text-primary); }
.ui-button-outline:not(:disabled):hover { border-color: var(--accent-pink); background: color-mix(in srgb, var(--accent-pink) 10%, var(--bg-card)); }
.ui-button-ghost { background: transparent; color: var(--text-primary); }
.ui-button-ghost:not(:disabled):hover { background: var(--bg-secondary); }
.ui-button-sm { min-height: 36px; padding: .5rem .75rem; font-size: .78rem; }
.ui-button:disabled { opacity: .6; cursor: not-allowed; }
.ui-button:focus-visible { outline: 3px solid var(--link); outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { .ui-button { transition: none; } .ui-button:not(:disabled):hover { transform: none; } }
</style>
