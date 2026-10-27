<script setup>
import { Head, Link } from '@/demo/navigation.js';
import { ref, onMounted, onUnmounted } from 'vue';

const currentSlide = ref(0);
const slides = [
    { image: '/images/carrosel1.jpg', title: 'Aprendizado Personalizado', desc: 'IA que adapta atividades para cada necessidade.' },
    { image: '/images/carrosel2.webp', title: 'Ferramentas para Educadores', desc: 'Adapte atividades e acompanhe o progresso dos alunos.' },
    { image: '/images/carrosel3.jpg', title: 'Tecnologia + Cuidado Humano', desc: 'Psicopedagogos treinam a IA com o perfil de cada aluno.' },
];

let interval;
onMounted(() => { interval = setInterval(() => { currentSlide.value = (currentSlide.value + 1) % slides.length; }, 5000); });
onUnmounted(() => clearInterval(interval));

const mobileMenuOpen = ref(false);
</script>

<template>
    <Head title="EducAdapta - Plataforma de Educação Inclusiva" />

    <!-- Navbar -->
    <nav class="landing-nav">
        <div class="container">
            <Link href="/" style="display: flex; align-items: center; gap: 0.75rem; text-decoration: none; color: white;">
                <img src="/images/logo.png" alt="EducAdapta" style="height: 36px;" />
                <span style="font-weight: 700; font-size: 1.1rem;">EducAdapta</span>
            </Link>
            <ul class="nav-links" :class="{ 'demo-menu-open': mobileMenuOpen }" @click="mobileMenuOpen = false">
                <li><a href="#about">Sobre</a></li>
                <li><a href="#features">Funcionalidades</a></li>
                <li><a href="#how-it-works">Como Funciona</a></li>
                <li><Link :href="route('login')" class="btn btn-primary btn-sm">Explorar demo</Link></li>
            </ul>
            <button aria-label="Abrir menu" :aria-expanded="mobileMenuOpen" class="hamburger" style="display: none;" @click="mobileMenuOpen = !mobileMenuOpen">
                <i class="fas fa-bars"></i>
            </button>
        </div>
    </nav>

    <!-- Hero with Carousel -->
    <section class="hero">
        <div class="container" style="display: flex; align-items: center; gap: 3rem;">
            <div style="flex: 1;" class="fade-in-up">
                <h1>{{ slides[currentSlide].title }}</h1>
                <p>{{ slides[currentSlide].desc }}</p>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <Link :href="route('register')" class="btn btn-primary btn-lg">Explorar os perfis</Link>
                    <a href="#how-it-works" class="btn btn-outline btn-lg" style="border-color: white; color: white;">
                        Saiba Mais
                    </a>
                </div>
                <!-- Dots -->
                <div style="display: flex; gap: 0.5rem; margin-top: 2rem;">
                    <span v-for="(s, i) in slides" :key="i"
                        @click="currentSlide = i"
                        :style="{
                            width: currentSlide === i ? '2rem' : '0.5rem',
                            height: '0.5rem',
                            background: currentSlide === i ? 'var(--accent-yellow)' : 'rgba(255,255,255,0.4)',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }"
                    />
                </div>
            </div>
            <div style="flex: 1; display: flex; justify-content: center;" class="fade-in-up">
                <img :src="slides[currentSlide].image"
                    :alt="slides[currentSlide].title"
                    style="max-width: 100%; height: 320px; object-fit: cover; border-radius: 1rem; box-shadow: 0 20px 40px rgba(0,0,0,0.3); transition: all 0.5s ease;"
                />
            </div>
        </div>
    </section>

    <!-- About -->
    <section id="about" class="section" style="background: var(--bg-white);">
        <div class="container">
            <h2 class="section-title">Sobre o EducAdapta</h2>
            <p class="section-subtitle">Uma plataforma que conecta IA, educadores e profissionais da saúde para adaptar atividades escolares para alunos com transtornos de aprendizagem.</p>
            <div class="grid grid-3">
                <div class="card feature-card">
                    <i class="fas fa-brain"></i>
                    <h3>IA Treinada por Especialistas</h3>
                    <p>Psicopedagogos definem as regras de adaptação para cada aluno, e a IA segue fielmente.</p>
                </div>
                <div class="card feature-card">
                    <i class="fas fa-universal-access"></i>
                    <h3>Inclusão Real</h3>
                    <p>Suporte para dislexia, discalculia, disgrafia, TDAH, TEA e outras necessidades.</p>
                </div>
                <div class="card feature-card">
                    <i class="fas fa-gamepad"></i>
                    <h3>Gamificação</h3>
                    <p>Alunos ganham XP e conquistas ao completar atividades, tornando o aprendizado divertido.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Features -->
    <section id="features" class="section">
        <div class="container">
            <h2 class="section-title">Funcionalidades</h2>
            <p class="section-subtitle">Tudo que você precisa para uma educação verdadeiramente inclusiva.</p>
            <div class="grid grid-4">
                <div class="card feature-card">
                    <i class="fas fa-user-md" style="color: var(--accent-green);"></i>
                    <h3>Perfil IA por Aluno</h3>
                    <p>Psicopedagogos criam perfis detalhados para cada aluno.</p>
                </div>
                <div class="card feature-card">
                    <i class="fas fa-file-alt" style="color: var(--accent-purple);"></i>
                    <h3>Adaptação Automática</h3>
                    <p>Professores enviam atividades e a IA adapta automaticamente.</p>
                </div>
                <div class="card feature-card">
                    <i class="fas fa-comments" style="color: var(--accent-yellow);"></i>
                    <h3>Comunicação em Tempo Real</h3>
                    <p>Chat entre profissionais, professores e famílias.</p>
                </div>
                <div class="card feature-card">
                    <i class="fas fa-chart-line" style="color: var(--accent-red);"></i>
                    <h3>Relatórios e Gráficos</h3>
                    <p>Dashboards com métricas de progresso e engajamento.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- How it Works -->
    <section id="how-it-works" class="section" style="background: var(--primary-dark); color: white;">
        <div class="container">
            <h2 class="section-title" style="color: white;">Como Funciona</h2>
            <p class="section-subtitle" style="color: rgba(255,255,255,0.7);">Pipeline de IA em 4 etapas</p>
            <div class="grid grid-4">
                <div style="text-align: center; padding: 1.5rem;">
                    <div style="width: 60px; height: 60px; background: var(--accent-blue); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.5rem; font-weight: 700;">1</div>
                    <h3 style="font-size: 1rem; margin-bottom: 0.5rem;">Psicopedagoga Cria Perfil</h3>
                    <p style="font-size: 0.8rem; opacity: 0.8;">Define transtornos, regras e preferências do aluno.</p>
                </div>
                <div style="text-align: center; padding: 1.5rem;">
                    <div style="width: 60px; height: 60px; background: var(--accent-green); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.5rem; font-weight: 700;">2</div>
                    <h3 style="font-size: 1rem; margin-bottom: 0.5rem;">Professor Envia Atividade</h3>
                    <p style="font-size: 0.8rem; opacity: 0.8;">Anexa PDF ou texto e seleciona os alunos.</p>
                </div>
                <div style="text-align: center; padding: 1.5rem;">
                    <div style="width: 60px; height: 60px; background: var(--accent-purple); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.5rem; font-weight: 700;">3</div>
                    <h3 style="font-size: 1rem; margin-bottom: 0.5rem;">IA Adapta</h3>
                    <p style="font-size: 0.8rem; opacity: 0.8;">A IA combina perfil + atividade e gera versão personalizada.</p>
                </div>
                <div style="text-align: center; padding: 1.5rem;">
                    <div style="width: 60px; height: 60px; background: var(--accent-yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.5rem; font-weight: 700; color: var(--primary-dark);">4</div>
                    <h3 style="font-size: 1rem; margin-bottom: 0.5rem;">Aluno Recebe</h3>
                    <p style="font-size: 0.8rem; opacity: 0.8;">Recebe a atividade adaptada e ganha XP ao completar!</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer style="background: var(--primary-dark); color: rgba(255,255,255,0.6); padding: 2rem 0; text-align: center; font-size: 0.8rem;">
        <div class="container">
            <p>&copy; {{ new Date().getFullYear() }} EducAdapta. Todos os direitos reservados.</p>
        </div>
    </footer>
</template>
