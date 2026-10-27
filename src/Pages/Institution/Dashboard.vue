<script setup>
import DashboardLayout from '@/Layouts/DashboardLayout.vue';
import { Head, Link, usePage } from '@/demo/navigation.js';
import { computed } from 'vue';

const props = defineProps({
    totalTeachers:       { type: Number, default: 0 },
    totalStudents:       { type: Number, default: 0 },
    totalActivities:     { type: Number, default: 0 },
    totalAdapted:        { type: Number, default: 0 },
    totalCompleted:      { type: Number, default: 0 },
    adaptationRate:      { type: Number, default: 0 },
    completionRate:      { type: Number, default: 0 },
    topTeachers:         { type: Array, default: () => [] },
    activitiesBySubject: { type: Array, default: () => [] },
    recentScreenings:    { type: Array, default: () => [] },
    riskDistribution:    { type: Object, default: () => ({}) },
});

const page = usePage();
const user = computed(() => page.props.auth.user);

const totalScreenings = computed(() =>
    Object.values(props.riskDistribution).reduce((a, b) => a + b, 0)
);

const maxSubjectCount = computed(() =>
    props.activitiesBySubject.length
        ? Math.max(...props.activitiesBySubject.map(s => s.total))
        : 1
);

const riskConfig = {
    baixo:    { label: 'Baixo',    color: 'var(--accent-green)',  bg: 'rgba(16,185,129,0.1)' },
    atencao:  { label: 'Atenção',  color: 'var(--accent-yellow)', bg: 'rgba(250,204,21,0.15)' },
    moderado: { label: 'Moderado', color: '#f97316',              bg: 'rgba(249,115,22,0.1)' },
    alto:     { label: 'Alto',     color: 'var(--accent-red)',    bg: 'rgba(239,68,68,0.1)' },
};

const hasRoute = (name) => {
    try { route(name); return true; } catch { return false; }
};
</script>

