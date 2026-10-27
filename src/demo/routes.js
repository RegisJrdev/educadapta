export const pageRoutes = {
    '/': 'Public/Landing', '/demo': 'Demo/Profiles', '/login': 'Demo/Profiles', '/register': 'Demo/Profiles',
    '/teacher/dashboard': 'Teacher/Dashboard', '/teacher/adapt': 'Teacher/AdaptActivity',
    '/teacher/classes': 'Teacher/Classes', '/teacher/activities': 'Teacher/Activities',
    '/teacher/screenings': 'Teacher/Screenings', '/teacher/messages': 'Teacher/Messages',
    '/student/dashboard': 'Student/Dashboard', '/student/activities': 'Student/Activities',
    '/student/achievements': 'Student/Achievements', '/student/schedule': 'Student/Schedule', '/student/messages': 'Student/Messages',
    '/psychologist/dashboard': 'Psychologist/Dashboard', '/psychologist/sessions': 'Psychologist/Sessions',
    '/psychologist/students': 'Psychologist/Students', '/psychologist/messages': 'Psychologist/Messages',
    '/psychopedagogue/dashboard': 'Psychopedagogue/Dashboard', '/psychopedagogue/train-ai': 'Psychopedagogue/TrainAi',
    '/psychopedagogue/students': 'Psychopedagogue/Students', '/psychopedagogue/plans': 'Psychopedagogue/Plans', '/psychopedagogue/messages': 'Psychopedagogue/Messages',
    '/institution/dashboard': 'Institution/Dashboard', '/institution/teachers': 'Institution/Teachers',
    '/institution/students': 'Institution/Students', '/institution/reports': 'Institution/Reports', '/institution/screenings': 'Institution/Screenings',
};

const namedRoutes = {
    landing: '/', login: '/demo', register: '/demo', logout: '/demo', dashboard: '/demo',
    'teacher.adapt.form': '/teacher/adapt', 'teacher.adapt.preview': '/teacher/adapt/preview',
    'teacher.adapt.confirm': '/teacher/adapt/confirm', 'teacher.adapt.submit': '/teacher/adapt/confirm',
    'teacher.adapt.health': '/teacher/adapt/health', 'teacher.screenings.create': '/teacher/screenings/create/:student',
    'teacher.screenings.store': '/teacher/screenings', 'student.activities.complete': '/student/activities/:activity/complete',
    'psychologist.sessions.store': '/psychologist/sessions', 'psychopedagogue.plans.store': '/psychopedagogue/plans',
    'psychopedagogue.train-ai.save': '/psychopedagogue/train-ai',
};
for (const path of Object.keys(pageRoutes)) {
    if (path.split('/').length === 3) namedRoutes[path.slice(1).replace('/', '.')] = path;
}
for (const role of ['teacher', 'student', 'psychologist', 'psychopedagogue']) namedRoutes[`${role}.messages.send`] = `/${role}/messages`;

export function resolvePage(pathname) {
    const path = pathname.replace(/\/$/, '') || '/';
    return pageRoutes[path] || (/^\/teacher\/screenings\/create\/\d+$/.test(path) ? 'Teacher/ScreeningForm' : 'Demo/NotFound');
}

export function routePath(name, parameters = {}) {
    let path = namedRoutes[name];
    if (!path) throw new Error(`Rota desconhecida: ${name}`);
    const params = typeof parameters === 'object' && parameters !== null ? { ...parameters } : { id: parameters };
    path = path.replace(/:([a-z]+)/g, (_, key) => {
        const value = params[key] ?? params.id;
        if (value == null) throw new Error(`Parâmetro necessário: ${key}`);
        delete params[key]; delete params.id;
        return encodeURIComponent(typeof value === 'object' ? value.id : value);
    });
    const query = new URLSearchParams(params).toString();
    return path + (query ? `?${query}` : '');
}
