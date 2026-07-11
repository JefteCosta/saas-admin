# Frontend — Mapa de Componentes

> Arquivo gerado automaticamente por `node ace graph:generate`. Não edite manualmente.

## Diagrama

```mermaid
flowchart TB
  subgraph Layouts
    L_auth["auth"]
    L_default["default"]
  end
  subgraph Pages
    inertia_pages_admin_features_vue["features"]
    inertia_pages_admin_roles_vue["roles"]
    inertia_pages_admin_teams_vue["teams"]
    inertia_pages_admin_users_vue["users"]
    inertia_pages_auth_login_vue["login"]
    inertia_pages_auth_register_vue["register"]
    inertia_pages_errors_not_found_vue["not_found"]
    inertia_pages_errors_server_error_vue["server_error"]
    inertia_pages_home_vue["home"]
    inertia_pages_placeholder_vue["placeholder"]
    inertia_pages_profile_vue["profile"]
    inertia_pages_workspace_vue["workspace"]
  end
  subgraph Components
    C_app_sidebar["app_sidebar"]
    C_nav_main["nav_main"]
    C_nav_projects["nav_projects"]
    C_nav_user["nav_user"]
    C_site_footer["site_footer"]
    C_site_header["site_header"]
    C_team_switcher["team_switcher"]
  end
```

## Tabela de Frontend

| Nome | Tipo | Path | Props | Composables | Layout |
| --- | --- | --- | --- | --- | --- |
| features | page | inertia/pages/admin/features.vue | - | useForm | - |
| roles | page | inertia/pages/admin/roles.vue | - | useForm, router | - |
| teams | page | inertia/pages/admin/teams.vue | - | useForm, router | - |
| users | page | inertia/pages/admin/users.vue | - | router | - |
| login | page | inertia/pages/auth/login.vue | class | usePage | Auth |
| register | page | inertia/pages/auth/register.vue | class | usePage | Auth |
| not_found | page | inertia/pages/errors/not_found.vue | - | - | - |
| server_error | page | inertia/pages/errors/server_error.vue | - | - | - |
| home | page | inertia/pages/home.vue | - | - | - |
| placeholder | page | inertia/pages/placeholder.vue | featureName, featureDescription | - | - |
| profile | page | inertia/pages/profile.vue | - | usePage, useForm | - |
| workspace | page | inertia/pages/workspace.vue | - | - | Auth |
| app_sidebar | component | inertia/components/app_sidebar.vue | - | usePage | - |
| nav_main | component | inertia/components/nav_main.vue | moduleTitle, moduleIcon, moduleIconClass, groups | usePage | - |
| nav_projects | component | inertia/components/nav_projects.vue | - | - | - |
| nav_user | component | inertia/components/nav_user.vue | - | - | - |
| site_footer | component | inertia/components/site_footer.vue | - | - | - |
| site_header | component | inertia/components/site_header.vue | - | usePage, router | - |
| team_switcher | component | inertia/components/team_switcher.vue | - | - | - |
| auth | layout | inertia/layouts/auth.vue | - | - | - |
| default | layout | inertia/layouts/default.vue | - | - | - |