<template>
    <DashboardLayout role="institution">
        <Head title="Painel Instituição - EducAdapta" />

        <!-- Header -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2rem; flex-wrap:wrap; gap:1rem;">
            <div>
                <h1 style="font-size:1.5rem; font-weight:700; margin-bottom:0.25rem;">
                    Olá, {{ user.name }}!
                </h1>
                <p style="color:var(--text-secondary); font-size:0.875rem;">
                    Visão geral da sua instituição na plataforma EducAdapta
                </p>
            </div>
            <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
                <Link v-if="hasRoute('institution.reports')" :href="route('institution.reports')" class="btn btn-outline btn-sm">
                    <i class="fas fa-chart-bar"></i> Relatórios
                </Link>
                <Link v-if="hasRoute('institution.screenings')" :href="route('institution.screenings')" class="btn btn-primary btn-sm">
                    <i class="fas fa-clipboard-check"></i> Triagens
                </Link>
            </div>
        </div>

        <!-- KPIs -->
        <div class="grid grid-4" style="margin-bottom:1.5rem;">
            <div class="card kpi-card" style="border-top:3px solid var(--accent-blue);">
                <div style="font-size:1.75rem; margin-bottom:0.5rem;">
                    <i class="fas fa-chalkboard-teacher" style="color:var(--accent-blue);"></i>
                </div>
                <div class="kpi-value">{{ totalTeachers }}</div>
                <div class="kpi-label">Professores</div>
            </div>
            <div class="card kpi-card" style="border-top:3px solid var(--accent-green);">
                <div style="font-size:1.75rem; margin-bottom:0.5rem;">
                    <i class="fas fa-user-graduate" style="color:var(--accent-green);"></i>
                </div>
                <div class="kpi-value" style="color:var(--accent-green);">{{ totalStudents }}</div>
                <div class="kpi-label">Alunos</div>
            </div>
            <div class="card kpi-card" style="border-top:3px solid var(--accent-purple);">
                <div style="font-size:1.75rem; margin-bottom:0.5rem;">
                    <i class="fas fa-book-open" style="color:var(--accent-purple);"></i>
                </div>
                <div class="kpi-value" style="color:var(--accent-purple);">{{ totalActivities }}</div>
                <div class="kpi-label">Atividades</div>
            </div>
            <div class="card kpi-card" style="border-top:3px solid var(--accent-yellow);">
                <div style="font-size:1.75rem; margin-bottom:0.5rem;">
                    <i class="fas fa-magic" style="color:var(--accent-yellow);"></i>
                </div>
                <div class="kpi-value" style="color:var(--accent-yellow);">{{ totalAdapted }}</div>
                <div class="kpi-label">Adaptadas pela IA</div>
            </div>
        </div>

        <!-- Impacto da IA -->
        <div class="card" style="margin-bottom:1.5rem; background:linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%); color:white; border:none;">
            <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.25rem;">
                <i class="fas fa-brain" style="font-size:1.25rem; color:var(--accent-yellow);"></i>
                <h3 style="font-size:1rem; font-weight:700;">Impacto da Inteligência Artificial</h3>
            </div>
            <div class="grid grid-3" style="gap:1.5rem;">
                <div style="text-align:center;">
                    <div style="font-size:2rem; font-weight:700; color:var(--accent-yellow);">{{ adaptationRate }}%</div>
                    <div style="font-size:0.75rem; opacity:0.8; margin-top:0.25rem; text-transform:uppercase; letter-spacing:0.05em;">Taxa de Adaptação</div>
                    <div class="progress-bar" style="margin-top:0.75rem; background:rgba(255,255,255,0.2);">
                        <div class="progress-fill" :style="{ width: adaptationRate + '%', background: 'var(--accent-yellow)' }"></div>
                    </div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:2rem; font-weight:700; color:var(--accent-green);">{{ completionRate }}%</div>
                    <div style="font-size:0.75rem; opacity:0.8; margin-top:0.25rem; text-transform:uppercase; letter-spacing:0.05em;">Taxa de Conclusão</div>
                    <div class="progress-bar" style="margin-top:0.75rem; background:rgba(255,255,255,0.2);">
                        <div class="progress-fill" :style="{ width: completionRate + '%', background: 'var(--accent-green)' }"></div>
                    </div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:2rem; font-weight:700; color:#a5f3fc;">{{ totalCompleted }}</div>
                    <div style="font-size:0.75rem; opacity:0.8; margin-top:0.25rem; text-transform:uppercase; letter-spacing:0.05em;">Atividades Concluídas</div>
                    <div class="progress-bar" style="margin-top:0.75rem; background:rgba(255,255,255,0.2);">
                        <div class="progress-fill" :style="{ width: totalAdapted > 0 ? (totalCompleted/totalAdapted*100) + '%' : '0%', background: '#a5f3fc' }"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-2" style="margin-bottom:1.5rem;">

            <!-- Atividades por Matéria -->
            <div class="card">
                <h3 style="font-size:1rem; font-weight:700; margin-bottom:1.25rem;">
                    <i class="fas fa-chart-bar" style="color:var(--accent-blue);"></i> Atividades por Disciplina
                </h3>
                <div v-if="activitiesBySubject.length" style="display:flex; flex-direction:column; gap:0.6rem;">
                    <div v-for="item in activitiesBySubject" :key="item.subject" style="display:flex; align-items:center; gap:0.75rem;">
                        <div style="width:90px; font-size:0.75rem; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" :title="item.subject">
                            {{ item.subject }}
                        </div>
                        <div style="flex:1; height:20px; background:var(--bg-light); border-radius:var(--radius-full); overflow:hidden;">
                            <div :style="{
                                width: (item.total / maxSubjectCount * 100) + '%',
                                height: '100%',
                                background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))',
                                borderRadius: 'var(--radius-full)',
                                transition: 'width 0.5s ease'
                            }"></div>
                        </div>
                        <div style="width:28px; text-align:right; font-size:0.8rem; font-weight:600; color:var(--text-primary);">
                            {{ item.total }}
                        </div>
                    </div>
                </div>
                <p v-else style="color:var(--text-secondary); font-size:0.875rem;">Nenhuma atividade cadastrada ainda.</p>
            </div>

            <!-- Triagem - Distribuição de Risco -->
            <div class="card">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem;">
                    <h3 style="font-size:1rem; font-weight:700;">
                        <i class="fas fa-heartbeat" style="color:var(--accent-red);"></i> Triagens por Nível de Risco
                    </h3>
                    <span style="font-size:0.75rem; color:var(--text-secondary);">{{ totalScreenings }} total</span>
                </div>
                <div v-if="totalScreenings > 0" style="display:flex; flex-direction:column; gap:0.75rem;">
                    <div v-for="(cfg, key) in riskConfig" :key="key" style="display:flex; align-items:center; gap:0.75rem;">
                        <div :style="{ width:'80px', fontSize:'0.75rem', fontWeight:'600', color: cfg.color }">
                            {{ cfg.label }}
                        </div>
                        <div style="flex:1; height:20px; background:var(--bg-light); border-radius:var(--radius-full); overflow:hidden;">
                            <div :style="{
                                width: totalScreenings > 0 ? (riskDistribution[key] / totalScreenings * 100) + '%' : '0%',
                                height: '100%',
                                background: cfg.color,
                                borderRadius: 'var(--radius-full)',
                                transition: 'width 0.5s ease',
                                opacity: 0.85
                            }"></div>
                        </div>
                        <div :style="{ width:'28px', textAlign:'right', fontSize:'0.8rem', fontWeight:'600', color: cfg.color }">
                            {{ riskDistribution[key] || 0 }}
                        </div>
                    </div>
                </div>
                <p v-else style="color:var(--text-secondary); font-size:0.875rem;">Nenhuma triagem realizada ainda.</p>

                <div v-if="recentScreenings.length" style="margin-top:1.25rem; border-top:1px solid var(--border); padding-top:1rem;">
                    <p style="font-size:0.75rem; font-weight:600; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.75rem;">Recentes</p>
                    <div v-for="s in recentScreenings" :key="s.id" style="display:flex; align-items:center; justify-content:space-between; padding:0.375rem 0; border-bottom:1px solid var(--border);">
                        <span style="font-size:0.8rem; font-weight:500;">{{ s.student }}</span>
                        <div style="display:flex; align-items:center; gap:0.5rem;">
                            <span class="badge" :style="{
                                background: riskConfig[s.risk_level]?.bg || 'var(--bg-light)',
                                color: riskConfig[s.risk_level]?.color || 'var(--text-secondary)'
                            }">{{ riskConfig[s.risk_level]?.label || s.risk_level }}</span>
                            <span style="font-size:0.7rem; color:var(--text-light);">{{ s.created_at }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-2" style="margin-bottom:1.5rem;">

            <!-- Top Professores -->
            <div class="card">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem;">
                    <h3 style="font-size:1rem; font-weight:700;">
                        <i class="fas fa-star" style="color:var(--accent-yellow);"></i> Professores Mais Ativos
                    </h3>
                    <Link v-if="hasRoute('institution.teachers')" :href="route('institution.teachers')" style="font-size:0.75rem; color:var(--accent-blue); text-decoration:none;">
                        Ver todos <i class="fas fa-arrow-right"></i>
                    </Link>
                </div>
                <div v-if="topTeachers.length">
                    <div v-for="(teacher, idx) in topTeachers" :key="teacher.id"
                         style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem 0; border-bottom:1px solid var(--border);">
                        <div :style="{
                            width:'28px', height:'28px', borderRadius:'50%', display:'flex',
                            alignItems:'center', justifyContent:'center', fontWeight:'700',
                            fontSize:'0.75rem', flexShrink:0,
                            background: idx === 0 ? 'var(--accent-yellow)' : idx === 1 ? '#d1d5db' : idx === 2 ? '#cd7f32' : 'var(--bg-light)',
                            color: idx < 3 ? 'white' : 'var(--text-secondary)'
                        }">{{ idx + 1 }}</div>
                        <div style="flex:1; min-width:0;">
                            <p style="font-size:0.875rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ teacher.name }}</p>
                            <p style="font-size:0.7rem; color:var(--text-secondary);">{{ teacher.total_activities }} atividade{{ teacher.total_activities !== 1 ? 's' : '' }}</p>
                        </div>
                        <span class="badge badge-blue">{{ teacher.total_activities }}</span>
                    </div>
                </div>
                <p v-else style="color:var(--text-secondary); font-size:0.875rem;">Nenhum professor cadastrado ainda.</p>
            </div>

            <!-- Acesso Rápido -->
            <div class="card">
                <h3 style="font-size:1rem; font-weight:700; margin-bottom:1.25rem;">
                    <i class="fas fa-bolt" style="color:var(--accent-yellow);"></i> Acesso Rápido
                </h3>
                <div style="display:flex; flex-direction:column; gap:0.75rem;">
                    <Link v-if="hasRoute('institution.teachers')" :href="route('institution.teachers')"
                          style="display:flex; align-items:center; gap:1rem; padding:0.875rem 1rem; border-radius:var(--radius-md); background:var(--bg-light); text-decoration:none; color:var(--text-primary); transition:var(--transition);"
                          onmouseover="this.style.background='rgba(59,130,246,0.08)'" onmouseout="this.style.background='var(--bg-light)'">
                        <div style="width:36px; height:36px; background:rgba(59,130,246,0.1); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center;">
                            <i class="fas fa-chalkboard-teacher" style="color:var(--accent-blue);"></i>
                        </div>
                        <div>
                            <p style="font-weight:600; font-size:0.875rem;">Gerenciar Professores</p>
                            <p style="font-size:0.75rem; color:var(--text-secondary);">{{ totalTeachers }} professores cadastrados</p>
                        </div>
                        <i class="fas fa-chevron-right" style="margin-left:auto; color:var(--text-light); font-size:0.75rem;"></i>
                    </Link>

                    <Link v-if="hasRoute('institution.students')" :href="route('institution.students')"
                          style="display:flex; align-items:center; gap:1rem; padding:0.875rem 1rem; border-radius:var(--radius-md); background:var(--bg-light); text-decoration:none; color:var(--text-primary); transition:var(--transition);"
                          onmouseover="this.style.background='rgba(16,185,129,0.08)'" onmouseout="this.style.background='var(--bg-light)'">
                        <div style="width:36px; height:36px; background:rgba(16,185,129,0.1); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center;">
                            <i class="fas fa-user-graduate" style="color:var(--accent-green);"></i>
                        </div>
                        <div>
                            <p style="font-weight:600; font-size:0.875rem;">Gerenciar Alunos</p>
                            <p style="font-size:0.75rem; color:var(--text-secondary);">{{ totalStudents }} alunos cadastrados</p>
                        </div>
                        <i class="fas fa-chevron-right" style="margin-left:auto; color:var(--text-light); font-size:0.75rem;"></i>
                    </Link>

                    <Link v-if="hasRoute('institution.screenings')" :href="route('institution.screenings')"
                          style="display:flex; align-items:center; gap:1rem; padding:0.875rem 1rem; border-radius:var(--radius-md); background:var(--bg-light); text-decoration:none; color:var(--text-primary); transition:var(--transition);"
                          onmouseover="this.style.background='rgba(239,68,68,0.08)'" onmouseout="this.style.background='var(--bg-light)'">
                        <div style="width:36px; height:36px; background:rgba(239,68,68,0.1); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center;">
                            <i class="fas fa-clipboard-check" style="color:var(--accent-red);"></i>
                        </div>
                        <div>
                            <p style="font-weight:600; font-size:0.875rem;">Ver Triagens</p>
                            <p style="font-size:0.75rem; color:var(--text-secondary);">{{ totalScreenings }} triagens realizadas</p>
                        </div>
                        <i class="fas fa-chevron-right" style="margin-left:auto; color:var(--text-light); font-size:0.75rem;"></i>
                    </Link>

                    <Link v-if="hasRoute('institution.reports')" :href="route('institution.reports')"
                          style="display:flex; align-items:center; gap:1rem; padding:0.875rem 1rem; border-radius:var(--radius-md); background:var(--bg-light); text-decoration:none; color:var(--text-primary); transition:var(--transition);"
                          onmouseover="this.style.background='rgba(139,92,246,0.08)'" onmouseout="this.style.background='var(--bg-light)'">
                        <div style="width:36px; height:36px; background:rgba(139,92,246,0.1); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center;">
                            <i class="fas fa-chart-bar" style="color:var(--accent-purple);"></i>
                        </div>
                        <div>
                            <p style="font-weight:600; font-size:0.875rem;">Relatórios Completos</p>
                            <p style="font-size:0.75rem; color:var(--text-secondary);">Métricas detalhadas da plataforma</p>
                        </div>
                        <i class="fas fa-chevron-right" style="margin-left:auto; color:var(--text-light); font-size:0.75rem;"></i>
                    </Link>
                </div>
            </div>
        </div>

        <!-- Sobre a Plataforma -->
        <div class="card" style="background:var(--bg-light); border:none;">
            <div style="display:flex; align-items:flex-start; gap:1rem; flex-wrap:wrap;">
                <div style="flex:1; min-width:200px;">
                    <h3 style="font-size:0.9rem; font-weight:700; color:var(--primary); margin-bottom:0.5rem;">
                        <i class="fas fa-info-circle"></i> Sobre o EducAdapta
                    </h3>
                    <p style="font-size:0.8rem; color:var(--text-secondary); line-height:1.6;">
                        Plataforma de inclusão educacional que usa Inteligência Artificial para adaptar atividades automaticamente
                        ao perfil de cada aluno com necessidades especiais — tornando a educação inclusiva escalável e acessível.
                    </p>
                </div>
                <div style="display:flex; gap:1rem; flex-wrap:wrap;">
                    <div style="text-align:center; padding:0.75rem 1.25rem; background:white; border-radius:var(--radius-md); min-width:90px;">
                        <div style="font-size:1.25rem; font-weight:700; color:var(--accent-blue);">IA</div>
                        <div style="font-size:0.7rem; color:var(--text-secondary);">Adaptação</div>
                    </div>
                    <div style="text-align:center; padding:0.75rem 1.25rem; background:white; border-radius:var(--radius-md); min-width:90px;">
                        <div style="font-size:1.25rem; font-weight:700; color:var(--accent-green);">NEE</div>
                        <div style="font-size:0.7rem; color:var(--text-secondary);">Inclusão</div>
                    </div>
                    <div style="text-align:center; padding:0.75rem 1.25rem; background:white; border-radius:var(--radius-md); min-width:90px;">
                        <div style="font-size:1.25rem; font-weight:700; color:var(--accent-purple);">360°</div>
                        <div style="font-size:0.7rem; color:var(--text-secondary);">Visão</div>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>
