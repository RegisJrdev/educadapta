<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { ref } from 'vue';
import { usePage, Head } from '@/demo/navigation.js';

const page = usePage();
const selectedReport = ref(null);
const printReport = () => window.print();

const reports = [
    {
        icon: 'fas fa-chart-bar',
        color: 'var(--accent-blue)',
        bg: 'rgba(59,130,246,0.1)',
        title: 'Relatório Geral',
        description: 'Visão completa da instituição: alunos, professores, atividades e taxas de adaptação.',
        tags: ['Alunos', 'Professores', 'Atividades'],
    },
    {
        icon: 'fas fa-magic',
        color: 'var(--accent-purple)',
        bg: 'rgba(139,92,246,0.1)',
        title: 'Adaptações por IA',
        description: 'Histórico de adaptações geradas, status do pipeline e desempenho dos modelos de IA.',
        tags: ['Pipeline', 'Status', 'Tokens'],
    },
    {
        icon: 'fas fa-clipboard-check',
        color: 'var(--accent-red)',
        bg: 'rgba(239,68,68,0.1)',
        title: 'Triagens Realizadas',
        description: 'Resultado de todas as triagens com distribuição por nível de risco e período.',
        tags: ['Risco', 'Período', 'Alunos'],
    },
    {
        icon: 'fas fa-user-graduate',
        color: 'var(--accent-green)',
        bg: 'rgba(16,185,129,0.1)',
        title: 'Engajamento dos Alunos',
        description: 'Atividades concluídas, XP acumulado, ranking de alunos e taxa de participação.',
        tags: ['XP', 'Conclusões', 'Ranking'],
    },
    {
        icon: 'fas fa-chalkboard-teacher',
        color: '#f97316',
        bg: 'rgba(249,115,22,0.1)',
        title: 'Desempenho dos Professores',
        description: 'Atividades criadas por professor, turmas atendidas e uso da ferramenta de adaptação.',
        tags: ['Atividades', 'Turmas', 'Uso'],
    },
    {
        icon: 'fas fa-brain',
        color: '#ec4899',
        bg: 'rgba(236,72,153,0.1)',
        title: 'Perfis de IA e NEE',
        description: 'Distribuição de transtornos cadastrados, cobertura de perfis e regras de adaptação.',
        tags: ['Transtornos', 'Perfis', 'Regras'],
    },
    {
        icon: 'fas fa-trophy',
        color: 'var(--accent-yellow)',
        bg: 'rgba(250,204,21,0.15)',
        title: 'Gamificação',
        description: 'Conquistas desbloqueadas, níveis alcançados e evolução de XP dos alunos.',
        tags: ['Conquistas', 'Níveis', 'XP'],
    },
    {
        icon: 'fas fa-calendar-alt',
        color: '#06b6d4',
        bg: 'rgba(6,182,212,0.1)',
        title: 'Evolução Mensal',
        description: 'Crescimento mês a mês de atividades, adaptações e alunos ativos na plataforma.',
        tags: ['Mensal', 'Tendência', 'Crescimento'],
    },
];
</script>

<template>
    <DashboardLayout role="institution">
        <Head title="Relatórios - EducAdapta" />

        <div style="margin-bottom:2rem;">
            <h1 style="font-size:1.5rem; font-weight:700; margin-bottom:0.25rem;">
                <i class="fas fa-file-alt" style="color:var(--accent-green);"></i> Relatórios
            </h1>
            <p style="color:var(--text-secondary); font-size:0.875rem;">
                Abra um relatório demonstrativo e use a impressão do navegador para salvar em PDF.
            </p>
        </div>

        <section v-if="selectedReport" class="card" style="margin-bottom: 1.5rem;">
            <h2>{{ selectedReport.title }}</h2>
            <p>EducAdapta · Relatório demonstrativo · Dados fictícios</p>
            <p style="margin: 1rem 0;">{{ selectedReport.description }}</p>
            <table style="width: 100%; text-align: left;">
                <tbody>
                    <tr><th>Alunos</th><td>{{ page.props.totalStudents }}</td></tr>
                    <tr><th>Professores</th><td>{{ page.props.totalTeachers }}</td></tr>
                    <tr><th>Atividades</th><td>{{ page.props.totalActivities }}</td></tr>
                    <tr><th>Adaptações</th><td>{{ page.props.totalAdapted }}</td></tr>
                    <tr><th>Atividades concluídas</th><td>{{ page.props.totalCompleted }}</td></tr>
                    <tr><th>Triagens</th><td>{{ page.props.totalScreenings }}</td></tr>
                </tbody>
            </table>
            <p style="font-size: .8rem; margin-top: 1rem;">Este resumo ilustra a apresentação de relatórios. Não contém informações reais ou análises clínicas.</p>
            <button type="button" class="btn btn-primary report-print" style="margin-top: 1rem;" @click="printReport">Imprimir / Salvar PDF</button>
        </section>
        <div class="report-catalog" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:1.25rem;">
            <div v-for="report in reports" :key="report.title"
                 class="card"
                 style="cursor:pointer; display:flex; flex-direction:column; gap:1rem; transition:var(--transition);"
                 onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='var(--shadow-lg)'"
                 onmouseout="this.style.transform=''; this.style.boxShadow=''">

                <!-- Ícone + título -->
                <div style="display:flex; align-items:center; gap:0.875rem;">
                    <div :style="{
                        width:'44px', height:'44px', borderRadius:'var(--radius-md)',
                        background: report.bg, display:'flex', alignItems:'center',
                        justifyContent:'center', flexShrink:0
                    }">
                        <i :class="report.icon" :style="{ color: report.color, fontSize:'1.2rem' }"></i>
                    </div>
                    <h3 style="font-size:0.95rem; font-weight:700; line-height:1.3;">{{ report.title }}</h3>
                </div>

                <!-- Descrição -->
                <p style="font-size:0.8rem; color:var(--text-secondary); line-height:1.6; flex:1;">
                    {{ report.description }}
                </p>

                <!-- Tags -->
                <div style="display:flex; flex-wrap:wrap; gap:0.375rem;">
                    <span v-for="tag in report.tags" :key="tag"
                          class="badge"
                          :style="{ background: report.bg, color: report.color }">
                        {{ tag }}
                    </span>
                </div>

                <!-- Botão -->
                <button @click="selectedReport = report" class="btn btn-outline btn-sm"
                        :style="{ color: report.color, borderColor: report.color, width:'100%' }"
                        onmouseover="this.style.opacity='0.8'"
                        onmouseout="this.style.opacity='1'">
                    <i class="fas fa-file-pdf"></i> Ver exemplo
                </button>
            </div>
        </div>

    </DashboardLayout>
</template>
