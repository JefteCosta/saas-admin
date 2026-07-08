# Plano de Sincronização da Base de Conhecimento

Consulte este documento quando precisar entender o plano aprovado para manter agentes, skills e manifesto documental sincronizados.

## Resumo

Manter a documentação em pt_BR e criar uma camada única de base de conhecimento consumida por Kiro, GitHub Copilot, Claude, Codex e Gemini.

## Implementação definida

- A fonte canônica é `docs/`.
- O manifesto gerado é `docs/knowledge-base.generated.md`.
- A sincronização roda pelo comando Ace `node ace docs:sync`.
- A validação roda por `node ace docs:sync --check`.
- Os scripts npm `docs:sync` e `docs:check` chamam o comando Ace.
- A GitHub Action `docs-sync` executa a sincronização e commita atualizações geradas quando necessário.

## Agentes cobertos

- Codex e agentes compatíveis: `AGENTS.md` e `.agents/skills/project-knowledge/SKILL.md`.
- Claude: `CLAUDE.md` e `.claude/skills/project-knowledge/SKILL.md`.
- Gemini: `GEMINI.md`.
- GitHub Copilot: `.github/copilot-instructions.md` e `.github/instructions/docs.instructions.md`.
- Kiro: `.kiro/README.md` e `.kiro/steering/`.

## Critérios de aceite

- `node ace docs:sync --check` deve passar sem diff pendente.
- Novos documentos Markdown em `docs/` devem aparecer no manifesto gerado.
- Arquivos não documentais, como `.DS_Store` e binários, não devem entrar nos índices.
