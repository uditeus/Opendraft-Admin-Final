
Objetivo
- Deixar a tela `/workspace/:id` igual ao “print 2” no que diz respeito ao layout geral, com:
  - Sidebar padrão à esquerda (já existente no app)
  - Documento central (estilo editor/leitura)
  - Coluna de chat fixa à direita
- A coluna da direita deve ter o chat com a mesma largura do “chat padrão”.

O que você confirmou agora
- “Layout igual ao print”: Somente chat à direita (sem painel com abas).
- “Largura do chat”: Igual ao chat padrão.

Exploração rápida (o que existe hoje e por que não bate com o print)
- `src/pages/workspace/Workspace.tsx` já tem 3 colunas, mas:
  - A largura do chat no Workspace é um número fixo (`WORKSPACE_CHAT_PANEL_WIDTH_PX = 420`).
  - O “chat padrão” (fora do Workspace) não usa esse número: no `ChatApp.tsx` a coluna do chat em layout de conversa usa `max-w-xl` (Tailwind), ou seja, um padrão diferente.
  - O “rodapé” do chat (composer) no Workspace está com `sticky bottom-3` e padding diferente do chat padrão, então a sensação visual fica diferente.

Definição técnica de “mesma largura do chat padrão”
- No código atual, o chat padrão em conversa (quando aparece coluna de chat) usa `max-w-xl`, que equivale a 36rem = 576px.
- Vou alinhar o Workspace a isso, para ficar literalmente “mesma largura”.

Mudanças planejadas (mínimas e focadas)
1) Padronizar a largura do chat do Workspace para bater com o chat padrão
Arquivo: `src/pages/workspace/Workspace.tsx`
- Remover o `WORKSPACE_CHAT_PANEL_WIDTH_PX = 420` (ou deixar de usar).
- Trocar o `<aside>` do chat para usar uma largura equivalente ao padrão:
  - Opção recomendada: aplicar `className="w-full max-w-xl"` e forçar um width fixo quando houver espaço (desktop), por exemplo `w-[576px]` em telas grandes.
  - Também garantir `shrink-0` para não “espremer” quando o documento crescer.
- Resultado: chat da direita com a mesma largura do chat padrão (576px).

2) Fazer o “rodapé” do chat (composer) ficar com o mesmo comportamento visual do padrão
Arquivo: `src/pages/workspace/Workspace.tsx`
- Ajustar o container do composer para seguir o mesmo padrão do `ChatApp.tsx` (onde o composer fica com blur/gradiente e espaçamento consistente):
  - Usar `sticky bottom-0` (em vez de `bottom-3`) e um pequeno gradiente acima, igual ao padrão.
  - Ajustar paddings para ficar idêntico visualmente (margem interna e distância da borda).

3) Ajustes finos de alinhamento para ficar “print 2”
Arquivo: `src/pages/workspace/Workspace.tsx`
- Manter documento centralizado, mas calibrar:
  - Espaçamentos laterais e padding do Card (o print tem mais “ar” no centro).
  - Separador vertical entre documento e chat (o print mostra uma linha bem discreta).
- Não vou adicionar abas/painel de “Resources”, pois você confirmou “Somente chat à direita”.

Critérios de aceite (o que você deve ver)
1) Em `/workspace/:id`, o chat fica fixo na direita com a mesma largura do chat padrão.
2) O campo “Pergunte algo” (composer) fica com a mesma sensação visual do padrão (sticky + blur/gradiente e espaçamentos).
3) Sidebar esquerda continua empurrando o layout quando abre/fecha (sem quebrar alinhamento de documento/chat).
4) O centro (documento) permanece centralizado e o layout geral bate com o print 2 no “shape” (colunas, respiros e separadores).

Como testar (passo a passo)
- Acesse `/workspace/:id` (você já está nela).
- Compare a largura do chat com a tela padrão de conversa (fora do Workspace):
  - O chat deve ter a mesma largura e não “trocar” entre telas.
- Abra/feche a sidebar e confirme que:
  - Documento e chat são empurrados juntos.
  - Nada sobrepõe o painel direito.
- Role o chat: o composer deve continuar acessível e com o mesmo comportamento do padrão.

Arquivos que vou modificar na implementação
- `src/pages/workspace/Workspace.tsx` (principal: largura do chat e acabamento do composer/separadores)

Observação (importante para ficar realmente “exatamente igual”)
- O print 2 também tem elementos (breadcrumbs, Publish, painel com tabs) que não fazem parte do seu escopo aprovado agora (“somente chat”). Se depois você quiser 1:1 completo (incluindo breadcrumb/publish/tabs), isso vira uma segunda etapa.
