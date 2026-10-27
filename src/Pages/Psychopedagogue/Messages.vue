<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import ChatPanel from '@/Components/ChatPanel.vue';
import { Head } from '@/demo/navigation.js';

defineProps({
    conversations: { type: Array, default: () => [] },
    chatMessages: { type: Array, default: () => [] },
    selectedContactId: { type: Number, default: null },
});
</script>

<template>
    <DashboardLayout role="psychopedagogue">
        <Head title="Mensagens - EducAdapta" />

        <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem;">
            <i class="fas fa-envelope" style="color: var(--accent-blue);"></i> Mensagens
        </h1>

        <ChatPanel
            :conversations="conversations"
            :chatMessages="chatMessages"
            :selectedContactId="selectedContactId"
            sendRoute="psychopedagogue.messages.send"
            messagesRoute="psychopedagogue.messages"
        />
    </DashboardLayout>
</template>
