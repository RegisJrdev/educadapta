import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialData, buildPageProps, areas } from '../src/demo/data.js';
import { applyAction, previewAdaptation, DemoValidationError } from '../src/demo/actions.js';
import { roles } from '../src/demo/data.js';
import { routePath, pageRoutes, resolvePage } from '../src/demo/routes.js';

test('todos os perfis recebem dados coerentes nas páginas extraídas', () => {
    const db = createInitialData();
    for (const role of roles) {
        const url = new URL(`https://demo.test/${role.id}/dashboard`);
        const props = buildPageProps(db, role.id, 'dashboard', url);
        assert.equal(props.auth.user.role, role.id);
        assert.equal(props.totalStudents, db.students.length);
        assert.equal(props.totalAdapted, db.adapted.length);
        assert.ok(props.upcomingSessions.length);
    }
    for (const [path, page] of Object.entries(pageRoutes)) assert.equal(resolvePage(path), page);
    assert.equal(routePath('teacher.screenings.create', 2), '/teacher/screenings/create/2');
    assert.equal(routePath('teacher.messages', { contact: 2 }), '/teacher/messages?contact=2');
    assert.equal(resolvePage('/rota-inexistente'), 'Demo/NotFound');
});

test('adaptação validada aparece para o professor e o aluno e concede XP uma vez', () => {
    const db = createInitialData();
    const data = { title: 'Teste de leitura', subject: 'Português', content: 'Leia uma frase.', student_ids: [1, 2] };
    assert.throws(() => previewAdaptation(db, { ...data, student_ids: [] }), DemoValidationError);
    const count = db.adapted.length;
    const result = applyAction(db, '/teacher/adapt/confirm', data, db.users[0]);
    assert.equal(result.redirect, '/teacher/activities');
    assert.equal(db.adapted.length, count + 2);
    const activity = db.adapted.find(a => a.activity_id === db.activities[0].id && a.student_id === 1);
    assert.match(activity.adapted_content, /SIMULAÇÃO/);
    const xp = db.students[0].xp;
    for (let i = 0; i < 2; i++) applyAction(db, `/student/activities/${activity.id}/complete`, {}, db.users[1]);
    assert.equal(db.students[0].xp, xp + 50);
    const props = buildPageProps(db, 'student', 'activities', new URL('https://demo.test/student/activities'));
    assert.ok(props.activities.data.find(a => a.id === activity.id).completed_by_student);
});

test('PDF é apresentado como exemplo sem fingir extrair o conteúdo', () => {
    const db = createInitialData();
    const preview = previewAdaptation(db, { title: 'PDF', file: { name: 'exemplo.pdf' }, student_ids: [1] });
    assert.match(preview.conteudo, /PDF não é processado/);
    assert.throws(() => previewAdaptation(db, { title: 'PDF', file: { name: 'exemplo.exe' }, student_ids: [1] }), DemoValidationError);
});

test('mensagem fica apenas na conversa dos participantes', () => {
    const db = createInitialData();
    applyAction(db, '/teacher/messages', { receiver_id: 2, content: 'Mensagem local.' }, db.users[0]);
    const props = buildPageProps(db, 'student', 'messages', new URL('https://demo.test/student/messages?contact=1'));
    assert.equal(props.chatMessages.at(-1).content, 'Mensagem local.');
    const other = buildPageProps(db, 'psychologist', 'messages', new URL('https://demo.test/psychologist/messages?contact=1'));
    assert.ok(!other.chatMessages.some(m => m.content === 'Mensagem local.'));
});

test('triagem exige respostas completas e atualiza os indicadores institucionais', () => {
    const db = createInitialData();
    assert.throws(() => applyAction(db, '/teacher/screenings', { student_id: 1, answers: {} }, db.users[0]), DemoValidationError);
    applyAction(db, '/teacher/screenings', { student_id: 1, answers: Object.fromEntries(areas.map(a => [a, [3, 3, 3, 3, 3]])), observations: 'Teste' }, db.users[0]);
    assert.equal(db.screenings[0].score_geral, 100);
    const props = buildPageProps(db, 'institution', 'screenings', new URL('https://demo.test/institution/screenings'));
    assert.equal(props.riskCounts.alto, 2);
    assert.equal(props.totalScreenings, 5);
});

test('sessões, planos e perfis de adaptação atualizam a demonstração', () => {
    const db = createInitialData();
    applyAction(db, '/psychologist/sessions', { student_id: '1', scheduled_at: '2026-12-01T10:00', focus: 'Leitura', notes: '' }, db.users[2]);
    assert.equal(db.sessions.length, 4);
    applyAction(db, '/psychopedagogue/plans', { student_id: '1', title: 'Novo plano', goals: 'Ler', strategies: 'Etapas', start_date: '2026-11-01' }, db.users[3]);
    assert.equal(db.plans.length, 2);
    applyAction(db, '/psychopedagogue/train-ai', { student_id: 1, disorders: ['Dislexia'], complexity_level: 'baixo', sensory_preference: 'visual', rules: [] }, db.users[3]);
    assert.equal(db.students[0].ai_profile.complexity_level, 'baixo');
    assert.doesNotThrow(() => JSON.stringify(db));
});
