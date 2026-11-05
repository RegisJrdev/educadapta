import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialData, buildPageProps, appendInstitutionHistory, appendPsychologistSessions, summarizePsychologistSessions, areas } from '../src/demo/data.js';
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
        assert.equal(props.timelineLabels.length, props.activityTrend.length);
        assert.equal(props.timelineLabels.length, props.screeningTrend.length);
        assert.ok(props.timelineLabels.length > 0 && props.timelineLabels.length <= 7);
    }
    for (const [path, page] of Object.entries(pageRoutes)) assert.equal(resolvePage(path), page);
    assert.equal(routePath('teacher.screenings.create', 2), '/teacher/screenings/create/2');
    assert.equal(routePath('teacher.messages', { contact: 2 }), '/teacher/messages?contact=2');
    assert.equal(resolvePage('/rota-inexistente'), 'Demo/NotFound');
});

test('dados iniciais incluem mais alunos, atividades e conversas entre alunos', () => {
    const db = createInitialData();
    assert.equal(db.students.length, 10);
    assert.equal(db.activities.length, 28);
    assert.equal(db.users.filter(user => user.role === 'teacher').length, 4);
    assert.deepEqual(buildPageProps(db, 'institution', 'dashboard', new URL('https://demo.test/institution/dashboard')).topTeachers.map(teacher => teacher.total_activities), [10, 7, 6, 5]);
    assert.ok(db.messages.some(message => db.users.find(user => user.id === message.sender_id)?.role === 'student' && db.users.find(user => user.id === message.receiver_id)?.role === 'student'));
    const props = buildPageProps(db, 'institution', 'dashboard', new URL('https://demo.test/institution/dashboard'));
    assert.ok(new Set(props.activityTrend).size > 1);
    assert.ok(new Set(props.screeningTrend).size > 1);
});

test('painel docente conta apenas atividades, adaptações e triagens do professor autenticado', () => {
    const db = createInitialData();
    const props = buildPageProps(db, 'teacher', 'dashboard', new URL('https://demo.test/teacher/dashboard'));
    const teacherId = props.auth.user.id;
    const activities = db.activities.filter(item => item.teacher_id === teacherId);
    const ids = new Set(activities.map(item => item.id));
    const adaptations = db.adapted.filter(item => ids.has(item.activity_id));
    const screenings = db.screenings.filter(item => item.teacher_id === teacherId);
    assert.ok(activities.length < db.activities.length && screenings.length < db.screenings.length);
    assert.equal(props.teacherDashboard.totalActivities, activities.length);
    assert.equal(props.teacherDashboard.totalAdapted, adaptations.length);
    assert.equal(props.teacherDashboard.completedAdaptations, adaptations.filter(item => item.completed_by_student).length);
    assert.equal(props.teacherDashboard.totalScreenings, screenings.length);
    for (const risk of ['baixo', 'atencao', 'moderado', 'alto']) assert.equal(props.teacherDashboard.riskDistribution[risk], screenings.filter(item => item.risk_level === risk).length);
    assert.deepEqual(new Set(props.teacherDashboard.recentActivities.map(item => item.id)), ids);
    const institution = buildPageProps(db, 'institution', 'dashboard', new URL('https://demo.test/institution/dashboard'));
    assert.equal(institution.totalActivities, db.activities.length);
    assert.equal(institution.totalScreenings, db.screenings.length);
});

test('painel psicológico considera apenas sessões do profissional e agenda futura', () => {
    const db = createInitialData();
    db.sessions = [
        { id: 1, professional_id: 3, student_id: 1, status: 'agendada', scheduled_at: '2030-01-03T12:00:00Z', focus: 'Leitura' },
        { id: 2, professional_id: 3, student_id: 1, status: 'concluida', scheduled_at: '2029-12-30T12:00:00Z', focus: 'Leitura' },
        { id: 3, professional_id: 3, student_id: 2, status: 'cancelada', scheduled_at: '2030-01-02T12:00:00Z', focus: 'Rotina' },
        { id: 4, professional_id: 3, student_id: 2, status: 'agendada', scheduled_at: '2029-12-31T12:00:00Z', focus: 'Rotina' },
        { id: 5, professional_id: 3, student_id: 2, status: 'agendada', scheduled_at: '2030-01-02T12:00:00Z', focus: 'Rotina' },
        { id: 6, professional_id: 4, student_id: 3, status: 'agendada', scheduled_at: '2030-01-02T12:00:00Z', focus: 'Outro' },
    ];
    const props = buildPageProps(db, 'psychologist', 'dashboard', new URL('https://demo.test/psychologist/dashboard'));
    assert.deepEqual(props.psychologistSessions.map(item => item.id), [1, 2, 3, 4, 5]);
    const summary = summarizePsychologistSessions(props.psychologistSessions, new Date('2030-01-01T00:00:00Z'));
    assert.deepEqual(summary.upcoming.map(item => item.id), [5, 1]);
    assert.equal(summary.studentCount, 2);
    assert.deepEqual(summary.focuses, [{ label: 'Rotina', value: 3 }, { label: 'Leitura', value: 2 }]);
    assert.deepEqual(summary.statuses, [{ label: 'agendada', value: 3 }, { label: 'cancelada', value: 1 }, { label: 'concluida', value: 1 }]);
});

