// Compatibilidade local com os componentes Vue extraídos do Inertia.
// Não envia requisições ao Laravel e não simula autenticação real.
import { reactive, defineComponent, h, watchEffect } from 'vue';
import { createInitialData, buildPageProps } from './data.js';
import { applyAction, previewAdaptation } from './actions.js';
import { resolvePage, routePath } from './routes.js';

const storageKey = 'educadapta-demo-v1';
function restore() {
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey));
        if (saved && ['users', 'students', 'activities', 'adapted', 'sessions', 'screenings', 'classRooms', 'plans', 'achievements', 'messages'].every(key => Array.isArray(saved[key]))) return saved;
    } catch { /* Navegadores que bloqueiam storage continuam em memória. */ }
    return createInitialData();
}
export const db = reactive(restore());
export const view = reactive({ url: location.pathname + location.search, revision: 0, notice: '', persistence: true });
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
export function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify(db)); }
    catch { view.persistence = false; }
    view.revision++;
}
export function resetDemo() {
    Object.assign(db, createInitialData());
    persist();
    view.notice = 'Demonstração reiniciada com os dados de exemplo.';
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
    try {
        const path = new URL(href, location.origin).pathname;
        if (path === '/demo') { navigate('/demo'); options.onSuccess?.(); return; }
        const result = applyAction(db, path, data, page.props.auth.user);
        persist(); refresh();
        if (result.redirect) navigate(result.redirect);
        page.props.flash = { success: result.message };
        view.notice = result.message;
        options.onSuccess?.();
        return true;
    } catch (error) {
        view.notice = error.message;
        options.onError?.(error.errors || { form: error.message });
        return false;
    } finally { options.onFinish?.(); }
}
export function useForm(initial) {
    const defaults = structuredClone(initial);
    const form = reactive({
        ...structuredClone(defaults), errors: {}, processing: false, recentlySuccessful: false,
        reset(...keys) { for (const key of keys.length ? keys : Object.keys(defaults)) form[key] = structuredClone(defaults[key]); },
        clearErrors() { form.errors = {}; },
        post(href, options = {}) {
            form.processing = true; form.errors = {}; form.recentlySuccessful = false;
            const data = Object.fromEntries(Object.keys(defaults).map(key => [key, form[key]]));
            const ok = submit(href, data, { ...options, onError(errors) { form.errors = errors; options.onError?.(errors); } });
            form.processing = false; form.recentlySuccessful = ok;
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
                if (props.method.toLowerCase() === 'get') navigate(props.href);
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
