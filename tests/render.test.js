import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createSSRApp, h } from 'vue';
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
            assert.ok(html.includes('EducAdapta'), path);
            assert.ok(html.length > 500, path);
            assert.deepEqual(warnings, [], `${path}: ${warnings.join('; ')}`);
        }
    } finally { await server.close(); }
});
