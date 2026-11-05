# Roteiro da apresentação: o ciclo de criação de um software

**Data:** sexta-feira, 06/11/2026
**Público:** estudantes do 2º ano do Ensino Médio, Colégio Crescer, Parnaíba (PI), com professores e coordenação presentes
**Duração:** 50 minutos no total (42 de apresentação + 8 de perguntas)
**Ênfase:** as sprints e a organização dos desenvolvedores na produção do sistema
**Papel do EducAdapta:** exemplo que acompanha a explicação, não o assunto principal

## Visão geral

| # | Fala | Responsável | Tempo | Acumulado |
|---|------|-------------|-------|-----------|
| 1 | Abertura e ideação | Yan | 5 min | 0:05 |
| 2 | Engenharia de requisitos e backlog | Reginaldo Junior | 6 min | 0:11 |
| 3 | Sprints: planejamento, desenvolvimento e dailies | Gabriel | 11 min | 0:22 |
| 4 | Inteligência artificial em geral | Hélio | 8 min | 0:30 |
| 5 | Adaptação e cuidados com dados | Clailton | 6 min | 0:36 |
| 6 | Homologação, lançamento e convite à tecnologia | Augusto | 6 min | 0:42 |
| — | Perguntas | Todos | 8 min | 0:50 |

**Ordem de apresentação:** o bloco de abertura, requisitos e sprints (falas 1 a 3) vem antes da IA (falas 4 e 5), para que a turma entenda como a equipe trabalhou antes de ver o sistema funcionando. A fala 6 fecha com o lançamento e o convite.

---

## Fala 1: Abertura e ideação (Yan, 5 min)

**Objetivo:** prender a atenção e mostrar que software começa com um problema real.

**Conteúdo:**

- Apresentar a equipe e o curso (Análise e Desenvolvimento de Sistemas, UNINASSAU Parnaíba).
- Fazer a pergunta de abertura à turma: "Vocês conhecem alguém que tem dificuldade para acompanhar as atividades da escola?" Esperar algumas respostas.
- Explicar que todo software nasce de um problema observado, não de uma tecnologia escolhida antes.
- Contar o problema que originou o EducAdapta: professores gastam muito tempo preparando exercícios, e adaptar material para quem precisa de apoio raramente cabe na rotina.
- Ideação, em termos simples: gerar ideias, comparar alternativas, descartar o que não resolve o problema e escolher uma direção.

**Transição:** "Uma ideia boa ainda não é um software. O próximo passo é transformar esse problema em requisitos claros."

---

## Fala 2: Engenharia de requisitos e backlog (Reginaldo Junior, 6 min)

**Objetivo:** mostrar como uma vontade vira algo que a equipe consegue construir e testar.

**Conteúdo:**

- Diferenciar requisitos funcionais (o que o sistema faz) e não funcionais (desempenho, segurança, acessibilidade).
- Mostrar como levantar requisitos: conversa com o usuário (no caso, professores), observação e perguntas diretas.
- Apresentar histórias de usuário no formato "Como [tipo de usuário], quero [ação], para [benefício]". Exemplo: "Como professor, quero enviar um PDF e receber exercícios, para economizar tempo de preparação."
- Explicar critérios de aceite: a condição que diz se a história está pronta. Exemplo: "o sistema gera exercícios a partir de um PDF enviado."
- Mostrar o backlog do produto: lista priorizada de todas as histórias. O que está no topo é o que vale mais e vai primeiro.
- Destacar que requisitos mudam, e que isso é normal. A equipe precisa de um jeito de absorver a mudança sem parar tudo.

**Transição:** "Com o backlog pronto, a pergunta passa a ser: o que cabe no próximo ciclo de trabalho? É aí que entram as sprints."

---

## Fala 3: Sprints, planejamento, desenvolvimento e dailies (Gabriel, 11 min)

**Objetivo:** explicar a rotina da equipe dentro das sprints e como os desenvolvedores se organizam para produzir o sistema. Este é o bloco de maior ênfase do roteiro.

**Conteúdo:**

- **O que é sprint:** ciclo curto e fixo de trabalho, normalmente de 1 a 4 semanas, com um objetivo claro ao final.
- **Planejamento da sprint (sprint planning):**
  - Define-se o objetivo da sprint.
  - Escolhem-se histórias do topo do backlog.
  - A equipe estima o esforço de cada uma.
  - Escolhe-se só o que cabe na capacidade do time. Prometer demais é o erro mais comum.
- **Quadro de tarefas:** colunas como "A fazer", "Em andamento", "Em revisão" e "Concluído". Mostrar um exemplo real do EducAdapta, com as histórias que entraram em uma sprint.
- **Organização dos desenvolvedores:**
  - Cada tarefa é quebrada em partes pequenas (criar tela, criar rota da API, escrever teste, integrar com a IA).
  - Cada desenvolvedor pega uma tarefa do quadro e a move para "Em andamento".
  - O trabalho acontece em ramificações separadas (branches), para não mexer direto na versão principal.
  - Antes de juntar o código à versão principal, outro integrante revisa (code review).
- **Daily (reunião diária de 15 minutos, em pé):** cada um responde três perguntas.
  1. O que fiz desde a última daily?
  2. O que vou fazer até a próxima?
  3. Tem algo me impedindo?
  Explicar que a daily não é relatório para o chefe. É para a equipe se alinhar e destravar problemas cedo.
