# Arquitetura de Banco de Dados

Consulte este documento antes de alterar migrations, schemas ou comportamento de modelo de dados.

## Estado atual

- **Banco**: SQLite (desenvolvimento via better-sqlite3).
- **ORM**: Lucid (AdonisJS).

## Tabelas

| Tabela | Descrição |
| --- | --- |
| `users` | Usuários do sistema (email, senha, role_id) |
| `roles` | Papéis reutilizáveis (owner, admin, member, viewer) |
| `features` | Páginas/funcionalidades cadastradas (slug, nome, ícone, rota, grupo) |
| `role_features` | Pivot: quais features uma role pode acessar |
| `teams` | Grupos de usuários com uma role associada |
| `team_members` | Pivot: quais usuários pertencem a um team |

## Diagrama de relacionamentos

```
users ──── belongsTo ──── roles
users ──── manyToMany ──── teams (via team_members)
roles ──── manyToMany ──── features (via role_features)
teams ──── belongsTo ──── roles
```

## Seeds

O seeder principal (`database/seeders/main_seeder.ts`) cria:
- 4 roles: owner, admin, member, viewer
- 9 features: home, profile, users, roles, teams, features, features.create, features.edit, settings
- Permissões: admin acessa tudo exceto features.create/edit; member acessa home e profile
- Usuário owner: jefteamorim@gmail.com

## Diretrizes

- Use migrations para mudanças estruturais.
- Mantenha models alinhados com migrations.
- Use `node ace migration:fresh && node ace db:seed` para resetar o banco.
- Consulte referências de Lucid em `docs/references/lucid/`.
- Registre decisões importantes em `docs/planning/decisions.md`.