test('sessões fictícias são aditivas, ligadas a registros existentes e idempotentes', () => {
    const db = createInitialData();
    db.sessions = db.sessions.filter(session => !session.demo_sample_key);
    const original = structuredClone(db.sessions);
    assert.equal(appendPsychologistSessions(db), 12);
    assert.deepEqual(db.sessions.slice(0, original.length), original);
    assert.ok(db.sessions.slice(original.length).every(session => db.students.some(student => student.id === session.student_id) && db.users.some(user => user.id === session.professional_id && user.role === 'psychologist')));
    const after = structuredClone(db.sessions);
    assert.equal(appendPsychologistSessions(db), 0);
    assert.deepEqual(db.sessions, after);
});

test('histórico demonstrativo é aditivo e pode ser reaplicado sem duplicar dados', () => {
    const db = createInitialData();
    for (const key of ['activities', 'adapted', 'screenings']) db[key] = db[key].filter(item => !item.demo_sample_key);
    const before = structuredClone(db);
    assert.deepEqual(appendInstitutionHistory(db), { activities: 20, adapted: 20, screenings: 21 });
    for (const key of Object.keys(before)) assert.deepEqual(db[key].slice(0, before[key].length), before[key]);
    const after = structuredClone(db);
    assert.deepEqual(appendInstitutionHistory(db), { activities: 0, adapted: 0, screenings: 0 });
    assert.deepEqual(db, after);
});

test('histórico inclui dias sem registros sem inventar valores', () => {
    const db = createInitialData();
    db.activities = [{ ...db.activities[0], created_at: '2026-01-10T12:00:00.000Z' }];
    db.screenings = [{ ...db.screenings[0], created_at: '2026-01-04T12:00:00.000Z' }];
    const props = buildPageProps(db, 'institution', 'dashboard', new URL('https://demo.test/institution/dashboard'));
    assert.equal(props.timelineLabels.length, 7);
    assert.deepEqual(props.activityTrend, [0, 0, 0, 0, 0, 0, 1]);
    assert.deepEqual(props.screeningTrend, [1, 0, 0, 0, 0, 0, 0]);
});

test('triagens recentes são ordenadas pela data, mesmo quando foram adicionadas ao final', () => {
    const db = createInitialData();
    db.screenings = [
        { ...db.screenings[0], created_at: '2026-01-02T12:00:00.000Z' },
        { ...db.screenings[1], created_at: '2026-01-09T12:00:00.000Z' },
        { ...db.screenings[2], created_at: '2026-01-05T12:00:00.000Z' },
    ];
    const props = buildPageProps(db, 'institution', 'dashboard', new URL('https://demo.test/institution/dashboard'));
    assert.deepEqual(props.recentScreenings.map(screening => screening.id), [2, 3, 1]);
});

test('taxa de adaptação reflete atividades com e sem adaptações', () => {
    const db = createInitialData();
    db.adapted = db.adapted.filter(adaptation => adaptation.activity_id !== db.activities[0].id);
    const url = new URL('https://demo.test/institution/dashboard');
    assert.equal(buildPageProps(db, 'institution', 'dashboard', url).adaptationRate, 96);
    db.activities = [];
    db.adapted = [];
    assert.equal(buildPageProps(db, 'institution', 'dashboard', url).adaptationRate, 0);
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
    const initialHighRisk = db.screenings.filter(screening => screening.risk_level === 'alto').length;
    assert.throws(() => applyAction(db, '/teacher/screenings', { student_id: 1, answers: {} }, db.users[0]), DemoValidationError);
    applyAction(db, '/teacher/screenings', { student_id: 1, answers: Object.fromEntries(areas.map(a => [a, [3, 3, 3, 3, 3]])), observations: 'Teste' }, db.users[0]);
    assert.equal(db.screenings[0].score_geral, 100);
    const props = buildPageProps(db, 'institution', 'screenings', new URL('https://demo.test/institution/screenings'));
    assert.equal(props.riskCounts.alto, initialHighRisk + 1);
    assert.equal(props.totalScreenings, db.screenings.length);
});

test('sessões, planos e perfis de adaptação atualizam a demonstração', () => {
    const db = createInitialData();
    applyAction(db, '/psychologist/sessions', { student_id: '1', scheduled_at: '2026-12-01T10:00', focus: 'Leitura', notes: '' }, db.users[2]);
    assert.equal(db.sessions.length, 16);
    applyAction(db, '/psychopedagogue/plans', { student_id: '1', title: 'Novo plano', goals: 'Ler', strategies: 'Etapas', start_date: '2026-11-01' }, db.users[3]);
    assert.equal(db.plans.length, 2);
    applyAction(db, '/psychopedagogue/train-ai', { student_id: 1, disorders: ['Dislexia'], complexity_level: 'baixo', sensory_preference: 'visual', rules: [] }, db.users[3]);
    assert.equal(db.students[0].ai_profile.complexity_level, 'baixo');
    assert.doesNotThrow(() => JSON.stringify(db));
});
