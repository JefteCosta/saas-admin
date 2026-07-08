# Guia de Commits

Consulte este documento antes de criar commits ou alterar configuração relacionada a commits.

Este repositório usa commitlint para validar a convenção de commits.

## Fluxo obrigatório

- Leia as regras antes de commitar:

```bash
npx commitlint --print-config json
```

- Valide a mensagem antes de usá-la:

```bash
printf '%s' "<mensagem>" | npx commitlint
```

Código de saída `0` significa que a mensagem é válida.

## Falhas no hook

Se o hook `commit-msg` rejeitar um commit, corrija as regras citadas entre colchetes, como `[subject-case]`, e tente novamente.

Nunca use `git commit --no-verify`.
