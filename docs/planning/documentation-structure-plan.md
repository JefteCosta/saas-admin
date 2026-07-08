# Plano de Estrutura de Documentação Multiagente

Consulte este documento quando precisar entender o plano aprovado para organizar a documentação consumida por humanos e agentes de IA.

## Resumo

Adotar `docs/` como pasta principal da documentação do projeto. Arquivos de agente na raiz, como `AGENTS.md`, `CLAUDE.md` e `GEMINI.md`, devem ser curtos e funcionar como índices para a documentação central.

## Estrutura definida

```text
docs/
  project/
  planning/
  architecture/
  guides/
  references/
  agents/
```

## Regras

- `docs/project/`: visão de produto, contexto e glossário.
- `docs/planning/`: planos, roadmap, backlog e decisões.
- `docs/architecture/`: arquitetura técnica, backend, frontend e banco de dados.
- `docs/guides/`: guias operacionais de desenvolvimento, testes, commits e deploy.
- `docs/references/`: documentação externa de referência, como AdonisJS e Lucid.
- `docs/agents/`: instruções específicas para agentes.

## Critérios de aceite

- Um agente deve conseguir começar por `AGENTS.md` e chegar à documentação central.
- Regras importantes não devem existir apenas em arquivos específicos de agente.
- `README.md` deve continuar sendo uma introdução curta e apontar para `docs/README.md`.
