// Deterministic demonstration: no external service or inference about diagnoses.
const formats = [
    { label: 'Sequência visual', tasks: ['Separe o conteúdo em três quadros.', 'Desenhe uma ideia em cada quadro e escreva uma legenda.', 'Use setas para mostrar a relação entre as ideias.'] },
    { label: 'Missões curtas', tasks: ['Leia uma parte do conteúdo e marque quando terminar.', 'Escolha uma informação e explique com uma frase.', 'Faça uma pausa e confira sua resposta no texto.'] },
    { label: 'Exemplo concreto', tasks: ['Encontre uma situação do dia a dia relacionada ao conteúdo.', 'Represente essa situação com objetos ou um desenho.', 'Explique como sua representação se relaciona com o texto.'] },
    { label: 'Roteiro guiado', tasks: ['Primeiro: identifique o assunto da atividade.', 'Depois: encontre duas informações no texto.', 'Por último: use essas informações para responder à proposta.'] },
    { label: 'Explicação oral', tasks: ['Leia o conteúdo em voz alta ou peça que alguém leia com você.', 'Explique uma ideia por vez com suas palavras.', 'Registre sua resposta por escrito ou por um desenho.'] },
    { label: 'Cartões de ideias', tasks: ['Escreva uma informação do texto em cada cartão.', 'Organize os cartões por assunto ou sequência.', 'Escolha um cartão e explique por que ele é importante.'] },
    { label: 'Associação de ideias', tasks: ['Escolha três palavras importantes do conteúdo.', 'Ligue cada palavra a um desenho ou a uma explicação.', 'Use uma das associações para responder à proposta.'] },
    { label: 'Perguntas orientadoras', tasks: ['Qual é o assunto do texto?', 'Que informação ajuda a resolver a atividade?', 'Como você pode mostrar o que aprendeu?'] },
    { label: 'Complete e confira', tasks: ['Complete: “O assunto desta atividade é ___”.', 'Complete: “Uma informação que encontrei foi ___”.', 'Responda à proposta e volte ao texto para conferir.'] },
    { label: 'Pequena história', tasks: ['Imagine uma situação que use uma ideia do conteúdo.', 'Conte essa situação em três momentos.', 'Finalize explicando o que sua história mostra sobre o assunto.'] },
];
const waterTasks = [
    ['Desenhe o Sol aquecendo a água. Escreva: evaporação.', 'Desenhe o vapor formando gotinhas nas nuvens. Escreva: condensação.', 'Desenhe a chuva caindo. Escreva: precipitação. Ligue os desenhos com setas.'],
    ['Missão 1: encontre no texto o nome da etapa em que a água vira vapor.', 'Missão 2: marque a etapa em que o vapor forma gotinhas.', 'Missão 3: diga o nome da etapa em que a água cai como chuva. Confira uma missão por vez.'],
    ['Pense numa roupa molhada secando no varal. A água evapora.', 'Represente com algodão as nuvens e com bolinhas de papel as gotas.', 'Organize sua representação: água vira vapor, forma gotinhas e volta como chuva.'],
    ['Primeiro: complete “Com o calor, a água passa para o ar como ___”.', 'Depois: complete “O vapor esfria e forma pequenas ___ nas nuvens”.', 'Por último: complete “As gotas caem como ___”. Use: vapor, gotas, chuva.'],
    ['Conte em voz alta: “O Sol aquece a água e ela vira vapor”.', 'Continue: “O vapor esfria e forma gotinhas nas nuvens”.', 'Termine: “As gotas caem como chuva”. Agora diga os nomes das três etapas.'],
    ['Faça três cartões: chuva, evaporação e condensação.', 'Coloque os cartões na ordem do ciclo, começando pela água aquecida pelo Sol.', 'Acrescente uma frase a cada cartão: o que acontece com a água nessa etapa?'],
    ['Ligue evaporação à descrição “A água passa para o ar como vapor”.', 'Ligue condensação à descrição “O vapor forma pequenas gotas”.', 'Ligue precipitação à descrição “A água cai das nuvens”. Faça um desenho para cada par.'],
    ['O que acontece com a água quando ela é aquecida pelo Sol?', 'Como o vapor participa da formação das nuvens?', 'Como a água das nuvens volta à superfície? Use os nomes das etapas nas respostas.'],
    ['Complete: “Na ___, a água passa para o ar como vapor”.', 'Complete: “Na ___, o vapor esfria e forma gotinhas”.', 'Complete: “Na ___, a água cai das nuvens”. Banco de palavras: precipitação, evaporação, condensação.'],
    ['Imagine uma gotinha num lago. Conte como ela chega ao ar com o calor do Sol.', 'Conte o que acontece quando o vapor esfria e forma gotinhas na nuvem.', 'Termine com a volta da água como chuva. Dê um título à história da gotinha.'],
];
const sensoryTips = {
    visual: 'Use desenhos, setas ou palavras destacadas para apoiar sua resposta.',
    auditivo: 'Leia as instruções em voz alta e explique sua resposta antes de registrá-la.',
    cinestesico: 'Use objetos ou movimentos para representar as ideias antes de responder.',
    misto: 'Combine uma explicação oral com desenhos ou objetos para registrar as ideias.',
};
export function generateDemoAdaptation(data, student) {
    const profile = student.ai_profile || {};
    const index = Math.max(0, (Number(student.id) || 1) - 1) % formats.length;
    const format = formats[index];
    const source = data.file
        ? 'A água aquecida pelo Sol passa para o ar como vapor: evaporação. O vapor esfria e forma gotinhas nas nuvens: condensação. A água volta à superfície como chuva: precipitação.'
        : String(data.content || '').trim();
    const water = /evapora/i.test(source) && /condensa/i.test(source) && /precipita/i.test(source) && /água|agua/i.test(source);
    const tasks = water ? waterTasks[index] : format.tasks;
    const rules = (profile.rules || []).map(rule => rule.rule_description?.trim()).filter(Boolean);
    const pace = profile.complexity_level === 'baixo'
        ? 'Faça uma etapa por vez. Você pode pedir ajuda na leitura e responder com palavras ou desenhos.'
        : profile.complexity_level === 'alto'
            ? 'Depois de responder, justifique suas escolhas usando informações do conteúdo.'
            : 'Siga as etapas no seu ritmo e confira suas respostas ao terminar.';
    const content = [
        'ADAPTAÇÃO DEMONSTRATIVA — SIMULAÇÃO SEM IA',
        `${String(data.title || '').trim()}\nPara ${student.user?.name || 'o aluno'} · ${format.label}`,
        ...(data.file ? ['PDF não é processado nesta demonstração. O conteúdo abaixo é um exemplo sobre o ciclo da água.'] : []),
        `CONTEÚDO DE REFERÊNCIA\n${source}`,
        `SEU ROTEIRO\n${tasks.map((task, i) => `${i + 1}. ${task}`).join('\n\n')}`,
        `APOIO PARA REALIZAR\n${pace}\n${sensoryTips[profile.sensory_preference] || sensoryTips.misto}`,
        ...(rules.length ? [`ESTRATÉGIAS CADASTRADAS\n${rules.map(rule => `• ${rule}`).join('\n')}`] : []),
        'Gerado por modelos e regras locais. O formato demonstrativo varia entre os alunos; os apoios usam o perfil cadastrado. Revise com o professor antes de usar.',
    ].join('\n\n');
    return { content, format: format.label };
}
