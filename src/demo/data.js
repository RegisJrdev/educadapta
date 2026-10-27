export const roles = [
    { id: 'teacher', name: 'Professor', user: 'Mariana Costa', icon: 'fa-chalkboard-teacher', description: 'Adapte atividades, conheça suas turmas e realize uma triagem.' },
    { id: 'student', name: 'Aluno', user: 'Lucas Silva', icon: 'fa-user-graduate', description: 'Explore atividades adaptadas, conquistas e sua agenda.' },
    { id: 'psychologist', name: 'Psicólogo', user: 'Rafael Almeida', icon: 'fa-heart', description: 'Acompanhe alunos e organize sessões de atendimento.' },
    { id: 'psychopedagogue', name: 'Psicopedagogo', user: 'Camila Santos', icon: 'fa-brain', description: 'Configure perfis de adaptação e planos pedagógicos.' },
    { id: 'institution', name: 'Instituição', user: 'Escola Horizonte', icon: 'fa-school', description: 'Veja indicadores, professores, alunos e relatórios.' },
];

export const areas = ['atencao', 'leitura', 'raciocinio', 'comportamento', 'coordenacao', 'comunicacao'];
export const riskForScore = score => score <= 25 ? 'baixo' : score <= 50 ? 'atencao' : score <= 75 ? 'moderado' : 'alto';
const dateOffset = (days, hour = 14) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(hour, 0, 0, 0);
    return date.toISOString();
};

