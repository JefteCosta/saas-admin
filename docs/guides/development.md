# Guia de Desenvolvimento

Consulte este documento antes de executar ou alterar o fluxo de desenvolvimento local.

## Requisitos

- Node.js >= 24.0.0
- npm

## Comandos principais

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento (HMR)
npm run dev

# Build de produção
npm run build

# Lint
npm run lint

# Typecheck
npm run typecheck

# Testes
npm test

# Sincronizar base de conhecimento
node ace docs:sync
node ace docs:sync --check
```

## Diretrizes

- Prefira convenções existentes do projeto.
- Mantenha mudanças restritas ao comportamento solicitado.
- Leia `docs/architecture/overview.md` antes de alterar estrutura.
- Leia `docs/guides/multi-tenant-local-operations.md` para setup e validação local por subdomínio.
- Leia `docs/guides/testing.md` antes de adicionar ou alterar testes.
- Leia `docs/guides/commits.md` antes de commitar.
