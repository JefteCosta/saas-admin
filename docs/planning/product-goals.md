# Metas do Produto

Consulte este documento ao planejar entregas do boilerplate SaaS Admin.

## Norte do produto

Construir um sistema de exemplo de aplicação SaaS multi-tenant que sirva como ponto de partida para novos projetos. O boilerplate deve demonstrar padrões reais e reutilizáveis para autenticação, multi-tenancy, RBAC, limites de plano, administração e UI moderna.

## Resultado esperado

Um desenvolvedor deve conseguir clonar este repositório e ter uma base funcional para construir qualquer aplicação SaaS, com autenticação, gerenciamento de usuários, isolamento de tenants e painel administrativo já implementados.

## Metas por horizonte

### Meta 1: Fundação SaaS

Objetivo: base funcional com autenticação, multi-tenancy e gerenciamento de usuários.

Entregáveis:

- Cadastro, login e sessão de usuário.
- Tenant como unidade de isolamento.
- Usuários vinculados a um tenant (membership).
- Perfis iniciais: owner, admin e member.
- Limites configuráveis por plano.
- Tela administrativa para consultar tenants e status.

Critérios de aceite:

- Um owner consegue criar e configurar o tenant.
- Um admin consegue convidar usuários até o limite do plano.
- Um usuário acessa apenas dados do próprio tenant.
- O sistema bloqueia criação acima dos limites configurados.

### Meta 2: Painel administrativo completo

Objetivo: interface administrativa com CRUD de entidades e visualização de dados.

Entregáveis:

- Dashboard com métricas básicas.
- CRUD de usuários com busca e filtros.
- Gerenciamento de papéis e permissões.
- Configurações do tenant (nome, logo, plano).
- Navegação com sidebar, breadcrumbs e notificações.

### Meta 3: Recursos avançados de SaaS

Objetivo: funcionalidades típicas de SaaS maduro.

Entregáveis:

- Sistema de planos e billing (mockado/demonstrativo).
- Onboarding de novos tenants.
- Convites por e-mail.
- Configurações de conta do usuário (perfil, senha, preferências).
- Logs de auditoria.

### Meta 4: Extensibilidade e documentação

Objetivo: facilitar a customização e extensão por outros desenvolvedores.

Entregáveis:

- Documentação de como adicionar novos módulos.
- Exemplos de CRUD genérico.
- Guia de deploy.
- Testes automatizados como referência.
- Theming e customização de UI.

## Metas fora do escopo

- Funcionalidades de domínio específico (monitoria, e-commerce, CRM, etc.).
- Integrações com serviços externos reais (pagamento, e-mail transacional).
- Deploy e infraestrutura de produção.

## Métricas de sucesso

- Tempo para um desenvolvedor ter o ambiente rodando localmente.
- Clareza da documentação para extensão.
- Cobertura de testes dos fluxos base.
- Facilidade de adicionar novos módulos sobre a base existente.