export function createInitialData() {
    const users = roles.map((r, index) => ({ id: index + 1, name: r.user, role: r.id, email: `${r.id}@demo.educadapta.test`, created_at: dateOffset(-60) }));
    const students = ['Lucas Silva', 'Sofia Oliveira', 'Pedro Souza', 'Alice Lima'].map((name, i) => ({
        id: i + 1, user_id: i === 0 ? 2 : i + 10,
        user: i === 0 ? users[1] : { id: i + 10, name, role: 'student', email: `aluno${i + 1}@demo.educadapta.test` },
        level: i === 0 ? 2 : 1, xp: i === 0 ? 650 : 150 + i * 50, grade: '5º ano',
        ai_profile: {
            disorders: [['Dislexia'], ['TDAH'], ['Discalculia'], ['TEA']][i],
            complexity_level: 'medio', sensory_preference: 'visual',
            general_notes: 'Exemplo fictício: priorizar instruções curtas e atividades divididas em etapas.',
            rules: [{ category: 'geral', rule_description: 'Usar frases curtas e exemplos concretos.', priority: 1 }],
        },
    }));
    const activities = [
        { title: 'O ciclo da água', subject: 'Ciências', original_content: 'Explique as etapas do ciclo da água: evaporação, condensação e precipitação.' },
        { title: 'Uma aventura na biblioteca', subject: 'Português', original_content: 'Leia a história de uma visita à biblioteca e identifique personagens, lugar e acontecimentos.' },
        { title: 'Frações no dia a dia', subject: 'Matemática', original_content: 'Uma pizza foi dividida em oito fatias iguais. Se comemos duas fatias, qual fração representa a parte que sobrou?' },
    ].map((a, i) => ({ ...a, id: i + 1, teacher_id: 1, status: 'concluida', type: 'texto', created_at: dateOffset(-i - 1) }));
    const adapted = activities.flatMap((activity, i) => students.map(student => ({
        id: i * students.length + student.id, activity_id: activity.id, student_id: student.id,
        status: 'concluida', completed_by_student: i === 2, xp_earned: 50,
        adapted_content: ['Vamos descobrir o caminho da água!\n\n1. O sol aquece a água. Ela vira vapor e sobe: EVAPORAÇÃO.\n2. O vapor esfria e forma nuvens: CONDENSAÇÃO.\n3. A água cai das nuvens como chuva: PRECIPITAÇÃO.\n\nSua vez: desenhe uma nuvem e mostre, com setas, o caminho da água.', 'Leia uma etapa de cada vez.\n\nLucas foi à biblioteca da escola. Ele escolheu um livro sobre animais. Depois, contou sua história favorita para Sofia.\n\n1. Quem foi à biblioteca?\n2. Sobre o que era o livro?\n3. Conte uma parte da história com suas palavras.', 'Imagine uma pizza com 8 fatias.\n\n1. Desenhe 8 fatias.\n2. Pinte as 2 fatias que foram comidas.\n3. Conte as fatias que sobraram.\n\nSobraram 6 de 8 fatias: a fração é 6/8.'][i],
    })));
    const sessions = students.slice(0, 3).map((student, i) => ({ id: i + 1, student_id: student.id, professional_id: 3, scheduled_at: dateOffset(i + 1, 10 + i), focus: ['Atenção e autoconfiança', 'Rotina de estudos', 'Estratégias de aprendizagem'][i], notes: 'Sessão fictícia para apresentação da plataforma.', status: 'agendada' }));
    const screenings = students.map((student, i) => ({ id: i + 1, student_id: student.id, teacher_id: 1, created_at: dateOffset(-i - 1), score_geral: [20, 40, 60, 80][i], risk_level: ['baixo', 'atencao', 'moderado', 'alto'][i], ...Object.fromEntries(areas.map(area => [`score_${area}`, [20, 40, 60, 80][i]])), observations: 'Dados fictícios para demonstração, sem finalidade diagnóstica.' }));
    return {
        users, students, activities, adapted, sessions, screenings,
        classRooms: [{ id: 1, name: '5º Ano A', grade: '5º ano', year: new Date().getFullYear(), students_count: 4 }, { id: 2, name: '5º Ano B', grade: '5º ano', year: new Date().getFullYear(), students_count: 0 }],
        plans: [{ id: 1, student_id: 1, title: 'Leitura com autonomia', goals: 'Praticar leitura e compreensão em pequenos passos.', strategies: 'Leitura guiada com apoio visual e pausas.', resources: 'Cartões ilustrados e textos curtos.', start_date: dateOffset(-7), end_date: dateOffset(30), status: 'ativo' }],
        achievements: [{ id: 1, title: 'Primeira Atividade', description: 'Você concluiu sua primeira atividade!', icon: 'fas fa-star', xp_reward: 50, earned_at: dateOffset(-5) }, { id: 2, title: 'Nível 2', description: 'Você chegou ao segundo nível.', icon: 'fas fa-arrow-up', xp_reward: 100, earned_at: dateOffset(-2) }],
        messages: [{ id: 1, sender_id: 1, receiver_id: 2, content: 'Olá, Lucas! Sua atividade de Ciências já está disponível. Vamos aprender juntos?', created_at: dateOffset(-1) }, { id: 2, sender_id: 2, receiver_id: 1, content: 'Obrigado, professora! Gostei dos exemplos.', created_at: dateOffset(-1, 15) }, { id: 3, sender_id: 4, receiver_id: 1, content: 'Os perfis de adaptação da turma estão prontos para revisão.', created_at: dateOffset(-1) }],
    };
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
    const paginate = data => ({ data, links: [], current_page: 1, last_page: 1, total: data.length });
    const ownActivities = adapted.filter(a => a.student_id === 1);
    const selectedContactId = Number(url.searchParams.get('contact')) || null;
    const conversations = db.users.filter(u => u.id !== user.id).map(contact => {
        const messages = db.messages.filter(m => (m.sender_id === user.id && m.receiver_id === contact.id) || (m.receiver_id === user.id && m.sender_id === contact.id));
        return { contact, lastMessage: messages.at(-1) || null, unread: messages.filter(m => m.receiver_id === user.id).length };
    });
    const topTeachers = db.users.filter(u => u.role === 'teacher').map(t => ({ ...t, total_activities: activities.length }));
    const completed = adapted.filter(a => a.completed_by_student).length;
    return {
        auth: { user }, flash: {}, students, linkedStudents: students, teachers: topTeachers, topTeachers,
        student: section.startsWith('screenings/create') ? studentById(url.pathname.split('/').at(-1)) || students[0] : students[0],
        totalStudents: students.length, totalTeachers: topTeachers.length, totalActivities: activities.length,
        pendingAdaptations: 0, totalProfiles: students.filter(s => s.ai_profile).length, totalPlans: db.plans.length,
        totalSessions: sessions.length, totalAdapted: adapted.length, totalCompleted: completed,
        adaptationRate: 100, completionRate: adapted.length ? Math.round(completed / adapted.length * 100) : 0,
        recentActivities: activities, classRooms: db.classRooms,
        activities: paginate(role === 'student' ? ownActivities : activities),
        todayActivity: ownActivities.find(a => !a.completed_by_student),
        achievements: db.achievements, recentAchievements: db.achievements,
        sessions: role === 'student' ? sessions.filter(s => s.student_id === 1) : paginate(sessions),
        upcomingSessions: role === 'student' ? sessions.filter(s => s.student_id === 1) : sessions,
        plans: paginate(db.plans.map(p => ({ ...p, student: studentById(p.student_id) }))),
        screenings, riskCounts, riskDistribution: riskCounts, totalScreenings: screenings.length,
        recentScreenings: screenings.slice(0, 4).map(s => ({ ...s, student: s.student.user.name, created_at: new Date(s.created_at).toLocaleDateString('pt-BR') })),
        activitiesBySubject: [...new Set(activities.map(a => a.subject))].map(subject => ({ subject, total: activities.filter(a => a.subject === subject).length })),
        conversations, selectedContactId,
        chatMessages: db.messages.filter(m => (m.sender_id === user.id && m.receiver_id === selectedContactId) || (m.receiver_id === user.id && m.sender_id === selectedContactId)),
    };
}
