# Guia de Releases e Versionamento

Consulte este documento antes de alterar o fluxo de release, o versionamento ou a automação de CI/CD.

## Visão geral

O projeto automatiza versionamento, changelog e publicação de releases com o [release-please](https://github.com/googleapis/release-please) do Google, dirigido por [Conventional Commits](https://www.conventionalcommits.org). Os workflows ficam em `.github/workflows/`.

## Workflows do GitHub Actions

### CI (`.github/workflows/ci.yml`)

- Dispara em `pull_request` e em `push` na `main`.
- Passos: `npm ci`, geração do `APP_KEY` (`cp .env.example .env` + `node ace generate:key`) e `npm run lint`, `npm run typecheck`, `npm test`.

### release-please (`.github/workflows/release-please.yml`)

- Dispara em `push` na `main`.
- Mantém um **Release PR** (`chore(main): release X.Y.Z`) com a próxima versão e o changelog, com base nos commits convencionais.
- Ao fazer o merge do Release PR: cria a tag `vX.Y.Z`, o GitHub Release, atualiza o `CHANGELOG.md` e bumpa a versão no `package.json`.
- Autentica com o `GITHUB_TOKEN` nativo (sem PAT).

## Configuração do release-please

Arquivos na raiz do repositório:

- `release-please-config.json` — configuração (modo manifest).
- `.release-please-manifest.json` — versão atual de cada pacote.

Pontos principais da configuração:

- `release-type: node` — atualiza `package.json`/`package-lock.json` e mantém o `CHANGELOG.md`.
- `initial-version: 0.1.0` — a primeira release sai como `0.1.0`. Sem isso, o release-please usaria `1.0.0` por padrão.
- `changelog-sections` — seções do changelog em pt_BR (ver abaixo).
- `pull-request-header` / `pull-request-footer` — textos do corpo do Release PR em pt_BR.

## Versionamento (SemVer)

A partir de `0.1.0`, seguindo SemVer padrão:

- `fix:` → patch (ex.: `0.1.1`)
- `feat:` → minor (ex.: `0.2.0`)
- `feat!:` ou rodapé `BREAKING CHANGE:` → major (ex.: `1.0.0`)

Não edite a versão no `package.json` manualmente; o release-please é a fonte da verdade.

## Changelog

Seções exibidas, em pt_BR:

| Tipo de commit | Seção |
| --- | --- |
| `feat` | ✨ Funcionalidades |
| `fix` | 🐛 Correções |
| `perf` | ⚡ Performance |
| `refactor` | ♻️ Refatorações |
| `docs` | 📝 Documentação |

Os tipos `build`, `ci`, `chore`, `style` e `test` ficam ocultos no changelog.

## Notificação no Slack

Quando o release-please cria ou atualiza o Release PR (`prs_created == true`), o workflow envia uma mensagem ao canal **#changelog** com a versão proposta e o link do PR.

- Usa um **Incoming Webhook** do Slack via secret `SLACK_WEBHOOK_URL`.
- O passo só dispara quando o Release PR muda (evita ruído em pushes que não afetam o release).
- Se o secret não estiver configurado, o passo é pulado sem falhar o workflow.

## Pré-requisitos no repositório

- Em *Settings → Actions → General → Workflow permissions*: marcar **"Read and write permissions"** e **"Allow GitHub Actions to create and approve pull requests"** (necessário para o release-please abrir o Release PR).
- Secret `SLACK_WEBHOOK_URL` para a notificação no Slack.

## Fluxo de release (passo a passo)

1. Faça merge de mudanças na `main` usando Conventional Commits.
2. O release-please abre ou atualiza o Release PR com a próxima versão e o changelog.
3. Uma mensagem é enviada ao canal **#changelog**.
4. Faça o merge do Release PR para publicar: tag `vX.Y.Z` + GitHub Release + bump do `package.json`.

## Diretrizes

- A execução dos testes no hook `pre-commit` (`npm test`) depende de `forceExit: true` em `adonisrc.ts`, que garante que o runner do Japa encerre o processo. Não reverta essa flag sem um substituto que evite o travamento.
- Ao adicionar novos tipos de commit relevantes para o changelog, atualize `changelog-sections` em `release-please-config.json`.
