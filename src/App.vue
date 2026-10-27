<script setup>
import { computed } from 'vue';
import { view, usePage, Link, resetDemo, navigate } from './demo/navigation.js';
import { roles } from './demo/data.js';
const page = usePage();
const pages = import.meta.glob('./Pages/**/*.vue', { eager: true, import: 'default' });
const currentPage = computed(() => pages[`./Pages/${page.component}.vue`]);
const currentProps = computed(() => Object.fromEntries(Object.entries(page.props).filter(([key]) => key in (currentPage.value?.props || {}))));
const activeRole = computed(() => roles.find(r => view.url.startsWith(`/${r.id}/`)));
const selectProfile = event => {
    const id = event.target.value;
    if (id) navigate(`/${id}/dashboard`);
};
</script>

<template>
    <div class="demo-toolbar">
        <Link href="/demo" class="demo-brand">EducAdapta <span>Demonstração</span></Link>
        <p>Dados fictícios · alterações só neste navegador</p>
        <div class="demo-tools">
            <label class="sr-only" for="demo-role">Explorar perfil</label>
            <select id="demo-role" :value="activeRole?.id || ''" @change="selectProfile">
                <option value="" disabled>Explorar perfil</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
            </select>
            <button type="button" @click="resetDemo" title="Restaurar os dados fictícios iniciais">Reiniciar demo</button>
        </div>
    </div>
    <div v-if="view.notice" class="demo-notice" role="status">
        <span>{{ view.notice }}</span>
        <button type="button" aria-label="Fechar aviso" @click="view.notice = ''">×</button>
    </div>
    <p v-if="!view.persistence" class="demo-storage-warning">O navegador bloqueou o armazenamento. As alterações duram até recarregar a página.</p>
    <component :is="currentPage" :key="view.url" v-bind="currentProps" />
</template>
