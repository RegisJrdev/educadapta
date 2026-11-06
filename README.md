# EducAdapta — demonstração interativa

Projeto independente em **Vue 3 + Vite** com API **PHP + SQLite**, extraído das telas do EducAdapta original. Os perfis e fluxos demonstrativos usam dados fictícios compartilhados pelo backend.

## Executar

Pré-requisitos: Node.js 22 LTS (mínimo técnico: 20.19), PHP 8.1+ e extensão PDO SQLite.

```sh
npm ci
```

Em um terminal, inicie a API:

```sh
EDUCADAPTA_DB_PATH=backend/storage/demo.sqlite php -S 127.0.0.1:8000 backend/public/index.php
```

Em outro terminal, na mesma pasta, inicie o frontend:

```sh
npm run dev
```

Abra o endereço indicado pelo Vite. Ele encaminha `/api` ao servidor PHP. A página inicial apresenta a plataforma; `/demo` permite escolher um dos cinco perfis. As URLs dos painéis também podem ser abertas diretamente.

Para outras pessoas na mesma rede, no terminal 1 use:

```sh
EDUCADAPTA_DB_PATH=backend/storage/demo.sqlite php -S 0.0.0.0:8000 backend/public/index.php
```

No terminal 2, use:

```sh
npm run dev -- --host 0.0.0.0
```

Abra `http://<IP-do-computador>:5173` nos outros dispositivos. A demo não tem login; mantenha apenas dados fictícios.

```sh
npm test
npm run build
php backend/tests/api.php
```

O build gera a pasta `dist`. O frontend mantém um modo local de contingência se o PHP estiver indisponível; nesse modo, as alterações não são compartilhadas.

## Hospedagem

O frontend precisa ficar no mesmo domínio da API PHP ou usar um proxy para `/api`. O arquivo `vercel.json` só fornece fallback de SPA; publicar apenas o `dist` na Vercel não executa esta API nem compartilha o SQLite. Para a apresentação com várias pessoas, hospede PHP e SQLite em um servidor com armazenamento persistente.

## O que apresentar

| Perfil | Telas e interações |
| --- | --- |
| Professor | Painel, turmas, atividades, simulação de adaptação com prévia, triagem em etapas e mensagens |
| Aluno | Painel, leitura e conclusão de atividades, XP, conquistas, agenda e mensagens |
| Psicólogo | Painel, alunos, cadastro de sessões e mensagens |
| Psicopedagogo | Painel, alunos, edição dos perfis de adaptação, planos e mensagens |
| Instituição | Indicadores, professores, alunos, filtros de triagem e exemplo de relatório para impressão/PDF |

Roteiro sugerido para a apresentação:

1. Na página inicial, clique em **Explorar os perfis**.
2. Entre como **Professor**, abra **Adaptar Atividade**, preencha título e conteúdo e selecione Lucas Silva. Revise e crie a adaptação de exemplo.
3. Clique em **Sair** no menu e escolha o perfil **Aluno**. Confira e conclua a atividade; veja a atualização de XP.
4. Explore **Psicopedagogo** para mostrar o perfil de adaptação e os planos.
5. Explore **Psicólogo** para mostrar alunos e agendar uma sessão de exemplo.
6. Termine em **Instituição**, mostrando indicadores, triagens e relatórios.

Use **Reiniciar demo** na tela de escolha de perfis para restaurar os dados iniciais compartilhados. A confirmação avisa que isso também apaga as alterações dos outros visitantes.

## Limites da demonstração

- Todos os nomes, contatos, atividades e informações de acompanhamento são fictícios.
- Não existe autenticação real. O visitante escolhe livremente o perfil e qualquer pessoa com acesso à demo pode alterar os dados fictícios compartilhados ou reiniciá-los.
- Cadastros, mensagens, conclusões, sessões, planos e perfis ficam em um único estado JSON no SQLite do servidor. Atualizações concorrentes usam revisão para impedir que uma gravação antiga sobrescreva outra.
- As alterações de outros visitantes aparecem ao recarregar a página; não há atualização em tempo real.
- A adaptação usa um modelo fixo e **não executa IA**. Anexar um PDF demonstra a seleção e a prévia do arquivo; seu conteúdo não é extraído. Use texto para demonstrar conteúdo próprio.
- As conquistas iniciais são ilustrativas; concluir atividades atualiza XP e nível, sem implementar todo o motor de conquistas do backend.
- Triagens e resultados são ilustrativos, sem finalidade diagnóstica.
- Os relatórios mostram um resumo demonstrativo com indicadores do SQLite. O botão de impressão permite usar **Salvar como PDF** no navegador; os oito relatórios especializados do produto não são implementados.
- A tipografia e os ícones usam Google Fonts e Font Awesome via CDN, como no projeto original; precisam de internet para carregar. Imagens e logotipo estão no próprio projeto.

## Análise e extração

O sistema original utiliza Laravel/PHP no servidor e Vue com Inertia no frontend. As rotas e os controllers fornecem os dados das páginas, validam formulários, acessam o banco e executam a integração de IA. Copiar apenas os arquivos Vue ou o build do Laravel não produziria um site navegável independente.

Nesta versão:

- As páginas públicas e as áreas dos cinco perfis foram copiadas de `resources/js/Pages`, preservando seus layouts e CSS.
- As telas de autenticação foram substituídas por uma seleção de perfis para facilitar a apresentação.
- As dependências de Inertia/Ziggy foram substituídas por um adaptador local de navegação, formulários e rotas.
- Os dados dos controllers foram substituídos por dados fictícios relacionados entre si.
- As imagens públicas foram copiadas e a referência ausente `/images/logo.png` passou a usar uma cópia do `llogo.png` original.
- Foram adicionados controles para trocar o perfil e reiniciar o estado, além de ajustes de navegação para celular.
- O backend novo é uma API PHP pequena, sem Laravel/Composer; o banco SQLite é criado na primeira requisição e fica em `backend/storage/demo.sqlite` por padrão.

O projeto Laravel original permanece separado e sem alterações.

## Arquivos principais

- `src/Pages`, `src/Layouts`, `src/Components`: telas e componentes extraídos.
- `src/style.css`: CSS original.
- `src/demo.css`: apresentação da demo e ajustes responsivos.
- `src/demo/data.js`: dados fictícios e propriedades das telas.
- `src/demo/actions.js`: validação e ações demonstrativas.
- `src/demo/navigation.js`: navegação, sincronização SQLite e modo local de contingência.
- `backend/public/index.php`: API PHP/SQLite do estado demonstrativo.
- `backend/tests/api.php`: teste HTTP do backend, incluindo conflito de revisão.
- `src/demo/routes.js`: URLs e mapeamento de telas.
- `vercel.json`: configuração de publicação estática.

Para mudar os exemplos iniciais, edite `src/demo/data.js` e clique em **Reiniciar demo** para substituir o estado compartilhado.

## Novo sistema React

O sistema interno agora é servido pelo projeto [react-app](react-app/README.md), com React, TypeScript, shadcn/ui e Bento Grid da Aceternity (21st.dev). A landing original continua em Vue na rota `/`. Execute `npm run dev` para acessar os dois no mesmo servidor. Use `npm run dev:react` para trabalhar apenas no novo projeto.
