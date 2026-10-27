import { areas, riskForScore } from './data.js';

export class DemoValidationError extends Error {
    constructor(errors) { super(Object.values(errors)[0]); this.errors = errors; }
}
const requireFields = (data, fields) => {
    const errors = Object.fromEntries(fields.filter(key => data[key] == null || String(data[key]).trim() === '').map(key => [key, 'Preencha este campo.']));
    if (Object.keys(errors).length) throw new DemoValidationError(errors);
};
const nextId = records => Math.max(0, ...records.map(x => x.id)) + 1;

export function previewAdaptation(db, data) {
    requireFields(data, ['title']);
    const errors = {};
    if (!data.student_ids?.length) errors.student_ids = 'Selecione pelo menos um aluno.';
    if (!data.content?.trim() && !data.file) errors.content = 'Digite o conteúdo da atividade ou selecione um PDF.';
    if (data.file && !/\.pdf$/i.test(data.file.name)) errors.file = 'Selecione um arquivo PDF.';
    if (Object.keys(errors).length) throw new DemoValidationError(errors);
    const students = db.students.filter(s => data.student_ids.map(Number).includes(s.id));
    if (students.length !== data.student_ids.length) throw new DemoValidationError({ student_ids: 'Selecione alunos válidos.' });
    return {
        titulo: data.title, materia: data.subject || 'Geral', tipo: data.file ? 'pdf' : 'texto',
        conteudo: data.file ? `Arquivo selecionado: ${data.file.name}\n\nNa demonstração, o PDF não é processado. A adaptação usará um exemplo fixo. Para testar seu conteúdo, escolha a opção Texto.` : data.content,
        alunos: students.map(s => ({ id: s.id, nome: s.user.name, possui_perfil_ia: Boolean(s.ai_profile), transtornos: s.ai_profile?.disorders || [], nivel_complexidade: s.ai_profile?.complexity_level || '-' })),
        resumo: { total_alunos: students.length, com_perfil_ia: students.filter(s => s.ai_profile).length, sem_perfil_ia: students.filter(s => !s.ai_profile).length },
    };
}

export function applyAction(db, pathname, data, user) {
    const now = new Date().toISOString();
    if (pathname === '/teacher/adapt/confirm') {
        const preview = previewAdaptation(db, data);
        const activity = { id: nextId(db.activities), title: data.title.trim(), subject: data.subject || 'Geral', original_content: preview.conteudo, type: preview.tipo, teacher_id: 1, status: 'concluida', created_at: now };
        db.activities.unshift(activity);
        for (const student of preview.alunos.filter(s => s.possui_perfil_ia)) db.adapted.unshift({
            id: nextId(db.adapted), activity_id: activity.id, student_id: student.id, xp_earned: 50, status: 'concluida', completed_by_student: false,
            adapted_content: `EXEMPLO DE ADAPTAÇÃO — SIMULAÇÃO\n\n${activity.title}\n\nVamos praticar em pequenos passos:\n1. Leia o conteúdo com calma.\n2. Marque as palavras que você conhece.\n3. Conte o que entendeu com suas palavras ou faça um desenho.\n\nConteúdo de referência:\n${data.file ? 'Observe uma figura com três objetos. Conte os objetos e desenhe mais um.' : data.content}\n\nEste exemplo usa um modelo fixo. A IA do sistema original não é executada nesta demonstração.`,
        });
        return { redirect: '/teacher/activities', message: 'Adaptação de exemplo criada! Veja o resultado nas atividades.' };
    }
    const complete = pathname.match(/^\/student\/activities\/(\d+)\/complete$/);
    if (complete) {
        const activity = db.adapted.find(a => a.id === Number(complete[1]) && a.student_id === 1);
        if (!activity) throw new DemoValidationError({ activity: 'Atividade não encontrada.' });
        if (!activity.completed_by_student) {
            activity.completed_by_student = true; activity.completed_at = now;
            db.students[0].xp += activity.xp_earned;
            db.students[0].level = Math.floor(db.students[0].xp / 500) + 1;
        }
        return { message: 'Atividade concluída! Seu progresso foi salvo neste navegador.' };
    }
    if (pathname.endsWith('/messages')) {
        requireFields(data, ['receiver_id', 'content']);
        if (!db.users.some(u => u.id === Number(data.receiver_id) && u.id !== user.id)) throw new DemoValidationError({ receiver_id: 'Selecione um contato.' });
        db.messages.push({ id: nextId(db.messages), sender_id: user.id, receiver_id: Number(data.receiver_id), content: data.content.trim().slice(0, 2000), created_at: now });
        return { message: 'Mensagem de exemplo salva neste navegador.' };
    }
    if (pathname === '/psychologist/sessions') {
        requireFields(data, ['student_id', 'scheduled_at', 'focus']);
        if (!db.students.some(s => s.id === Number(data.student_id)) || !Number.isFinite(Date.parse(data.scheduled_at))) throw new DemoValidationError({ scheduled_at: 'Selecione um aluno e uma data válidos.' });
        db.sessions.unshift({ ...data, id: nextId(db.sessions), student_id: Number(data.student_id), professional_id: 3, status: 'agendada' });
        return { message: 'Sessão de exemplo agendada.' };
    }
    if (pathname === '/psychopedagogue/plans') {
        requireFields(data, ['student_id', 'title', 'goals', 'strategies', 'start_date']);
        if (!db.students.some(s => s.id === Number(data.student_id))) throw new DemoValidationError({ student_id: 'Selecione um aluno válido.' });
        db.plans.unshift({ ...data, id: nextId(db.plans), student_id: Number(data.student_id), status: 'ativo' });
        return { message: 'Plano de exemplo criado.' };
    }
    if (pathname === '/psychopedagogue/train-ai') {
        const student = db.students.find(s => s.id === Number(data.student_id));
        if (!student) throw new DemoValidationError({ student_id: 'Selecione um aluno.' });
        student.ai_profile = { ...data };
        return { message: 'Perfil de adaptação salvo neste navegador.' };
    }
    if (pathname === '/teacher/screenings') {
        if (!db.students.some(s => s.id === Number(data.student_id))) throw new DemoValidationError({ student_id: 'Selecione um aluno válido.' });
        const valid = areas.every(key => data.answers?.[key]?.length === 5 && data.answers[key].every(a => Number.isInteger(a) && a >= 0 && a <= 3));
        if (!valid) throw new DemoValidationError({ answers: 'Responda todas as perguntas.' });
        const scores = Object.fromEntries(areas.map(key => [`score_${key}`, Math.round(data.answers[key].reduce((a, b) => a + b, 0) / 15 * 100)]));
        const score = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / areas.length);
        db.screenings.unshift({ ...data, ...scores, id: nextId(db.screenings), student_id: Number(data.student_id), teacher_id: 1, created_at: now, score_geral: score, risk_level: riskForScore(score) });
        return { redirect: '/teacher/screenings', message: 'Triagem de exemplo salva. Os resultados são ilustrativos e não constituem diagnóstico.' };
    }
    throw new Error('Esta ação não está disponível na demonstração.');
}
