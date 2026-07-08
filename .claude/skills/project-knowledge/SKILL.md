---
    name: project-knowledge
    description: Use quando precisar consultar a documentação, referências técnicas, contexto de produto, arquitetura ou regras operacionais deste repositório antes de implementar, revisar ou planejar mudanças.
    ---

    # Base de Conhecimento do Projeto

    Use esta skill para consultar a documentação canônica do projeto em pt_BR.

    ## Ordem de leitura

    1. `docs/README.md`
    2. `docs/project/overview.md`
    3. `docs/architecture/overview.md`
    4. `docs/guides/development.md`
    5. `docs/guides/commits.md`
    6. `docs/guides/releases.md`
    7. `docs/references/README.md`
    8. `docs/knowledge-base.generated.md`

    ## Regras

    - A fonte canônica é a pasta `docs/`.
    - Não duplique documentação longa em arquivos específicos de agente.
    - Consulte `docs/references/README.md` antes de alterar código que dependa de AdonisJS ou Lucid.
    - Consulte `docs/guides/commits.md` antes de criar commits.
    - Se adicionar, remover ou renomear documentação, execute `node ace docs:sync`.