- **Testes dentro da sprint:** uma história só é considerada pronta quando passa nos testes e atende aos critérios de aceite. Esse critério é chamado de "definição de pronto" (Definition of Done). Exemplo: a história "gerar exercícios a partir de um PDF" só fecha depois de um teste confirmar que o PDF foi lido e que os exercícios foram criados.
- **Revisão e retrospectiva:** a revisão mostra o que ficou pronto para o professor avaliar. A retrospectiva discute o que deu certo, o que deu errado e o que mudar na próxima sprint.

**Dica de execução:** mostrar o quadro da sprint com cards reais do projeto. Se não houver tempo ou internet, usar um print.

**Transição:** "Esse é o ritmo de trabalho da equipe. Agora vamos ver a parte de inteligência artificial do sistema."

---

## Fala 4: Inteligência artificial em geral (Hélio, 8 min)

**Objetivo:** explicar, em linguagem acessível, o que é IA e como ela entra no EducAdapta.

**Conteúdo:**

- **O que é IA:** um sistema que aprende padrões com exemplos, em vez de seguir uma lista de regras escrita à mão. Não é uma pessoa nem um banco de respostas prontas.
- **Tipos de IA mais comuns:** modelos que prevem números (como o preço de uma casa) e modelos de linguagem (como o ChatGPT), que trabalham com texto.
- **Como a IA aparece no EducAdapta:** o professor envia um conteúdo em PDF ou texto, o sistema extrai o texto, envia ao modelo com instruções claras (o "prompt") e recebe os exercícios.
- **Por que as instruções importam:** mudar a forma de pedir muda o resultado. Parte do trabalho da equipe foi testar e ajustar essas instruções.
- **A IA erra:** por isso o professor revisa o material antes de usar com a turma.
**Transição:** "A IA gera o material. Mas como ela adapta esse material para quem precisa de apoio? Isso o Clailton explica agora."

---

## Fala 5: Adaptação e cuidados com dados (Clailton, 6 min)

**Objetivo:** mostrar a adaptação de conteúdo e os cuidados éticos e legais no uso da IA.

**Conteúdo:**

- **Adaptação:** explicar que a versão adaptada segue regras cadastradas por especialistas (exemplo: linguagem mais simples, mais passos, mais exemplos). A IA aplica as regras ao conteúdo original.
- Mostrar a comparação entre o material original e a versão adaptada para um estudante que precisa de apoio.
- **Por que isso importa:** a Lei nº 12.764/2012, a Lei nº 13.146/2015 e a Lei nº 14.254/2021 garantem acompanhamento e adaptação para estudantes com necessidades de aprendizagem. A ferramenta tenta tornar isso viável na rotina do professor.
- **Proteção de dados:** explicar a Lei nº 13.709/2018 (LGPD) em linguagem simples. Nenhum dado real de estudante é usado nesta apresentação. São usados apenas conteúdos pedagógicos de uso comum e perfis fictícios.
- **Uso responsável:** a IA apoia o professor e não substitui sua decisão. O professor valida cada material.

**Transição:** "Vimos como a equipe trabalhou e como a IA funciona. Agora falta colocar tudo isso no ar e encerrar."

---

## Fala 6: Homologação, lançamento e convite à tecnologia (Augusto, 6 min)

**Objetivo:** explicar o caminho do código até o usuário final e convidar a turma para o mundo da tecnologia.

**Conteúdo:**

- **Homologação:** os testes técnicos já foram feitos durante a sprint. Na homologação, o professor ou o cliente testa a versão completa, num ambiente parecido com o real, seguindo os critérios de aceite. Se algo falha, o problema volta para o backlog como correção.
- **Lançamento (deploy):** a versão aprovada é colocada no ar, em nuvem. Software não termina no lançamento: é preciso monitorar erros, ouvir usuários e planejar a próxima versão.
- **Caminhos na tecnologia (2 min):** criar, entender e resolver problemas. Nem todo mundo precisa programar para trabalhar com tecnologia.
- **Encerramento:** agradecer, reforçar a pergunta inicial e abrir para perguntas.

**Transição para perguntas:** "Agora é com vocês. Podem perguntar sobre qualquer etapa, sobre o EducAdapta ou sobre o caminho na tecnologia."

---

## Perguntas (8 min)

Perguntas prováveis e quem responde:

- **"Quanto tempo leva para fazer um sistema desses?"** Gabriel. Depende do escopo, e as sprints existem justamente para dar previsibilidade.
- **"Como a equipe se organiza quando alguém não consegue terminar a tarefa?"** Gabriel. A daily identifica o impedimento cedo, e a tarefa pode ser redistribuída na sprint.
- **"A IA não substitui o professor?"** Hélio. A ferramenta gera material de apoio, a decisão de uso é do professor e a validação é humana.
- **"A IA sempre acerta?"** Hélio. Não. Por isso existe revisão humana antes do material chegar à turma.
- **"Quem decide o que o estudante adaptado recebe?"** Clailton. As regras são cadastradas por especialistas, e o professor valida o resultado.
- **"Precisa saber matemática para programar?"** Gabriel. Lógica é mais importante que matemática avançada para a maioria das áreas.
- **"Por onde começar a estudar tecnologia?"** Augusto. Por algo que dê vontade de fazer: um jogo, um site, um problema da escola. Curso, faculdade ou estudo sozinho são caminhos possíveis.

---

## Antes de sexta (checklist)

- [ ] Definir o responsável por cada fala.
- [ ] Confirmar com o professor orientador o formato de 50 minutos.
- [ ] Confirmar com a direção do Colégio Crescer o horário de 50 minutos.
- [ ] Ensaiar com cronômetro. Cada fala deve caber no tempo indicado.
- [ ] Confirmar que nenhum dado real de estudante será citado ou mostrado na apresentação.
