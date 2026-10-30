export const roles = [
    { id: 'teacher', name: 'Professor', user: 'Mariana Costa', icon: 'fa-chalkboard-teacher', description: 'Adapte atividades, conheça suas turmas e realize uma triagem.' },
    { id: 'student', name: 'Aluno', user: 'Lucas Silva', icon: 'fa-user-graduate', description: 'Explore atividades adaptadas, conquistas e sua agenda.' },
    { id: 'psychologist', name: 'Psicólogo', user: 'Rafael Almeida', icon: 'fa-heart', description: 'Acompanhe alunos e organize sessões de atendimento.' },
    { id: 'psychopedagogue', name: 'Psicopedagogo', user: 'Camila Santos', icon: 'fa-brain', description: 'Configure perfis de adaptação e planos pedagógicos.' },
    { id: 'institution', name: 'Instituição', user: 'Escola Horizonte', icon: 'fa-school', description: 'Veja indicadores, professores, alunos e relatórios.' },
];

export const areas = ['atencao', 'leitura', 'raciocinio', 'comportamento', 'coordenacao', 'comunicacao'];
export const riskForScore = score => score <= 25 ? 'baixo' : score <= 50 ? 'atencao' : score <= 75 ? 'moderado' : 'alto';
export function summarizePsychologistSessions(sessions, now = new Date()) {
    const upcoming = sessions.filter(session => session.status === 'agendada' && new Date(session.scheduled_at) >= now).sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
    const group = (field, fallback) => {
        const counts = new Map();
        for (const session of sessions) {
            const label = String(session[field] || '').trim() || fallback;
            counts.set(label, (counts.get(label) || 0) + 1);
        }
        return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt-BR')).map(([label, value]) => ({ label, value }));
    };
    return { upcoming, studentCount: new Set(sessions.map(session => session.student_id)).size, statuses: group('status', 'Sem status'), focuses: group('focus', 'Sem foco informado') };
}
const dateOffset = (days, hour = 14, minute = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
};

export function appendPsychologistSessions(db) {
    const psychologist = db.users.find(user => user.role === 'psychologist');
    if (!psychologist || !db.students.length) return 0;
    const samples = [
        [-12, 9, 'concluida', 'Atenção e autoconfiança'], [-10, 10, 'concluida', 'Rotina de estudos'],
        [-8, 14, 'concluida', 'Estratégias de aprendizagem'], [-6, 11, 'concluida', 'Rotina de estudos'],
        [-4, 15, 'concluida', 'Atenção e autoconfiança'], [-3, 9, 'cancelada', 'Estratégias de aprendizagem'],
        [-2, 10, 'cancelada', 'Rotina de estudos'], [1, 15, 'agendada', 'Rotina de estudos'],
        [2, 14, 'agendada', 'Atenção e autoconfiança'], [4, 9, 'agendada', 'Estratégias de aprendizagem'],
        [5, 10, 'agendada', 'Rotina de estudos'], [6, 14, 'agendada', 'Atenção e autoconfiança'],
    ];
    let id = Math.max(0, ...db.sessions.map(session => session.id));
    let added = 0;
    samples.forEach(([day, hour, status, focus], index) => {
        const key = `psychologist-sessions-v1:${index}`;
        if (db.sessions.some(session => session.demo_sample_key === key)) return;
        db.sessions.push({ id: ++id, student_id: db.students[(index + 3) % db.students.length].id, professional_id: psychologist.id, scheduled_at: dateOffset(day, hour), focus, status, notes: 'Sessão fictícia para apresentação da plataforma.', demo_sample_key: key });
        added++;
    });
    return added;
}

