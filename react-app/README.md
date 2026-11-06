# EducAdapta · Sistema React

Novo projeto do sistema interno em React + TypeScript + Vite. A landing page Vue existente permanece na raiz do repositório, com o mesmo conteúdo e visual. O servidor principal escolhe a landing em `/` e o sistema React nas demais rotas.

## Executar

Na raiz do repositório:

```sh
npm install
npm run dev
```

- `/`: landing original
- `/demo`: seleção dos cinco perfis em React
- `/teacher/dashboard`: painel do professor
- `/student/dashboard`: espaço do aluno
- `/psychologist/dashboard`: painel do psicólogo
- `/psychopedagogue/dashboard`: painel do psicopedagogo
- `/institution/dashboard`: painel institucional

Para desenvolver somente o novo projeto, use `npm run dev:react`. Nesse servidor separado, `/` abre a seleção de perfis. O projeto usa os dados e regras compartilhados em `../src/demo` e não deve ser movido isoladamente.

## Interface

A paleta, fonte, logotipo e preferência de tema são os do EducAdapta original: azul `#1558c9`, lima `#d4ff24`, superfícies escuras `#030407` / `#101722` e versão clara original. O tema segue a chave existente `educadapta-theme`.

- **shadcn/ui**: Button, Input, Dialog e Tabs obtidos do registry oficial, com Radix e Tailwind CSS. `components.json` mantém a configuração para futuras adições.
- **21st.dev / Aceternity**: Bento Grid na seleção de perfis, obtido do registry oficial da Aceternity. Referência: https://21st.dev/@manuarora700/components/bento-grid
- **Lucide**: ícones.
- **Recharts**: gráficos baseados nos registros reais da demonstração.

As telas ocupam a altura útil do dispositivo (`100dvh`), com navegação e ações fixas e rolagem interna para conteúdo longo. Painéis e relatórios dividem o conteúdo em abas. As tabelas ajustam a quantidade de linhas por página à altura disponível e respondem ao redimensionamento da janela. Também há busca global, filtros, exportação CSV, diálogos acessíveis e feedback das ações.

## Dados e ações

O projeto reaproveita `src/demo/data.js`, `actions.js` e `validation.js`, a chave local `educadapta-demo-v1` e a API PHP/SQLite `/api/state`. A integração usa revisão para resolver gravações concorrentes. Sem API disponível na inicialização, a demonstração usa os dados do navegador. Falhas de escrita remota não confirmam alterações não salvas.

Atividades, mensagens, conclusão com XP, triagens com as 30 perguntas originais, sessões, planos e perfis de adaptação permanecem funcionais. O ambiente continua demonstrativo: a IA não é executada, PDFs não são processados, os dados são fictícios e triagens não constituem diagnóstico. A seleção de perfis não é autenticação.

## Verificar

```sh
npm test
npm run build
npm run build:react
```

`npm test` inclui os testes existentes e os testes React de renderização dos cinco perfis, restauração/persistência, validação, XP idempotente, concorrência e falhas de gravação. Os testes de renderização no servidor não substituem a inspeção visual e a interação no navegador.

O build principal gera `dist/` com landing + sistema. O build React gera `react-app/dist/` com o sistema separado. Para publicar o build separado, o host precisa retornar `index.html` para as rotas internas e expor `/api` se desejar persistência compartilhada.
