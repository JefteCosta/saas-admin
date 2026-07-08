# Plano de Testes da UI shadcn-vue

Consulte este documento para entender a correção dos testes de UI do AdonisJS com Inertia, Vite e shadcn-vue.

## Objetivo

Corrigir o fluxo de `npm run test` para executar testes reais de UI e reduzir o ruído causado pelo Vite ao inicializar a aplicação sem testes.

## Mudanças planejadas

- Habilitar os plugins de browser do Japa em `tests/bootstrap.ts`.
- Criar testes browser para home, login, signup e navegação básica do layout.
- Usar os componentes shadcn-vue já instalados nas páginas de login e cadastro.
- Preservar rotas, controllers, contratos HTTP e aliases existentes.
- Remover duplicidade local do utilitário `cn`, mantendo `~/lib/utils` como origem canônica.

## Critérios de aceitação

- `npm run test` executa testes e não retorna `NO TESTS EXECUTED`.
- `npm run typecheck` passa.
- `npm run build` passa.
- `npm run docs:check` passa após sincronizar a documentação.

## Referências

- `docs/references/adonisjs/guides/testing/browser_tests.md`
- `docs/references/adonisjs/guides/frontend/inertia.md`
- `docs/architecture/frontend.md`