const historyActivities = [
    [-1, 'Bilhetes da escola', 'Português', 'Leia um bilhete e identifique quem o escreveu e para quem.'],
    [-1, 'Insetos do jardim', 'Ciências', 'Observe um inseto e descreva onde ele vive.'],
    [-1, 'Preços na feira', 'Matemática', 'Some os valores de duas frutas de uma feira.'],
    [-1, 'Meu caminho favorito', 'Geografia', 'Desenhe um caminho conhecido e marque dois lugares importantes.'],
    [-2, 'Receita de palavras', 'Português', 'Organize as frases de uma receita na sequência correta.'],
    [-3, 'Sombras ao longo do dia', 'Ciências', 'Observe a sombra de um objeto em diferentes horários.'],
    [-3, 'Jogo das quantidades', 'Matemática', 'Separe objetos em grupos de cinco e conte o total.'],
    [-3, 'Cores da natureza', 'Arte', 'Escolha três cores presentes na natureza e faça um desenho.'],
    [-3, 'Mapa da comunidade', 'Geografia', 'Identifique lugares da comunidade em um mapa simples.'],
    [-3, 'Palavras e imagens', 'Português', 'Relacione cada palavra à imagem que representa seu significado.'],
    [-4, 'Água no cotidiano', 'Ciências', 'Liste maneiras de economizar água na escola.'],
    [-4, 'Partes de uma pizza', 'Matemática', 'Divida uma pizza desenhada em quatro partes iguais.'],
    [-5, 'História em quadrinhos', 'Português', 'Conte uma história curta usando três quadros.'],
    [-5, 'Bichos do rio', 'Ciências', 'Compare dois animais que vivem próximos de rios.'],
    [-5, 'Ritmos de palmas', 'Arte', 'Crie e repita uma sequência de palmas e pausas.'],
    [-5, 'Calendário da turma', 'Matemática', 'Conte quantos dias faltam para um evento da turma.'],
    [-6, 'Lugares de encontro', 'Geografia', 'Descreva um espaço onde as pessoas se encontram no bairro.'],
    [-7, 'Sementes e folhas', 'Ciências', 'Relacione as partes de uma planta às suas funções.'],
    [-7, 'Uma notícia importante', 'Português', 'Leia uma notícia curta e conte o acontecimento principal.'],
    [-7, 'Padrões em mosaicos', 'Matemática', 'Continue uma sequência de formas em um mosaico.'],
];
const historyScreenings = [[-1, 20], [-1, 42], [-2, 60], [-2, 78], [-2, 32], [-2, 54], [-2, 18], [-3, 72], [-4, 45], [-4, 33], [-4, 65], [-4, 82], [-5, 24], [-5, 48], [-6, 16], [-6, 58], [-6, 74], [-7, 28], [-7, 39], [-7, 85], [-7, 52]];
const historyTeachers = [0, 0, 1, 2, 0, 3, 1, 0, 2, 0, 3, 1, 0, 2, 1, 0, 3, 1, 0, 2];

export function appendInstitutionHistory(db) {
    const teachers = db.users.filter(user => user.role === 'teacher');
    if (!teachers.length || !db.students.length) return { activities: 0, adapted: 0, screenings: 0 };
    const added = { activities: 0, adapted: 0, screenings: 0 };
    let activityId = Math.max(0, ...db.activities.map(activity => activity.id));
    let adaptedId = Math.max(0, ...db.adapted.map(activity => activity.id));
    let screeningId = Math.max(0, ...db.screenings.map(screening => screening.id));
    historyActivities.forEach(([offset, title, subject, content], index) => {
        const key = `institution-history-v2:activity:${index}`;
        if (db.activities.some(activity => activity.demo_sample_key === key)) return;
        const id = ++activityId;
        const teacher = teachers[historyTeachers[index] % teachers.length];
        const student = db.students[index % db.students.length];
        db.activities.push({ id, title, subject, original_content: content, teacher_id: teacher.id, status: 'concluida', type: 'texto', created_at: dateOffset(offset, 12, index), demo_sample_key: key });
        db.adapted.push({ id: ++adaptedId, activity_id: id, student_id: student.id, status: 'concluida', completed_by_student: false, xp_earned: 50, adapted_content: `EXEMPLO DE ADAPTAÇÃO — SIMULAÇÃO\n\n${title}\n\nLeia com calma e realize uma etapa de cada vez.\n\n${content}`, demo_sample_key: `institution-history-v2:adapted:${index}` });
        added.activities++; added.adapted++;
    });
    historyScreenings.forEach(([offset, score], index) => {
        const key = `institution-history-v2:screening:${index}`;
        if (db.screenings.some(screening => screening.demo_sample_key === key)) return;
        const created = dateOffset(offset, 13, index);
        const occupied = new Set(db.screenings.filter(screening => String(screening.created_at).slice(0, 10) === created.slice(0, 10)).map(screening => screening.student_id));
        const student = db.students.find((candidate, candidateIndex) => candidateIndex >= index % db.students.length && !occupied.has(candidate.id)) || db.students.find(candidate => !occupied.has(candidate.id)) || db.students[index % db.students.length];
        db.screenings.push({ id: ++screeningId, student_id: student.id, teacher_id: teachers[index % teachers.length].id, created_at: created, score_geral: score, risk_level: riskForScore(score), ...Object.fromEntries(areas.map(area => [`score_${area}`, score])), observations: 'Dados fictícios para demonstração, sem finalidade diagnóstica.', demo_sample_key: key });
        added.screenings++;
    });
    return added;
}

