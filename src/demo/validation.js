export const stateKeys = ['users', 'students', 'activities', 'adapted', 'sessions', 'screenings', 'classRooms', 'plans', 'achievements', 'messages'];
export function isDemoState(state) {
    if (!state || typeof state !== 'object' || !stateKeys.every(key => Array.isArray(state[key]) && state[key].every(record => record && typeof record === 'object' && !Array.isArray(record) && Number.isSafeInteger(record.id) && record.id > 0))) return false;
    const roles = ['teacher', 'student', 'psychologist', 'psychopedagogue', 'institution'];
    const users = new Map(state.users.map(user => [user.id, user]));
    const students = new Map(state.students.map(student => [student.id, student]));
    const activities = new Map(state.activities.map(activity => [activity.id, activity]));
    if (roles.some(role => state.users.filter(user => user.role === role).length < 1) || roles.filter(role => role !== 'student' && role !== 'teacher').some(role => state.users.filter(user => user.role === role).length !== 1) || !state.users.every(user => typeof user.name === 'string') || !state.students.length) return false;
    if (!state.students.every(student => typeof student.user?.name === 'string')) return false;
    if (!state.activities.every(activity => typeof activity.title === 'string' && typeof activity.subject === 'string')) return false;
    if (!state.adapted.every(item => students.has(item.student_id) && activities.has(item.activity_id) && typeof item.adapted_content === 'string')) return false;
    if (!state.sessions.every(item => students.has(item.student_id) && users.get(item.professional_id)?.role === 'psychologist' && typeof item.scheduled_at === 'string' && typeof item.focus === 'string')) return false;
    if (!state.screenings.every(item => students.has(item.student_id) && users.get(item.teacher_id)?.role === 'teacher' && Number.isFinite(item.score_geral) && item.score_geral >= 0 && item.score_geral <= 100 && typeof item.risk_level === 'string' && typeof item.created_at === 'string')) return false;
    if (!state.plans.every(item => students.has(item.student_id) && typeof item.title === 'string' && typeof item.goals === 'string')) return false;
    if (!state.classRooms.every(item => typeof item.name === 'string') || !state.achievements.every(item => typeof item.title === 'string')) return false;
    return state.messages.every(message => users.has(message.sender_id) && users.has(message.receiver_id) && typeof message.content === 'string');
}
