<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head } from '@/demo/navigation.js';

const props = defineProps({
    title: { type: String, default: 'Em breve' },
    role: { type: String, required: true },
    icon: { type: String, default: 'fas fa-tools' },
    description: { type: String, default: 'Esta funcionalidade está sendo desenvolvida.' },
});
</script>

<template>
    <DashboardLayout :role="role">
        <Head :title="title + ' - EducAdapta'" />
        <div style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
            <div class="card fade-in-up" style="text-align: center; padding: 3rem; max-width: 500px;">
                <i :class="icon" style="font-size: 4rem; color: var(--accent-blue); margin-bottom: 1.5rem; opacity: 0.5;"></i>
                <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">{{ title }}</h2>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">{{ description }}</p>
                <span class="badge badge-blue" style="font-size: 0.75rem;">🚧 Em desenvolvimento</span>
            </div>
        </div>
    </DashboardLayout>
</template>
