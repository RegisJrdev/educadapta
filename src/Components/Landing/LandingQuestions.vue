<script setup>
const questions = [
    { title: 'O que posso experimentar na demonstração?', answer: 'Você pode navegar pelos cinco perfis, preparar uma adaptação de exemplo, concluir atividades, organizar acompanhamentos e explorar os painéis. Os dados são fictícios e a adaptação usa um modelo demonstrativo, sem executar inteligência artificial.' },
    { title: 'A plataforma substitui o professor ou o especialista?', answer: 'O EducAdapta foi pensado para apoiar o trabalho da equipe. A escolha das estratégias, a revisão das atividades e as decisões sobre o acompanhamento continuam com os profissionais.' },
    { title: 'As adaptações são iguais para todos os alunos?', answer: 'A proposta é considerar as necessidades e preferências de cada aluno. Na demonstração, você pode explorar perfis de adaptação e comparar abordagens ilustrativas para o mesmo conteúdo.' },
    { title: 'Preciso criar uma conta para explorar?', answer: 'Não. A demonstração permite escolher um perfil e navegar livremente. Use apenas dados fictícios: esse ambiente foi preparado para conhecer os fluxos da plataforma.' },
];
</script>

<template>
    <section class="edu-faq edu-wrap" aria-labelledby="faq-title">
        <div class="edu-faq-heading"><h2 id="faq-title">Vale saber.</h2><p>Respostas para explorar o EducAdapta com clareza.</p></div>
        <div class="edu-faq-list">
            <details v-for="question in questions" :key="question.title"><summary>{{ question.title }}<span class="edu-faq-plus" aria-hidden="true">+</span></summary><p>{{ question.answer }}</p></details>
        </div>
    </section>
</template>
