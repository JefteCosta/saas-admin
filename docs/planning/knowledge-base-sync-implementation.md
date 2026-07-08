# Implementação da Base de Conhecimento

Consulte este documento quando precisar saber o que foi implementado para documentação, agentes e sincronização.

## O que foi feito

- Criada uma estrutura de documentação em pt_BR dentro de `docs/`.
- Criado o manifesto gerado `docs/knowledge-base.generated.md`.
- Criado o comando Ace `docs:sync` em `commands/sync_knowledge_base.js`.
- Criado o entrypoint `ace` para executar `node ace docs:sync`.
- Atualizados os scripts npm `docs:sync` e `docs:check`.
- Criados arquivos de entrada para Codex, Claude, Gemini, GitHub Copilot e Kiro.
- Criadas skills `project-knowledge` para agentes locais e Claude.
- Criada a GitHub Action `docs-sync` para manter a base sincronizada.

## Como usar

```bash
node ace docs:sync
node ace docs:sync --check
```

Ou via npm:

```bash
npm run docs:sync
npm run docs:check
```

## Observações

- A documentação oficial AdonisJS/Lucid deve ser colocada em `docs/references/`.
- Depois de adicionar ou remover documentos, rode `node ace docs:sync`.
- O comando ignora `.DS_Store` e indexa apenas arquivos Markdown.
