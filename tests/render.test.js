import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createSSRApp, createRenderer, h, ssrContextKey } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { pageRoutes } from '../src/demo/routes.js';

test('todas as telas Vue renderizam com os dados estáticos, sem Laravel', async () => {
    globalThis.location = new URL('http://localhost/');
    globalThis.history = { pushState() {}, replaceState() {} };
    globalThis.window = { addEventListener() {}, scrollTo() {} };
    globalThis.document = { title: '' };
    globalThis.localStorage = { getItem: () => null, setItem() {} };
    const server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: 'custom' });
    try {
        const navigation = await server.ssrLoadModule('/src/demo/navigation.js');
        const { default: App } = await server.ssrLoadModule('/src/App.vue');
        globalThis.route = navigation.route;
        for (const path of [...Object.keys(pageRoutes), '/teacher/screenings/create/1', '/teacher/messages?contact=2', '/pagina-inexistente']) {
            navigation.navigate(path);
            const app = createSSRApp({ render: () => h(App) });
            app.config.globalProperties.route = navigation.route;
            const warnings = [];
            app.config.warnHandler = message => warnings.push(message);
            const html = await renderToString(app);
            assert.match(html, /aria-label="Ativar tema claro"/, path);
            if (path === '/pagina-inexistente') {
                assert.match(html, /Página não encontrada/);
                assert.match(html, /Explorar perfis/);
            } else {
                assert.ok(html.includes('EducAdapta'), path);
                assert.ok(html.length > 500, path);
                if (path.endsWith('/dashboard')) assert.match(html, /role="img"/, `${path} deve exibir gráficos acessíveis`);
            }
            assert.deepEqual(warnings, [], `${path}: ${warnings.join('; ')}`);
        }
    } finally { await server.close(); }
});

test('tema escolhido é aplicado, salvo e restaurado ao montar novamente', async () => {
    const storage = new Map([['educadapta-theme', 'light']]);
    globalThis.location = new URL('http://localhost/');
    globalThis.history = { pushState() {}, replaceState() {} };
    globalThis.window = { addEventListener() {}, scrollTo() {} };
    globalThis.document = { title: '', documentElement: { dataset: {} } };
    globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
    const server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: 'custom' });
    try {
        const { default: App } = await server.ssrLoadModule('/src/App.vue');
        const { default: ThemeToggle } = await server.ssrLoadModule('/src/Components/ThemeToggle.vue');
        let controls;
        const Probe = { setup(props, context) { controls = ThemeToggle.setup(props, context); return () => null; } };
        const Host = { setup(props, context) { App.setup(props, context); return () => h(Probe); } };
        const renderer = createRenderer({
            createElement: () => ({}), createText: text => ({ text }), createComment: text => ({ text }),
            setText: (node, text) => { node.text = text; }, setElementText: (node, text) => { node.text = text; },
            insert: (node, parent) => { node.parent = parent; }, remove: () => {},
            parentNode: node => node.parent, nextSibling: () => null, patchProp: () => {},
        });
        const mount = () => {
            const app = renderer.createApp(Host);
            app.provide(ssrContextKey, { modules: new Set() });
            app.mount({});
            return app;
        };
        const first = mount();
        assert.equal(document.documentElement.dataset.theme, 'light');
        controls.toggleTheme();
        assert.equal(document.documentElement.dataset.theme, 'dark');
        assert.equal(storage.get('educadapta-theme'), 'dark');
        first.unmount();
        const second = mount();
        assert.equal(document.documentElement.dataset.theme, 'dark');
        assert.equal(controls.theme.value, 'dark');
        second.unmount();
    } finally { await server.close(); }
});
