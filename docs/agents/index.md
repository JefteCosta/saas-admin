# Guia de Agentes

Consulte este documento quando um agente de IA precisar entender como usar a documentação do projeto.

## Ordem compartilhada de leitura

1. `docs/README.md`
2. `docs/project/overview.md`
3. `docs/architecture/overview.md`
4. `docs/guides/development.md`
5. `docs/guides/commits.md`
6. `docs/guides/releases.md`
7. `docs/references/README.md`
8. `docs/knowledge-base.generated.md`

## Regras

- Mantenha arquivos de agente na raiz curtos.
- Coloque conhecimento compartilhado em `docs/`.
- Não duplique instruções longas entre `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, Copilot ou Kiro.
- Ao adicionar conhecimento durável, escolha a seção mais específica em `docs/`.

## Trabalho multiagente

O Codex deste repositório permite delegar subtarefas independentes a subagentes. Consulte o
[guia de trabalho multiagente](multi-agent.md) antes de dividir uma tarefa.

Os perfis específicos de cada ferramenta estão nas notas do [Codex](codex.md),
[Claude](claude.md), [Kiro](kiro.md), [Gemini](gemini.md) e [GitHub Copilot](copilot.md).
