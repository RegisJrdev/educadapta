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
        navigation.view.ready = true;
        navigation.view.backend = false;
        navigation.view.notice = 'Aviso de armazenamento da demonstração';
        for (const path of [...Object.keys(pageRoutes), '/teacher/screenings/create/1', '/teacher/messages?contact=2', '/pagina-inexistente']) {
            navigation.navigate(path);
            const app = createSSRApp({ render: () => h(App) });
            app.config.globalProperties.route = navigation.route;
            const warnings = [];
            app.config.warnHandler = message => warnings.push(message);
            const html = await renderToString(app);
            assert.match(html, /aria-label="Ativar tema claro"/, path);
            if (path === '/') {
                assert.doesNotMatch(html, /Aviso de armazenamento da demonstração|demo-storage-warning/);
                assert.match(html, /<a\b[^>]*href="\/demo"/);
                assert.match(html, /edu-scene-fallback/);
                const puzzle = html.match(/<div class="edu-scene-fallback">([\s\S]*?)<\/div>/)?.[1];
                assert.ok(puzzle, 'a alternativa estática do quebra-cabeça deve estar disponível sem WebGL');
                assert.match(puzzle, /viewBox="0 0 39 39"/);
                assert.equal((puzzle.match(/<path /g) || []).length, 4, 'as quatro peças também aparecem com movimento reduzido');
                for (const position of ['14.8 0', '0 14.8', '14.8 14.8']) {
                    assert.ok(puzzle.includes(`transform="translate(${position})"`), 'as peças ocupam duas linhas e duas colunas');
                }
                assert.match(html, /Diferentes caminhos\./);
                assert.match(html, /adaptação é simulada/);
                assert.match(html, /Leia: Ana tem 12 lápis\./);
                assert.match(html, /class="edu-header"/);
                assert.match(html, /<nav[^>]*id="landing-navigation"[^>]*inert/);
                assert.match(html, /class="edu-header-tools" inert/);
                const journey = html.match(/<section id="how-it-works"[\s\S]*?<\/section>/)?.[0];
                assert.ok(journey, 'a âncora Como funciona deve apontar para a jornada');
                for (const stage of ['Conhecer', 'Adaptar', 'Acompanhar']) assert.match(journey, new RegExp(`<h3>${stage}</h3>`));
                assert.doesNotMatch(journey, /is-scroll-story|aria-live=/, 'a jornada inicia legível sem depender de scroll ou anúncios contínuos');
            } else {
                assert.match(html, /Aviso de armazenamento da demonstração/);
                assert.doesNotMatch(html, /demo-storage-warning/);
            }
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

test('pílula expande no scroll e no foco, preserva o menu aberto e limpa o listener', async () => {
    const listeners = new Map();
    globalThis.window = {
        scrollY: 0,
        addEventListener: (event, handler) => listeners.set(event, handler),
        removeEventListener: (event, handler) => {
            assert.equal(listeners.get(event), handler);
            listeners.delete(event);
        },
    };
    const server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: 'custom' });
    let app;
    try {
        const { default: Header } = await server.ssrLoadModule('/src/Components/Landing/LandingHeader.vue');
        let controls;
        const Probe = { setup(props, context) { controls = Header.setup(props, context); return () => null; } };
        const renderer = createRenderer({
            createElement: () => ({}), createText: text => ({ text }), createComment: text => ({ text }),
            setText: (node, text) => { node.text = text; }, setElementText: (node, text) => { node.text = text; },
            insert: (node, parent) => { node.parent = parent; }, remove: () => {},
            parentNode: node => node.parent, nextSibling: () => null, patchProp: () => {},
        });
        const mount = () => {
            app = renderer.createApp(Probe);
            app.provide(ssrContextKey, { modules: new Set() });
            app.mount({});
        };
        const scroll = y => { window.scrollY = y; listeners.get('scroll')(); };
        mount();
        assert.equal(controls.expanded.value, false, 'abre compacta no topo');
        scroll(120);
        assert.equal(controls.expanded.value, true, 'rolagem abre a navegação');
        scroll(10);
        assert.equal(controls.expanded.value, true, 'a desaceleração perto do topo não causa oscilações');
        scroll(0);
        assert.equal(controls.expanded.value, false, 'retorno ao topo recolhe a pílula');

        const link = {};
        const header = { contains: element => element === link };
        controls.updateFocus({ currentTarget: header, relatedTarget: link });
        scroll(0);
        assert.equal(controls.expanded.value, true, 'foco dentro da barra mantém os controles acessíveis no topo');
        controls.updateFocus({ currentTarget: header, relatedTarget: null });
        assert.equal(controls.expanded.value, false);
        await controls.toggleMenu();
        assert.equal(controls.expanded.value, true, 'menu móvel aberto impede recolhimento');
        controls.closeOnEscape();
        assert.equal(controls.expanded.value, false);

        app.unmount();
        assert.equal(listeners.has('scroll'), false, 'sair da landing remove o listener de rolagem');
        window.scrollY = 300;
        mount();
        assert.equal(controls.expanded.value, true, 'restaurar a página já rolada expande a barra');
    } finally { app?.unmount(); await server.close(); }
});