export function createInitialData() {
    const users = roles.map((r, index) => ({ id: index + 1, name: r.user, role: r.id, email: `${r.id}@demo.educadapta.test`, created_at: dateOffset(-60) }));
    const studentNames = ['Lucas Silva', 'Sofia Oliveira', 'Pedro Souza', 'Alice Lima', 'Miguel Santos', 'Helena Costa', 'Davi Ferreira', 'Laura Almeida', 'Gabriel Rocha', 'Manuela Ribeiro'];
    const studentUsers = studentNames.map((name, i) => i === 0 ? users[1] : ({ id: i + 10, name, role: 'student', email: `aluno${i + 1}@demo.educadapta.test`, created_at: dateOffset(-45 + i) }));
    const teachers = [
        { id: 6, name: 'Renata Oliveira', role: 'teacher', email: 'renata@demo.educadapta.test', created_at: dateOffset(-50) },
        { id: 7, name: 'Diego Martins', role: 'teacher', email: 'diego@demo.educadapta.test', created_at: dateOffset(-42) },
        { id: 8, name: 'Aline Ferreira', role: 'teacher', email: 'aline@demo.educadapta.test', created_at: dateOffset(-35) },
    ];
    users.push(...studentUsers.slice(1), ...teachers);
    const students = studentNames.map((name, i) => ({
        id: i + 1, user_id: studentUsers[i].id,
        user: studentUsers[i],
        level: i === 0 ? 2 : 1, xp: i === 0 ? 650 : 150 + i * 50, grade: '5º ano',
        ai_profile: {
        disorders: [['Dislexia'], ['TDAH'], ['Discalculia'], ['TEA']][i % 4],
            complexity_level: 'medio', sensory_preference: 'visual',
            general_notes: 'Exemplo fictício: priorizar instruções curtas e atividades divididas em etapas.',
            rules: [{ category: 'geral', rule_description: 'Usar frases curtas e exemplos concretos.', priority: 1 }],
        },
    }));
    const activities = [
        { title: 'O ciclo da água', subject: 'Ciências', original_content: 'Explique as etapas do ciclo da água: evaporação, condensação e precipitação.' },
        { title: 'Uma aventura na biblioteca', subject: 'Português', original_content: 'Leia a história de uma visita à biblioteca e identifique personagens, lugar e acontecimentos.' },
        { title: 'Frações no dia a dia', subject: 'Matemática', original_content: 'Uma pizza foi dividida em oito fatias iguais. Se comemos duas fatias, qual fração representa a parte que sobrou?' },
        { title: 'Animais e seus habitats', subject: 'Ciências', original_content: 'Relacione cada animal ao ambiente onde vive e explique como ele encontra alimento.' },
        { title: 'Diário de uma aventura', subject: 'Português', original_content: 'Escreva três acontecimentos de uma aventura em ordem: começo, meio e fim.' },
        { title: 'Medidas na cozinha', subject: 'Matemática', original_content: 'Uma receita usa duas xícaras de farinha. Calcule a quantidade para preparar metade da receita.' },
        { title: 'Como cuidar do bairro', subject: 'Geografia', original_content: 'Observe os espaços do bairro e proponha uma ação para manter um deles limpo e seguro.' },
        { title: 'Sons e ritmos', subject: 'Arte', original_content: 'Crie uma sequência rítmica usando palmas, pausas e sons de objetos do cotidiano.' },
    ].map((a, i) => ({ ...a, id: i + 1, teacher_id: [1, 6, 7, 8][i % 4], status: 'concluida', type: 'texto', created_at: dateOffset([-1, -1, -2, -2, -3, -4, -6, -7][i]) }));
    const adaptations = [
        'Vamos descobrir o caminho da água!\n\n1. O sol aquece a água. Ela vira vapor e sobe: EVAPORAÇÃO.\n2. O vapor esfria e forma nuvens: CONDENSAÇÃO.\n3. A água cai das nuvens como chuva: PRECIPITAÇÃO.\n\nSua vez: desenhe uma nuvem e mostre, com setas, o caminho da água.',
        'Leia uma etapa de cada vez.\n\nLucas foi à biblioteca da escola. Ele escolheu um livro sobre animais. Depois, contou sua história favorita para Sofia.\n\n1. Quem foi à biblioteca?\n2. Sobre o que era o livro?\n3. Conte uma parte da história com suas palavras.',
        'Imagine uma pizza com 8 fatias.\n\n1. Desenhe 8 fatias.\n2. Pinte as 2 fatias que foram comidas.\n3. Conte as fatias que sobraram.\n\nSobraram 6 de 8 fatias: a fração é 6/8.',
        'Observe os animais um de cada vez.\n\n1. Ligue o peixe à água.\n2. Ligue o pássaro às árvores.\n3. Desenhe o lugar onde vive seu animal favorito.\n\nDica: pense no que cada animal precisa para viver.',
        'Vamos organizar a história em três partes.\n\n1. Começo: escolha quem vai viver a aventura.\n2. Meio: conte o que aconteceu no caminho.\n3. Fim: explique como a aventura terminou.\n\nVocê pode desenhar uma cena para cada parte.',
        'Vamos dividir a receita pela metade.\n\n1. A receita inteira usa 2 xícaras.\n2. Separe 1 xícara para fazer metade.\n3. Desenhe as xícaras para conferir.\n\nMetade de 2 é 1.',
        'Pense em um lugar do seu bairro.\n\n1. Escolha uma praça, rua ou escola.\n2. Observe o que ajuda a manter esse lugar agradável.\n3. Desenhe uma atitude que você pode praticar.',
        'Monte seu ritmo com três sons.\n\n1. Bata palmas duas vezes.\n2. Faça uma pausa.\n3. Repita e acrescente um som de objeto.\n\nConvide alguém para repetir sua sequência.',
    ];
    const adapted = activities.flatMap((activity, i) => students.map(student => ({
        id: i * students.length + student.id, activity_id: activity.id, student_id: student.id,
        status: 'concluida', completed_by_student: i === 2 && student.id <= 4, xp_earned: 50,
        adapted_content: adaptations[i],
    })));
    const sessions = students.slice(0, 3).map((student, i) => ({ id: i + 1, student_id: student.id, professional_id: 3, scheduled_at: dateOffset(i + 1, 10 + i), focus: ['Atenção e autoconfiança', 'Rotina de estudos', 'Estratégias de aprendizagem'][i], notes: 'Sessão fictícia para apresentação da plataforma.', status: 'agendada' }));
    const screenings = students.map((student, i) => {
        const score = [20, 40, 60, 80][i % 4];
        return { id: i + 1, student_id: student.id, teacher_id: [1, 6, 7, 8][i % 4], created_at: dateOffset([-1, -1, -1, -2, -3, -3, -5, -5, -6, -7][i]), score_geral: score, risk_level: riskForScore(score), ...Object.fromEntries(areas.map(area => [`score_${area}`, score])), observations: 'Dados fictícios para demonstração, sem finalidade diagnóstica.' };
    });
    const state = {
        users, students, activities, adapted, sessions, screenings,
        classRooms: [{ id: 1, name: '5º Ano A', grade: '5º ano', year: new Date().getFullYear(), students_count: 5 }, { id: 2, name: '5º Ano B', grade: '5º ano', year: new Date().getFullYear(), students_count: 5 }],
        plans: [{ id: 1, student_id: 1, title: 'Leitura com autonomia', goals: 'Praticar leitura e compreensão em pequenos passos.', strategies: 'Leitura guiada com apoio visual e pausas.', resources: 'Cartões ilustrados e textos curtos.', start_date: dateOffset(-7), end_date: dateOffset(30), status: 'ativo' }],
        achievements: [{ id: 1, title: 'Primeira Atividade', description: 'Você concluiu sua primeira atividade!', icon: 'fas fa-star', xp_reward: 50, earned_at: dateOffset(-5) }, { id: 2, title: 'Nível 2', description: 'Você chegou ao segundo nível.', icon: 'fas fa-arrow-up', xp_reward: 100, earned_at: dateOffset(-2) }],
        messages: [
            { id: 1, sender_id: 1, receiver_id: 2, content: 'Olá, Lucas! Sua atividade de Ciências já está disponível. Vamos aprender juntos?', created_at: dateOffset(-1) },
            { id: 2, sender_id: 2, receiver_id: 1, content: 'Obrigado, professora! Gostei dos exemplos.', created_at: dateOffset(-1, 15) },
            { id: 3, sender_id: 4, receiver_id: 1, content: 'Os perfis de adaptação da turma estão prontos para revisão.', created_at: dateOffset(-1) },
            { id: 4, sender_id: 2, receiver_id: 11, content: 'Oi, Sofia! Você entendeu a atividade sobre o ciclo da água?', created_at: dateOffset(-2, 9) },
            { id: 5, sender_id: 11, receiver_id: 2, content: 'Entendi! Desenhei as nuvens e coloquei as etapas na ordem.', created_at: dateOffset(-2, 9, 30) },
            { id: 6, sender_id: 2, receiver_id: 12, content: 'Pedro, quer estudar frações comigo depois da aula?', created_at: dateOffset(-2, 10) },
            { id: 7, sender_id: 12, receiver_id: 2, content: 'Quero sim. Vou levar meus desenhos de pizza!', created_at: dateOffset(-2, 10, 30) },
            { id: 8, sender_id: 13, receiver_id: 14, content: 'Miguel, qual animal você escolheu para o trabalho?', created_at: dateOffset(-1, 11) },
            { id: 9, sender_id: 14, receiver_id: 13, content: 'Escolhi a tartaruga. Ela vive na água e também vai à areia.', created_at: dateOffset(-1, 11, 20) },
            { id: 10, sender_id: 15, receiver_id: 16, content: 'Helena, vamos terminar o diário de aventura juntos?', created_at: dateOffset(-1, 13) },
            { id: 11, sender_id: 16, receiver_id: 15, content: 'Vamos! Eu escrevo o começo e você inventa o final.', created_at: dateOffset(-1, 13, 20) },
            { id: 12, sender_id: 17, receiver_id: 18, content: 'Laura, gostei do ritmo que você criou na aula de Arte.', created_at: 0 },
            { id: 13, sender_id: 18, receiver_id: 17, content: 'Obrigada! Podemos mostrar para a turma amanhã.', created_at: 0 },
            { id: 14, sender_id: 19, receiver_id: 11, content: 'Sofia, você pode me explicar como dividiu a receita?', created_at: dateOffset(-1, 14) },
            { id: 15, sender_id: 11, receiver_id: 19, content: 'Claro! Metade de duas xícaras é uma xícara.', created_at: dateOffset(-1, 14, 20) },
        ],
    };
    appendInstitutionHistory(state);
    appendPsychologistSessions(state);
    return state;
}

