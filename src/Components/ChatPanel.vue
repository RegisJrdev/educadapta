<script setup>
import { useForm, router, usePage } from '@/demo/navigation.js';
import { ref, computed, nextTick, watch } from 'vue';

const props = defineProps({
    conversations: { type: Array, default: () => [] },
    chatMessages: { type: Array, default: () => [] },
    selectedContactId: { type: Number, default: null },
    sendRoute: { type: String, required: true },
    messagesRoute: { type: String, required: true },
});

const page = usePage();
const selectedContact = ref(props.selectedContactId);
const messagesEnd = ref(null);

const form = useForm({
    receiver_id: props.selectedContactId,
    content: '',
});

const selectContact = (contactId) => {
    router.get(route(props.messagesRoute, { contact: contactId }), {}, { preserveState: true });
};

const send = () => {
    if (!form.content.trim()) return;
    form.receiver_id = props.selectedContactId;
    form.post(route(props.sendRoute), {
        preserveScroll: true,
        onSuccess: () => {
            form.content = '';
        },
    });
};

const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

const roleLabel = (role) => {
    const map = { student: 'Aluno', teacher: 'Professor', psychologist: 'Psicólogo', psychopedagogue: 'Psicopedagoga', institution: 'Instituição' };
    return map[role] || role;
};
</script>

<template>
    <div class="chat-layout" style="display: grid; grid-template-columns: 300px 1fr; gap: 0; height: calc(100vh - 120px); border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border);">
        <!-- Contacts List -->
        <div style="background: var(--surface); border-right: 1px solid var(--border); overflow-y: auto;">
            <div style="padding: 1rem; border-bottom: 1px solid var(--border);">
                <h3 style="font-size: 1rem; font-weight: 700;"><i class="fas fa-comments" style="color: var(--accent-blue);"></i> Mensagens</h3>
            </div>
            <button v-for="c in conversations" :key="c.contact.id" type="button" :aria-pressed="selectedContactId === c.contact.id"
                @click="selectContact(c.contact.id)"
                style="width: 100%; color: var(--text-primary); font: inherit; text-align: left; padding: 0.75rem 1rem; cursor: pointer; transition: all 0.2s; border: 0; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 0.75rem;"
                :style="{ background: selectedContactId === c.contact.id ? 'var(--bg-secondary)' : 'transparent', borderLeft: selectedContactId === c.contact.id ? '3px solid var(--accent-blue)' : '3px solid transparent' }">
                <div style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; flex-shrink: 0;"
                    :style="{ background: selectedContactId === c.contact.id ? 'var(--primary)' : 'var(--accent-purple-solid)' }">
                    {{ c.contact.name?.charAt(0)?.toUpperCase() }}
                </div>
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <p style="font-weight: 600; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ c.contact.name }}</p>
                        <span v-if="c.unread" style="background: var(--accent-red-solid); color: white; font-size: 0.6rem; padding: 0.15rem 0.4rem; border-radius: 999px; font-weight: 700;">{{ c.unread }}</span>
                    </div>
                    <p style="font-size: 0.7rem; color: var(--text-secondary);">{{ roleLabel(c.contact.role) }}</p>
                    <p v-if="selectedContactId === c.contact.id" style="font-size: 0.7rem; font-weight: 700; color: var(--accent-blue);">Conversa selecionada</p>
                    <p v-if="c.lastMessage" style="font-size: 0.75rem; color: var(--text-light); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 0.15rem;">
                        {{ c.lastMessage.content?.substring(0, 40) }}{{ c.lastMessage.content?.length > 40 ? '...' : '' }}
                    </p>
                </div>
            </button>
            <div v-if="!conversations?.length" style="padding: 2rem; text-align: center; color: var(--text-secondary);">
                <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                <p style="font-size: 0.85rem;">Nenhum contato disponível</p>
            </div>
        </div>

        <!-- Chat Area -->
        <div style="display: flex; flex-direction: column; min-width: 0; background: var(--bg-card);">
            <template v-if="selectedContactId">
                <!-- Chat Header -->
                <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 36px; height: 36px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem;">
                        {{ conversations.find(c => c.contact.id === selectedContactId)?.contact?.name?.charAt(0)?.toUpperCase() }}
                    </div>
                    <div>
                        <p style="font-weight: 600; font-size: 0.9rem;">{{ conversations.find(c => c.contact.id === selectedContactId)?.contact?.name }}</p>
                        <p style="font-size: 0.7rem; color: var(--text-secondary);">{{ roleLabel(conversations.find(c => c.contact.id === selectedContactId)?.contact?.role) }}</p>
                    </div>
                </div>

                <!-- Messages -->
                <div style="flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
                    <div v-if="!chatMessages?.length" style="flex: 1; display: flex; align-items: center; justify-content: center; color: var(--text-secondary);">
                        <p style="font-size: 0.85rem;">Nenhuma mensagem ainda. Inicie a conversa!</p>
                    </div>
                    <div v-for="msg in chatMessages" :key="msg.id"
                        style="max-width: 70%; padding: 0.6rem 0.9rem; border-radius: 1rem; font-size: 0.85rem; line-height: 1.4;"
                        :style="{
                            alignSelf: msg.sender_id === page.props.auth.user.id ? 'flex-end' : 'flex-start',
                            background: msg.sender_id === page.props.auth.user.id ? 'var(--primary)' : 'var(--bg-secondary)',
                            color: msg.sender_id === page.props.auth.user.id ? 'white' : 'var(--text-primary)',
                            borderBottomRightRadius: msg.sender_id === page.props.auth.user.id ? '0.25rem' : '1rem',
                            borderBottomLeftRadius: msg.sender_id !== page.props.auth.user.id ? '0.25rem' : '1rem',
                        }">
                        {{ msg.content }}
                        <div style="font-size: 0.6rem; margin-top: 0.2rem; text-align: right;">
                            {{ formatTime(msg.created_at) }}
                        </div>
                    </div>
                    <div ref="messagesEnd"></div>
                </div>

                <!-- Input -->
                <form @submit.prevent="send" style="padding: 0.75rem 1rem; border-top: 1px solid var(--border); display: flex; gap: 0.5rem;">
                    <input v-model="form.content" type="text" class="form-input" aria-label="Mensagem" placeholder="Digite uma mensagem..."
                        style="flex: 1; border-radius: 999px; padding: 0.5rem 1rem; font-size: 0.85rem;" />
                    <button type="submit" class="btn btn-primary" aria-label="Enviar mensagem" :disabled="form.processing || !form.content.trim()"
                        style="border-radius: 50%; width: 40px; height: 40px; padding: 0; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </form>
            </template>

            <div v-else style="flex: 1; display: flex; align-items: center; justify-content: center; text-align: center; padding: 2rem;">
                <div>
                    <i class="fas fa-comment-dots" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                    <p style="color: var(--text-secondary); font-size: 0.95rem;">Selecione uma conversa para começar</p>
                </div>
            </div>
        </div>
    </div>
</template>