test('texto guiado pelo scroll preserva leitura completa e revela palavras em ordem', async () => {
    const server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: 'custom' });
    try {
        const { default: StoryText } = await server.ssrLoadModule('/src/Components/Landing/ScrollStoryText.vue');
        const { useMotionValue } = await import('motion-v');
        const render = async (progress, enabled) => {
            const value = useMotionValue(progress);
            try {
                const html = await renderToString(createSSRApp({ render: () => h(StoryText, { text: 'Cada aluno aprende', progress: value, start: 0, end: 1, enabled }) }));
                assert.match(html, /<span class="edu-sr-only">Cada aluno aprende<\/span>/);
                assert.match(html, /aria-hidden="true"/);
                assert.doesNotMatch(html, /aria-live/);
                return [...html.matchAll(/style="opacity:([\d.]+);?"/g)].map(match => Number(match[1]));
            } finally { value.destroy(); }
        };
        assert.deepEqual(await render(0, false), [1, 1, 1], 'sem movimento, todas as palavras ficam legíveis');
        assert.deepEqual(await render(0, true), [.22, .22, .22]);
        const middle = await render(.5, true);
        assert.equal(middle[0], 1);
        assert.ok(middle[1] > .22 && middle[1] < 1);
        assert.equal(middle[2], .22);
        assert.deepEqual(await render(1, true), [1, 1, 1]);
        assert.deepEqual(await render(0, true), [.22, .22, .22], 'voltar no scroll restaura o início');
    } finally { await server.close(); }
});

test('painéis da jornada fazem transição contínua sem desaparecer entre etapas', async () => {
    const server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: 'custom' });
    try {
        const { default: JourneyVisual } = await server.ssrLoadModule('/src/Components/Landing/JourneyVisual.vue');
        const { useMotionValue } = await import('motion-v');
        const render = async progress => {
            const value = useMotionValue(progress);
            try {
                const html = await renderToString(createSSRApp({ render: () => h(JourneyVisual, { progress: value, active: Math.min(2, Math.floor(progress * 3)) }) }));
                return [...html.matchAll(/class="edu-story-illustration"[^>]*style="([^"]*)"/g)].map(match => Number(match[1].match(/opacity:([\d.]+)/)[1]));
            } finally { value.destroy(); }
        };
        assert.deepEqual(await render(0), [1, 0, 0]);
        for (const progress of [.29, .33, .37, .62, .66, .7]) {
            const opacity = await render(progress);
            assert.equal(opacity.length, 3);
            assert.ok(Math.abs(opacity.reduce((sum, value) => sum + value, 0) - 1) < .00001, 'o painel mantém conteúdo visível durante a troca');
        }
        const middle = await render(.33);
        assert.ok(middle[0] > 0 && middle[0] < 1 && middle[1] > 0 && middle[1] < 1, 'as duas etapas se sobrepõem suavemente');
        assert.deepEqual(await render(1), [0, 0, 1]);
        assert.deepEqual(await render(0), [1, 0, 0]);
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
