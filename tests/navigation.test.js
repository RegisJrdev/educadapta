import test from 'node:test';
import assert from 'node:assert/strict';

test('estado SQLite é compartilhado e uma gravação concorrente reaplica a ação sem perder dados', async () => {
    let saved = { state: null, revision: 0 };
    let causeConflict = false;
    globalThis.location = new URL('https://demo.test/demo');
    globalThis.history = { pushState() {}, replaceState() {} };
    globalThis.window = { addEventListener() {}, scrollTo() {}, confirm: () => true };
    globalThis.document = { title: '', createElement: () => ({}) };
    globalThis.localStorage = { getItem: () => null, setItem() {} };
    globalThis.fetch = async (_url, options = {}) => {
        if (!options.method) return Response.json(saved);
        const request = JSON.parse(options.body);
        if (causeConflict) {
            causeConflict = false;
            const external = structuredClone(saved.state);
            external.messages.push({ id: 100, sender_id: 1, receiver_id: 2, content: 'Outra sessão', created_at: new Date().toISOString() });
            saved = { state: external, revision: saved.revision + 1 };
            return Response.json(saved, { status: 409 });
        }
        if (request.revision !== saved.revision) return Response.json(saved, { status: 409 });
        saved = { state: request.state, revision: saved.revision + 1 };
        return Response.json(saved);
    };

    const navigation = await import('../src/demo/navigation.js');
    await navigation.initializeDemo();
    assert.equal(navigation.view.backend, true, navigation.view.notice);
    assert.equal(saved.revision, 1);

    navigation.navigate('/teacher/messages');
    causeConflict = true;
    await navigation.router.post('/teacher/messages', { receiver_id: 2, content: 'Minha mensagem' });
    assert.equal(saved.state.messages.filter(message => message.content === 'Outra sessão').length, 1);
    assert.equal(saved.state.messages.filter(message => message.content === 'Minha mensagem').length, 1);

    await Promise.all([
        navigation.router.post('/teacher/messages', { receiver_id: 2, content: 'Primeira ação' }),
        navigation.router.post('/teacher/messages', { receiver_id: 2, content: 'Segunda ação' }),
    ]);
    for (const content of ['Primeira ação', 'Segunda ação']) {
        assert.equal(saved.state.messages.filter(message => message.content === content).length, 1);
    }
});
