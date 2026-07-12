# Instruções do GitHub Copilot

      Use pt_BR para explicações, comentários de documentação e respostas textuais neste repositório.

      Antes de sugerir mudanças, considere a documentação central:

      1. `docs/README.md`
    2. `docs/project/overview.md`
    3. `docs/architecture/overview.md`
    4. `docs/guides/development.md`
    5. `docs/guides/commits.md`
    6. `docs/guides/releases.md`
    7. `docs/references/README.md`
    8. `docs/knowledge-base.generated.md`
    9. `docs/graph/index.generated.md`

      Regras principais:

      - A fonte canônica de contexto é `docs/`.
      - Consulte `docs/references/README.md` para referências AdonisJS e Lucid.
      - Siga os padrões existentes de AdonisJS, Vue, Inertia e Vite.
      - Siga a convenção de commits em `docs/guides/commits.md`.
      - Para trabalho especializado, use os perfis em `.github/agents/` e siga
        `docs/agents/multi-agent.md`.
      - Preserve mudanças locais existentes e não atribua o mesmo arquivo a agentes diferentes.
