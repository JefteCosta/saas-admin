# shadcn-vue

Consulte este documento ao adicionar, buscar ou configurar componentes de UI no projeto.

## Configuração do projeto

O projeto usa shadcn-vue com a seguinte configuração (`components.json`):

| Campo | Valor |
| --- | --- |
| Style | `reka-nova` |
| Base color | `mist` |
| Ícones | `lucide` (`@lucide/vue`) |
| TypeScript | `true` |
| Tailwind CSS | v4 com variáveis CSS |
| Aliases | `~/components`, `~/lib/utils`, `~/components/ui`, `~/lib`, `~/composables` |
| Diretório UI | `inertia/components/ui/` |

## Componentes instalados

Avatar, Breadcrumb, Button, Card, Collapsible, Dropdown Menu, Empty, Field, Input, Label, Separator, Sheet, Sidebar, Skeleton, Tooltip.

## Como instalar novos componentes

Use o CLI com o runner do projeto (npm):

```bash
# Adicionar um componente
npx shadcn-vue@latest add <componente>

# Adicionar múltiplos componentes
npx shadcn-vue@latest add dialog table tabs

# Adicionar todos os componentes
npx shadcn-vue@latest add --all

# Sobrescrever componente existente
npx shadcn-vue@latest add button --overwrite
```

### Buscar componentes disponíveis

```bash
# Listar todos os componentes disponíveis
npx shadcn-vue@latest search @shadcn

# Buscar por nome
npx shadcn-vue@latest search @shadcn -q "table"

# Ver detalhes de um componente
npx shadcn-vue@latest view @shadcn/dialog

# Ver documentação
npx shadcn-vue@latest docs dialog button
```

### Ver informações do projeto

```bash
npx shadcn-vue@latest info
```

## MCP Server (para agentes de IA)

O shadcn-vue inclui um servidor MCP que permite que assistentes de IA busquem, visualizem e instalem componentes.

### Iniciar o MCP

```bash
shadcn-vue mcp        # iniciar o servidor MCP (stdio)
shadcn-vue mcp init   # gerar config para o editor
```

### Tools disponíveis no MCP

| Tool | Descrição | Input |
| --- | --- | --- |
| `shadcn_vue:get_project_registries` | Lista registries do `components.json` | nenhum |
| `shadcn_vue:list_items_in_registries` | Lista todos os itens de registries | `registries[]` |
| `shadcn_vue:search_items_in_registries` | Busca fuzzy em registries | `registries[]`, `query` |
| `shadcn_vue:view_items_in_registries` | Detalhes de itens (incluindo código) | `items[]` (ex: `["@shadcn/button"]`) |
| `shadcn_vue:get_item_examples_from_registries` | Exemplos de uso com código | `registries[]`, `query` |
| `shadcn_vue:get_add_command_for_items` | Retorna o comando de instalação | `items[]` |
| `shadcn_vue:get_audit_checklist` | Checklist de verificação de componentes | nenhum |

### Registries customizados

Registries adicionais são configurados em `components.json`:

```json
{
  "registries": {
    "@acme": "https://acme.com/r/{name}.json"
  }
}
```

O registry `@shadcn` é sempre disponível por padrão.

## Diretrizes de uso

1. **Use componentes existentes primeiro.** Busque no registry antes de criar UI customizada.
2. **Componha, não reinvente.** Combine componentes existentes para interfaces complexas.
3. **Use variantes built-in.** `variant="outline"`, `size="sm"`, etc.
4. **Use cores semânticas.** `bg-primary`, `text-muted-foreground` — nunca valores crus como `bg-blue-500`.
5. **Nunca baixe arquivos manualmente.** O CLI resolve registry, paths e CSS automaticamente.
6. **Use `cn()` para classes condicionais.** Não use ternários manuais em templates.
