<script setup>
import { Link, usePage, router } from "@/demo/navigation.js";
import { ref, computed } from "vue";

const props = defineProps({
    role: { type: String, required: true },
});

const page = usePage();
const user = computed(() => page.props.auth.user);
const sidebarOpen = ref(false);

const logout = () => {
    router.post(route("logout"));
};

const navItems = computed(() => {
    const menus = {
        student: [
            {
                label: "Meu Painel",
                icon: "fas fa-home",
                route: "student.dashboard",
            },
            {
                label: "Atividades",
                icon: "fas fa-book",
                route: "student.activities",
            },
            {
                label: "Conquistas",
                icon: "fas fa-trophy",
                route: "student.achievements",
            },
            {
                label: "Agenda",
                icon: "fas fa-calendar",
                route: "student.schedule",
            },
            {
                label: "Mensagens",
                icon: "fas fa-comments",
                route: "student.messages",
            },
        ],
        teacher: [
            {
                label: "Painel",
                icon: "fas fa-home",
                route: "teacher.dashboard",
            },
            {
                label: "Adaptar Atividade",
                icon: "fas fa-magic",
                route: "teacher.adapt.form",
            },
            {
                label: "Minhas Turmas",
                icon: "fas fa-users",
                route: "teacher.classes",
            },
            {
                label: "Atividades",
                icon: "fas fa-book",
                route: "teacher.activities",
            },
            {
                label: "Triagem",
                icon: "fas fa-clipboard-check",
                route: "teacher.screenings",
            },
            {
                label: "Mensagens",
                icon: "fas fa-comments",
                route: "teacher.messages",
            },
        ],
        psychologist: [
            {
                label: "Painel",
                icon: "fas fa-home",
                route: "psychologist.dashboard",
            },
            {
                label: "Sessões",
                icon: "fas fa-calendar-check",
                route: "psychologist.sessions",
            },
            {
                label: "Alunos",
                icon: "fas fa-user-graduate",
                route: "psychologist.students",
            },
            {
                label: "Mensagens",
                icon: "fas fa-comments",
                route: "psychologist.messages",
            },
        ],
        psychopedagogue: [
            {
                label: "Painel",
                icon: "fas fa-home",
                route: "psychopedagogue.dashboard",
            },
            {
                label: "Treinar IA",
                icon: "fas fa-brain",
                route: "psychopedagogue.train-ai",
            },
            {
                label: "Alunos",
                icon: "fas fa-user-graduate",
                route: "psychopedagogue.students",
            },
            {
                label: "Planos",
                icon: "fas fa-clipboard-list",
                route: "psychopedagogue.plans",
            },
            {
                label: "Mensagens",
                icon: "fas fa-comments",
                route: "psychopedagogue.messages",
            },
        ],
        institution: [
            {
                label: "Painel",
                icon: "fas fa-home",
                route: "institution.dashboard",
            },
            {
                label: "Professores",
                icon: "fas fa-chalkboard-teacher",
                route: "institution.teachers",
            },
            {
                label: "Alunos",
                icon: "fas fa-user-graduate",
                route: "institution.students",
            },
            {
                label: "Relatórios",
                icon: "fas fa-chart-bar",
                route: "institution.reports",
            },
            {
                label: "Triagem",
                icon: "fas fa-clipboard-check",
                route: "institution.screenings",
            },
        ],
    };
    return menus[props.role] || [];
});

const isActive = (routeName) => {
    try {
        return route().current(routeName);
    } catch {
        return false;
    }
};

const hasRoute = (routeName) => {
    try {
        route(routeName);
        return true;
    } catch {
        return false;
    }
};

const roleLabel = computed(() => {
    const labels = {
        student: "Aluno",
        teacher: "Professor(a)",
        psychologist: "Psicólogo(a)",
        psychopedagogue: "Psicopedagogo(a)",
        institution: "Instituição",
    };
    return labels[props.role] || props.role;
});
</script>

<template>
    <div class="dashboard-layout">
        <!-- Sidebar -->
        <aside class="sidebar" :class="{ open: sidebarOpen }">
            <div class="sidebar-logo">
                <Link
                    :href="route('dashboard')"
                    style="
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        text-decoration: none;
                        color: inherit;
                    "
                >
                    <img
                        src="/images/logo.png"
                        alt="EducAdapta"
                        style="height: 36px; width: auto;"
                    />
                    <span>EducAdapta</span>
                </Link>
            </div>
            <nav class="sidebar-nav">
                <template v-for="item in navItems" :key="item.route">
                    <Link
                        v-if="hasRoute(item.route)"
                        :href="route(item.route)"
                        class="sidebar-link"
                        :class="{ active: isActive(item.route) }"
                    >
                        <i :class="item.icon"></i> {{ item.label }}
                    </Link>
                    <span
                        v-else
                        class="sidebar-link"
                        style="opacity: 0.4; cursor: not-allowed"
                    >
                        <i :class="item.icon"></i> {{ item.label }}
                    </span>
                </template>
            </nav>

            <!-- Logout at bottom -->
            <div
                style="
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 1rem 1.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                "
            >
                <div
                    style="
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        margin-bottom: 0.75rem;
                    "
                >
                    <div
                        style="
                            width: 36px;
                            height: 36px;
                            background: var(--accent-blue);
                            color: white;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: 700;
                            font-size: 0.875rem;
                        "
                    >
                        {{ user?.name?.charAt(0)?.toUpperCase() }}
                    </div>
                    <div style="flex: 1; min-width: 0">
                        <p
                            style="
                                font-size: 0.8rem;
                                font-weight: 600;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            "
                        >
                            {{ user?.name }}
                        </p>
                        <p
                            style="
                                font-size: 0.65rem;
                                color: rgba(255, 255, 255, 0.5);
                            "
                        >
                            {{ roleLabel }}
                        </p>
                    </div>
                </div>
                <button
                    @click="logout"
                    class="btn"
                    style="
                        width: 100%;
                        background: rgba(255, 255, 255, 0.1);
                        color: rgba(255, 255, 255, 0.8);
                        font-size: 0.8rem;
                        padding: 0.5rem;
                    "
                >
                    <i class="fas fa-sign-out-alt"></i> Sair
                </button>
            </div>
        </aside>

        <!-- Mobile Header -->
        <header class="mobile-header">
            <button class="hamburger" @click="sidebarOpen = !sidebarOpen">
                <i class="fas fa-bars"></i>
            </button>
            <span style="font-weight: 700">EducAdapta</span>
            <button
                @click="logout"
                style="
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                "
            >
                <i class="fas fa-sign-out-alt"></i>
            </button>
        </header>

        <!-- Overlay for mobile -->
        <div
            v-if="sidebarOpen"
            @click="sidebarOpen = false"
            style="
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 45;
            "
        ></div>

        <!-- Main Content -->
        <main class="main-content">
            <slot />
        </main>
    </div>
</template>
