import { isDemoState, stateKeys } from './validation.js';
// Compatibilidade local com os componentes Vue extraídos do Inertia.
import { reactive, defineComponent, h, watchEffect } from 'vue';
import { createInitialData, buildPageProps } from './data.js';
import { applyAction, previewAdaptation } from './actions.js';
import { resolvePage, routePath } from './routes.js';

const storageKey = 'educadapta-demo-v1';
function restore() {
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey));
        if (isDemoState(saved)) return saved;
    } catch { /* Navegadores que bloqueiam storage continuam em memória. */ }
    return createInitialData();
}

const snapshotState = () => JSON.parse(JSON.stringify(db));
export const db = reactive(restore());
export const view = reactive({ url: location.pathname + location.search, revision: 0, notice: '', persistence: true, backend: false, ready: false });
let serverRevision = 0;
let mutationQueue = Promise.resolve();
const page = reactive({ props: {}, component: '' });
function refresh() {
    const url = new URL(view.url, location.origin);
    const [, role, ...parts] = url.pathname.split('/');
    page.props = buildPageProps(db, role, parts.join('/'), url);
    page.component = resolvePage(url.pathname);
}
refresh();
watchEffect(() => { view.url; view.revision; refresh(); });
export const usePage = () => page;
function replaceState(state) {
    for (const key of stateKeys) db[key] = structuredClone(state[key]);
    view.revision++;
    refresh();
}
function persistLocal() {
    try { localStorage.setItem(storageKey, JSON.stringify(db)); }
    catch { view.persistence = false; }
}
async function readRemoteState() {
    const response = await fetch('/api/state', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Não foi possível carregar os dados compartilhados.');
    const result = await response.json();
    if (!Number.isSafeInteger(result.revision) || result.revision < 0 || (result.state !== null && !isDemoState(result.state))) throw new Error('O backend retornou dados inválidos.');
    serverRevision = result.revision;
    return result.state;
}
async function writeRemoteState(state, revision) {
    const response = await fetch('/api/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ state, revision }),
    });
    const result = await response.json();
    if (response.status === 409 && Number.isSafeInteger(result.revision) && (result.state === null || isDemoState(result.state))) {
        serverRevision = result.revision;
        return { conflict: true, state: result.state };
    }
    if (!response.ok || !Number.isSafeInteger(result.revision)) throw new Error(result.message || 'Não foi possível salvar no SQLite.');
    serverRevision = result.revision;
    return { conflict: false };
}
export async function initializeDemo() {
    try {
        const state = await readRemoteState();
        view.backend = true;
        if (state) replaceState(state);
        else {
            const result = await writeRemoteState(snapshotState(), serverRevision);
            if (result.conflict) replaceState(result.state || await readRemoteState());
        }
    } catch (error) {
        view.backend = false;
        view.notice = `Backend PHP/SQLite indisponível; esta sessão está em modo local. ${error.message}`;
    } finally {
        view.ready = true;
    }
}
export function resetDemo() {
    if (!window.confirm(view.backend
        ? 'Isso restaura os dados compartilhados e apaga as alterações feitas por todas as pessoas nesta demonstração. Continuar?'
        : 'Restaurar os dados de exemplo neste navegador?')) return;
    const operation = async () => {
        const initial = createInitialData();
        if (!view.backend) {
            replaceState(initial);
            persistLocal();
            view.notice = view.persistence ? 'Demonstração reiniciada com os dados de exemplo.' : 'Dados reiniciados nesta sessão; o navegador não permite armazenamento local.';
            return;
        }
        try {
            const result = await writeRemoteState(initial, serverRevision);
            if (result.conflict) {
                replaceState(result.state || await readRemoteState());
                view.notice = 'Não reiniciei: outra pessoa atualizou a demonstração. Tente novamente.';
                return;
            }
            replaceState(initial);
            view.notice = 'Demonstração compartilhada reiniciada com os dados de exemplo.';
        } catch {
            view.notice = 'Não foi possível reiniciar os dados compartilhados. Tente novamente.';
        }
    };
    const pending = mutationQueue.then(operation);
    mutationQueue = pending.catch(() => {});
    return pending;
}
export function navigate(href, options = {}) {
    const url = new URL(href, location.origin);
    if (url.origin !== location.origin) { location.href = url.href; return; }
    history[options.replace ? 'replaceState' : 'pushState']({}, '', url.pathname + url.search + url.hash);
    view.url = url.pathname + url.search;
    refresh();
    if (!options.preserveScroll) window.scrollTo(0, 0);
}
window.addEventListener('popstate', () => { view.url = location.pathname + location.search; refresh(); });
export function route(name, params) {
    if (!name) return { current: pattern => {
        const path = new URL(view.url, location.origin).pathname;
        if (pattern?.endsWith('*')) return path.startsWith('/' + pattern.slice(0, -1).replaceAll('.', '/'));
        try { return routePath(pattern).split('?')[0] === path; } catch { return false; }
    } };
    return routePath(name, params);
}
export const router = {
    get(href, data = {}, options = {}) {
        const url = new URL(href, location.origin);
        for (const [key, value] of Object.entries(data)) url.searchParams.set(key, value);
        navigate(url.href, options);
    },
    post(href, data = {}, options = {}) { return submit(href, data, options); },
    visit: navigate,
};
function submit(href, data, options = {}) {
    const actor = page.props.auth.user;
    const operation = async () => {
        const before = snapshotState();
        try {
            const path = new URL(href, location.origin).pathname;
            if (path === '/demo') { navigate('/demo'); options.onSuccess?.(); return; }
            let result;
            if (!view.backend) {
                result = applyAction(db, path, data, actor);
                persistLocal();
            } else {
                result = applyAction(db, path, data, actor);
                const saved = await writeRemoteState(snapshotState(), serverRevision);
                if (saved.conflict) {
                    replaceState(saved.state || await readRemoteState());
                    result = applyAction(db, path, data, actor);
                    const retry = await writeRemoteState(snapshotState(), serverRevision);
                    if (retry.conflict) {
                        replaceState(retry.state || await readRemoteState());
                        throw new Error('Outra pessoa atualizou os dados. Sua ação não foi salva; tente novamente.');
                    }
                }
            }
            refresh();
            if (result.redirect) navigate(result.redirect);
            page.props.flash = { success: result.message };
            view.notice = result.message;
            options.onSuccess?.();
            return true;
        } catch (error) {
            if (view.backend) {
                try {
                    const state = await readRemoteState();
                    replaceState(state || before);
                } catch {
                    replaceState(before);
                    view.backend = false;
                    persistLocal();
                }
            }
            view.notice = error.message;
            options.onError?.(error.errors || { form: error.message });
            return false;
        } finally { options.onFinish?.(); }
    };
    const pending = mutationQueue.then(operation);
    mutationQueue = pending.catch(() => {});
    return pending;
}
export function useForm(initial) {
    const defaults = structuredClone(initial);
    const form = reactive({
        ...structuredClone(defaults), errors: {}, processing: false, recentlySuccessful: false,
        reset(...keys) { for (const key of keys.length ? keys : Object.keys(defaults)) form[key] = structuredClone(defaults[key]); },
        clearErrors() { form.errors = {}; },
        async post(href, options = {}) {
            form.processing = true; form.errors = {}; form.recentlySuccessful = false;
            const data = Object.fromEntries(Object.keys(defaults).map(key => [key, form[key]]));
            try {
                const ok = await submit(href, data, { ...options, onError(errors) { form.errors = errors; options.onError?.(errors); } });
                form.recentlySuccessful = ok;
            } finally { form.processing = false; }
        },
    });
    return form;
}
export const Link = defineComponent({
    inheritAttrs: false,
    props: { href: { type: String, default: '/' }, method: { type: String, default: 'get' }, as: { type: String, default: 'a' } },
    setup(props, { attrs, slots }) {
        return () => h(props.as, {
            ...attrs, ...(props.as === 'a' ? { href: props.href } : { type: 'button' }),
            onClick(event) {
                if (props.method === 'get' && (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0 || attrs.target === '_blank')) return;
                event.preventDefault();
                if (props.method.toLowerCase() === 'get' && location.pathname === '/' && new URL(props.href, location.origin).pathname !== '/') location.href = props.href;
                else if (props.method.toLowerCase() === 'get') navigate(props.href);
                else submit(props.href, {});
                attrs.onClick?.(event);
            },
        }, slots.default?.());
    },
});
export const Head = defineComponent({
    props: { title: String },
    setup(props) { watchEffect(() => { document.title = `${props.title || 'EducAdapta'} · Demonstração`; }); return () => null; },
});

// Chamado explicitamente pela tela de adaptação; não intercepta o fetch do navegador.
export async function demoRequest(href, options = {}) {
    const path = new URL(href, location.origin).pathname;
    if (path.endsWith('/health')) return { ok: true, json: async () => ({ ok: true, mensagem: 'Modo demonstrativo: exemplo local, sem conexão com IA.' }) };
    if (path.endsWith('/preview')) {
        const form = options.body;
        const data = { title: form.get('title'), subject: form.get('subject'), content: form.get('content'), file: form.get('file'), student_ids: [...form.entries()].filter(([key]) => key.startsWith('student_ids[')).map(([, value]) => Number(value)) };
        try { const preview = previewAdaptation(db, data); return { ok: true, json: async () => preview }; }
        catch (error) { return { ok: false, json: async () => ({ errors: error.errors, message: error.message }) }; }
    }
    throw new Error('Operação de demonstração não encontrada.');
}
