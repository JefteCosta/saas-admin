# Arquitetura Frontend

Consulte este documento antes de alterar páginas Inertia, layouts, componentes frontend ou convenções de UI.

## Estado atual

- **Framework**: Vue 3 com Inertia.js.
- **Build**: Vite.
- **UI**: shadcn-vue (reka-ui + Tailwind CSS v4).
- **Ícones**: Lucide Vue (`@lucide/vue`).

## Layouts

| Layout | Uso |
| --- | --- |
| `default` | Páginas autenticadas (sidebar + header) |
| `auth` | Telas de login/signup (centralizado) |

## Páginas

| Página | Rota | Descrição |
| --- | --- | --- |
| `home.vue` | `/` | Página inicial (protegida) |
| `profile.vue` | `/profile` | Perfil do usuário com edição de nome |
| `auth/login.vue` | `/login` | Login |
| `auth/register.vue` | `/signup` | Signup |

## Componentes principais

| Componente | Função |
| --- | --- |
| `app_sidebar.vue` | Sidebar dinâmica montada a partir dos shared props (menu) |
| `nav_main.vue` | Grupo de itens de navegação com ícones e links Inertia |
| `nav_user.vue` | Dropdown de usuário no footer da sidebar |
| `site_header.vue` | Header com breadcrumbs, toggle dark mode e dropdown de perfil |
| `team_switcher.vue` | Seletor de team (sidebar header) |

## Composables

| Composable | Função |
| --- | --- |
| `useTheme` | Gerencia dark mode (light/dark/system) com persistência em localStorage |

## Shared Props (Inertia)

O `inertia_middleware` compartilha:

```typescript
{
  user: { id, fullName, email, initials, createdAt, updatedAt },
  menu: [{ group: string, items: [{ slug, name, icon, route }] }],
  flash: { error, success },
  errors: { ... },
}
```

## Resolução de ícones

O `app_sidebar.vue` usa um mapa estático para resolver nomes de ícones (strings do banco) em componentes Lucide:

```typescript
const iconMap: Record<string, LucideIcon> = {
  Home, User, Users, UsersRound, Shield, Layers, Settings, Plus, Pencil,
}
```

Ao adicionar novas features com ícones diferentes, inclua o ícone neste mapa.

## Diretrizes

- Prefira componentes e padrões já existentes.
- Use `npx shadcn-vue@latest add <componente>` para adicionar novos componentes UI.
- Mantenha páginas focadas em composição.
- Coloque comportamento reutilizável em composables.
- Use cores semânticas (bg-primary, text-muted-foreground), nunca valores crus.
