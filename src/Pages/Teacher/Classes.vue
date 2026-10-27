<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head, Link } from '@/demo/navigation.js';

const props = defineProps({
    classRooms: { type: Array, default: () => [] },
});
</script>

<template>
    <DashboardLayout role="teacher">
        <Head title="Minhas Turmas - EducAdapta" />

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <div>
                <h1 style="font-size: 1.5rem; font-weight: 700;"><i class="fas fa-users" style="color: var(--accent-blue);"></i> Minhas Turmas</h1>
                <p style="color: var(--text-secondary); font-size: 0.875rem;">Gerencie suas turmas e alunos.</p>
            </div>
        </div>

        <div v-if="classRooms?.length" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
            <div v-for="room in classRooms" :key="room.id" class="card" style="padding: 1.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                    <div style="width: 45px; height: 45px; border-radius: var(--radius-md); background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)); display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-chalkboard" style="color: white; font-size: 1.1rem;"></i>
                    </div>
                    <div>
                        <h3 style="font-weight: 700; font-size: 1rem;">{{ room.name }}</h3>
                        <p style="font-size: 0.75rem; color: var(--text-secondary);">{{ room.grade }}</p>
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; border-top: 1px solid var(--border);">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-user-graduate" style="color: var(--accent-blue); font-size: 0.8rem;"></i>
                        <span style="font-size: 0.85rem; font-weight: 600;">{{ room.students_count || 0 }} alunos</span>
                    </div>
                    <Link :href="route('teacher.adapt.form')" class="btn btn-sm btn-outline" style="font-size: 0.75rem;">
                        <i class="fas fa-magic"></i> Adaptar
                    </Link>
                </div>
            </div>
        </div>

        <div v-else class="card" style="text-align: center; padding: 3rem;">
            <i class="fas fa-school" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
            <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Nenhuma turma cadastrada</h3>
            <p style="color: var(--text-secondary); font-size: 0.85rem;">Peça à instituição para vincular você a uma turma.</p>
        </div>
    </DashboardLayout>
</template>