export function buildPageProps(db, role, section, url) {
    const user = db.users.find(u => u.role === role) || db.users[0];
    const studentById = id => db.students.find(s => s.id === Number(id));
    const students = db.students;
    const adapted = db.adapted.map(a => ({ ...a, student: studentById(a.student_id), activity: db.activities.find(x => x.id === a.activity_id) }));
    const activities = db.activities.map(a => ({ ...a, adapted_activities: adapted.filter(x => x.activity_id === a.id), adapted_activities_count: adapted.filter(x => x.activity_id === a.id).length }));
    const sessions = db.sessions.map(s => ({ ...s, student: studentById(s.student_id), professional: db.users.find(u => u.id === s.professional_id) }));
    const screenings = db.screenings.map(s => ({ ...s, student: studentById(s.student_id), teacher: db.users.find(u => u.id === s.teacher_id) }));
    const riskCounts = Object.fromEntries(['baixo', 'atencao', 'moderado', 'alto'].map(r => [r, screenings.filter(s => s.risk_level === r).length]));
    const dateKey = value => Number.isNaN(Date.parse(value)) ? null : new Date(value).toISOString().slice(0, 10);
    const latestDay = [...activities, ...screenings].map(item => dateKey(item.created_at)).filter(Boolean).sort().at(-1);
    const timelineDays = latestDay ? Array.from({ length: 7 }, (_, index) => {
        const day = new Date(`${latestDay}T00:00:00Z`);
        day.setUTCDate(day.getUTCDate() - 6 + index);
        return day.toISOString().slice(0, 10);
    }) : [];
    const timelineLabels = timelineDays.map(day => new Date(`${day}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }));
    const countByDay = records => timelineDays.map(day => records.filter(item => dateKey(item.created_at) === day).length);
    const paginate = data => ({ data, links: [], current_page: 1, last_page: 1, total: data.length });
    const ownActivities = adapted.filter(a => a.student_id === 1);
    const selectedContactId = Number(url.searchParams.get('contact')) || null;
    const conversations = db.users.filter(u => u.id !== user.id).map(contact => {
        const messages = db.messages.filter(m => (m.sender_id === user.id && m.receiver_id === contact.id) || (m.receiver_id === user.id && m.sender_id === contact.id));
        return { contact, lastMessage: messages.at(-1) || null, unread: messages.filter(m => m.receiver_id === user.id).length };
    });
    const topTeachers = db.users.filter(u => u.role === 'teacher').map(t => ({ ...t, total_activities: activities.filter(activity => activity.teacher_id === t.id).length })).sort((a, b) => b.total_activities - a.total_activities || a.name.localeCompare(b.name));
    const completed = adapted.filter(a => a.completed_by_student).length;
    const teacherActivities = activities.filter(activity => activity.teacher_id === user.id);
    const teacherAdaptations = teacherActivities.flatMap(activity => activity.adapted_activities);
    const teacherScreenings = screenings.filter(screening => screening.teacher_id === user.id);
    const teacherDashboard = {
        totalActivities: teacherActivities.length,
        totalAdapted: teacherAdaptations.length,
        totalScreenings: teacherScreenings.length,
        completedAdaptations: teacherAdaptations.filter(item => item.completed_by_student).length,
        riskDistribution: Object.fromEntries(['baixo', 'atencao', 'moderado', 'alto'].map(risk => [risk, teacherScreenings.filter(item => item.risk_level === risk).length])),
        recentActivities: [...teacherActivities].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    };
    return {
        auth: { user }, flash: {}, students, linkedStudents: students, teachers: topTeachers, topTeachers,
        student: section.startsWith('screenings/create') ? studentById(url.pathname.split('/').at(-1)) || students[0] : students[0],
        totalStudents: students.length, totalTeachers: topTeachers.length, totalActivities: activities.length,
        pendingAdaptations: 0, totalProfiles: students.filter(s => s.ai_profile).length, totalPlans: db.plans.length,
        totalSessions: sessions.length, totalAdapted: adapted.length, totalCompleted: completed,
        adaptationRate: activities.length ? Math.round(activities.filter(activity => activity.adapted_activities_count > 0).length / activities.length * 100) : 0,
        completionRate: adapted.length ? Math.round(completed / adapted.length * 100) : 0,
        recentActivities: activities, classRooms: db.classRooms,
        activities: paginate(role === 'student' ? ownActivities : activities),
        todayActivity: ownActivities.find(a => !a.completed_by_student),
        achievements: db.achievements, recentAchievements: db.achievements,
        sessions: role === 'student' ? sessions.filter(s => s.student_id === 1) : paginate(sessions),
        upcomingSessions: role === 'student' ? sessions.filter(s => s.student_id === 1) : sessions,
        plans: paginate(db.plans.map(p => ({ ...p, student: studentById(p.student_id) }))),
        screenings, riskCounts, riskDistribution: riskCounts, totalScreenings: screenings.length,
        recentScreenings: [...screenings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4).map(s => ({ ...s, student: s.student.user.name, created_at: new Date(s.created_at).toLocaleDateString('pt-BR') })),
        activitiesBySubject: [...new Set(activities.map(a => a.subject))].map(subject => ({ subject, total: activities.filter(a => a.subject === subject).length })),
        timelineLabels, activityTrend: countByDay(activities), screeningTrend: countByDay(screenings),
        teacherDashboard, psychologistSessions: role === 'psychologist' ? sessions.filter(session => session.professional_id === user.id) : [], conversations, selectedContactId,
        chatMessages: db.messages.filter(m => (m.sender_id === user.id && m.receiver_id === selectedContactId) || (m.receiver_id === user.id && m.sender_id === selectedContactId)),
    };
}
