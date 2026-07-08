# Decisões de Planejamento

Consulte este documento ao registrar decisões de produto ou planejamento que devem ser lembradas depois.

## Decisões

### Usar `docs/` como raiz da documentação

- Data: 2026-06-27
- Decisão: manter documentação durável em `docs/`.
- Motivo: `docs/` é uma convenção comum em repositórios e é fácil de descobrir por humanos e agentes de IA.
- Consequência: arquivos de agente na raiz devem apontar para `docs/`, sem duplicar documentação longa.

### Manter documentação em pt_BR

- Data: 2026-06-27
- Decisão: manter documentação autoral, instruções de agentes e base de conhecimento em pt_BR.
- Motivo: alinhar a documentação ao idioma operacional do projeto.
- Consequência: novas referências adicionadas em outro idioma devem ser traduzidas ou acompanhadas de versão em pt_BR.

### Automatizar releases com release-please e Conventional Commits

- Data: 2026-06-28
- Decisão: usar o release-please (modo manifest, `release-type: node`) dirigido por Conventional Commits para versionamento, changelog e publicação, com um workflow de CI rodando lint, typecheck e testes.
- Motivo: gerar versões e changelog de forma consistente a partir dos commits, sem versionamento manual.
- Consequência: a versão no `package.json` passa a ser gerenciada pelo release-please; mudanças de release são feitas via `release-please-config.json` e `.release-please-manifest.json`. Detalhes em [Guia de releases e versionamento](../guides/releases.md).

### Versionar em SemVer começando em 0.1.0

- Data: 2026-06-28
- Decisão: definir `initial-version: 0.1.0` e seguir SemVer padrão (`fix`→patch, `feat`→minor, breaking change→major).
- Motivo: o projeto começa em 0.0.0; sem `initial-version` o release-please proporia `1.0.0` na primeira release. Queremos contar `feat`/`fix` a partir de `0.1.0` e reservar `1.0.0` para um breaking change.
- Consequência: a primeira release é `0.1.0`; breaking changes promovem para `1.0.0`.

### Notificar releases no Slack (#changelog)

- Data: 2026-06-28
- Decisão: notificar o canal `#changelog` via Incoming Webhook (`SLACK_WEBHOOK_URL`) quando o release-please cria ou atualiza o Release PR.
- Motivo: dar visibilidade às novas versões propostas.
- Consequência: o repositório precisa do secret `SLACK_WEBHOOK_URL`; sem ele, a notificação é pulada sem falhar o workflow.

### Posicionar o projeto como boilerplate SaaS Admin

- Data: 2026-07-08
- Decisão: o projeto é um sistema de exemplo de aplicação SaaS multi-tenant, não um produto de domínio específico.
- Motivo: o objetivo é fornecer uma fundação reutilizável para construir qualquer aplicação SaaS.
- Consequência: a documentação e os módulos devem ser genéricos e extensíveis; funcionalidades de domínio específico (monitoria, e-commerce, CRM) ficam fora do escopo.
