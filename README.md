# EducAdapta — demonstração estática

Projeto independente em **Vue 3 + Vite**, extraído das telas do EducAdapta original. Pronto para publicar como site estático na Vercel. Não precisa de PHP, Laravel, banco de dados, login ou variáveis de ambiente.

## Executar

Use Node.js 22 LTS ou superior (mínimo técnico: 20.19).

```sh
cd educadapta-demo
npm ci
npm run dev
```

Abra o endereço indicado pelo Vite. A página inicial apresenta a plataforma; `/demo` permite escolher um dos cinco perfis. As URLs dos painéis também podem ser abertas diretamente.

```sh
npm test
npm run build
npm run preview
```

O build gera a pasta `dist`. Os testes verificam as ações locais e renderizam todas as telas Vue com os dados demonstrativos. A renderização automatizada não substitui uma revisão visual no navegador.

## Publicar na Vercel

1. Envie este projeto para um repositório Git. Você pode copiar **apenas a pasta `educadapta-demo`** para um repositório independente, sem `node_modules` e `dist`, ou mantê-la dentro do repositório existente.
2. Importe o repositório na Vercel.
3. Em **Root Directory**, selecione `educadapta-demo` se estiver no repositório original. Se copiou o conteúdo desta pasta para a raiz de outro repositório, mantenha a raiz.
4. Use **Framework Preset: Vite**, **Install Command: npm ci**, **Build Command: npm run build** e **Output Directory: dist**. Use Node.js 22 ou superior nas configurações do projeto.
5. Publique. Não cadastre variáveis de ambiente nem copie o `.env` do Laravel.

O `vercel.json` já inclui o fallback para `index.html`, necessário para abrir ou atualizar diretamente URLs como `/teacher/dashboard`. Referência: [Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite).

Esta entrega prepara os arquivos; não cria um projeto nem executa um deploy na sua conta Vercel.

## O que apresentar

| Perfil | Telas e interações |
| --- | --- |
| Professor | Painel, turmas, atividades, simulação de adaptação com prévia, triagem em etapas e mensagens |
| Aluno | Painel, leitura e conclusão de atividades, XP, conquistas, agenda e mensagens |
| Psicólogo | Painel, alunos, cadastro local de sessões e mensagens |
| Psicopedagogo | Painel, alunos, edição local dos perfis de adaptação, planos e mensagens |
| Instituição | Indicadores, professores, alunos, filtros de triagem e exemplo de relatório para impressão/PDF |

Roteiro sugerido para a apresentação:

1. Na página inicial, clique em **Explorar os perfis**.
2. Entre como **Professor**, abra **Adaptar Atividade**, preencha título e conteúdo e selecione Lucas Silva. Revise e crie a adaptação de exemplo.
3. Use o seletor no topo para mudar para **Aluno**. Confira e conclua a atividade; veja a atualização de XP.
4. Explore **Psicopedagogo** para mostrar o perfil de adaptação e os planos.
5. Explore **Psicólogo** para mostrar alunos e agendar uma sessão de exemplo.
6. Termine em **Instituição**, mostrando indicadores, triagens e relatórios.

Use **Reiniciar demo** a qualquer momento para restaurar os dados iniciais. Os dados são compartilhados entre os perfis dentro do mesmo navegador, permitindo demonstrar o fluxo entre profissionais e aluno.

## Limites da demonstração

- Todos os nomes, contatos, atividades e informações de acompanhamento são fictícios.
- Não existe autenticação real. O visitante escolhe livremente o perfil.
- Cadastros, mensagens, conclusões, sessões, planos e perfis ficam no `localStorage` do navegador. Não são enviados a outras pessoas ou dispositivos. Se o navegador bloquear o armazenamento, a demo funciona em memória e mostra um aviso.
- A adaptação usa um modelo fixo e **não executa IA**. Anexar um PDF demonstra a seleção e a prévia do arquivo; seu conteúdo não é extraído. Use texto para demonstrar conteúdo próprio.
- As conquistas iniciais são ilustrativas; concluir atividades atualiza XP e nível, sem implementar todo o motor de conquistas do backend.
- Triagens e resultados são ilustrativos, sem finalidade diagnóstica.
- Os relatórios mostram um resumo demonstrativo com indicadores locais. O botão de impressão permite usar **Salvar como PDF** no navegador; os oito relatórios especializados do produto não são implementados.
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
- Nenhum arquivo PHP, credencial, `.env`, banco ou arquivo privado de `storage` é necessário ou foi copiado.

O projeto Laravel original permanece separado e sem alterações.

## Arquivos principais

- `src/Pages`, `src/Layouts`, `src/Components`: telas e componentes extraídos.
- `src/style.css`: CSS original.
- `src/demo.css`: apresentação da demo e ajustes responsivos.
- `src/demo/data.js`: dados fictícios e propriedades das telas.
- `src/demo/actions.js`: validação e ações demonstrativas.
- `src/demo/navigation.js`: navegação e persistência local.
- `src/demo/routes.js`: URLs e mapeamento de telas.
- `vercel.json`: configuração de publicação estática.

Para mudar os exemplos, edite `src/demo/data.js` e clique em **Reiniciar demo** no navegador para substituir o estado salvo anteriormente.
