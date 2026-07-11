import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const HEADER =
  '> Arquivo gerado automaticamente por `node ace graph:generate`. Não edite manualmente.\n'

// --- Helpers ---

function readUtf8(filePath: string): string {
  return readFileSync(join(root, filePath), 'utf8')
}

function listFiles(dir: string, ext: string, recursive = false): string[] {
  const abs = join(root, dir)
  if (!existsSync(abs)) return []
  const results: string[] = []
  for (const entry of readdirSync(abs)) {
    if (entry === '.DS_Store') continue
    const full = join(abs, entry)
    const rel = dir + '/' + entry
    const st = statSync(full)
    if (st.isDirectory() && recursive) {
      results.push(...listFiles(rel, ext, true))
    } else if (st.isFile() && entry.endsWith(ext)) {
      results.push(rel)
    }
  }
  return results.sort()
}

function camelToSnake(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
}

function modelToTable(name: string): string {
  const snake = camelToSnake(name)
  // Pluralização básica pt/en
  if (snake.endsWith('y') && !snake.endsWith('ey')) {
    return snake.slice(0, -1) + 'ies'
  }
  if (snake.endsWith('s') || snake.endsWith('x') || snake.endsWith('sh') || snake.endsWith('ch')) {
    return snake + 'es'
  }
  return snake + 's'
}

// --- Scanner: Models ---

interface ModelInfo {
  name: string
  table: string
  columns: { name: string; type: string }[]
  relations: { type: string; target: string }[]
}

function scanModels(): ModelInfo[] {
  const files = listFiles('app/models', '.ts')
  const models: ModelInfo[] = []

  for (const file of files) {
    const content = readUtf8(file)
    const classMatch = content.match(/export default class (\w+) extends/)
    if (!classMatch) continue

    const name = classMatch[1]
    const table = modelToTable(name)

    const columns: { name: string; type: string }[] = []
    const colRegex = /declare (\w+):\s*([^;\n]+)/g
    let m: RegExpExecArray | null
    while ((m = colRegex.exec(content)) !== null) {
      const colName = m[1]
      const colType = m[2].trim().replace(/\s*\|.*$/, '')
      // Ignorar campos internos e relações (BelongsTo, HasMany, ManyToMany)
      if (colName.startsWith('$')) continue
      if (/BelongsTo|HasMany|ManyToMany/.test(colType)) continue
      columns.push({ name: colName, type: colType })
    }

    const relations: { type: string; target: string }[] = []
    const relRegex = /@(belongsTo|hasMany|manyToMany)\(\(\)\s*=>\s*(\w+)\)/g
    while ((m = relRegex.exec(content)) !== null) {
      relations.push({ type: m[1], target: m[2] })
    }

    models.push({ name, table, columns, relations })
  }

  return models
}

function generateModelsDoc(models: ModelInfo[]): string {
  let mermaid = '```mermaid\nerDiagram\n'

  for (const model of models) {
    mermaid += `  ${model.table} {\n`
    for (const col of model.columns) {
      mermaid += `    ${col.type.replace(/[<>]/g, '')} ${col.name}\n`
    }
    mermaid += '  }\n'
  }

  for (const model of models) {
    for (const rel of model.relations) {
      const targetModel = models.find((m) => m.name === rel.target)
      if (!targetModel) continue
      if (rel.type === 'belongsTo') {
        mermaid += `  ${model.table} }o--|| ${targetModel.table} : "${rel.type}"\n`
      } else if (rel.type === 'hasMany') {
        mermaid += `  ${model.table} ||--o{ ${targetModel.table} : "${rel.type}"\n`
      } else if (rel.type === 'manyToMany') {
        mermaid += `  ${model.table} }o--o{ ${targetModel.table} : "${rel.type}"\n`
      }
    }
  }

  mermaid += '```\n'

  let table = '## Tabela de Models\n\n'
  table += '| Model | Tabela | Colunas | Relações |\n'
  table += '| --- | --- | --- | --- |\n'
  for (const model of models) {
    const cols = model.columns.map((c) => c.name).join(', ')
    const rels = model.relations.map((r) => `${r.type} → ${r.target}`).join(', ')
    table += `| ${model.name} | ${model.table} | ${cols} | ${rels} |\n`
  }

  return `# Models — Diagrama ER\n\n${HEADER}\n## Diagrama\n\n${mermaid}\n${table}`
}

// --- Scanner: Routes ---

interface RouteInfo {
  method: string
  path: string
  controller: string
  action: string
  name: string
  middlewares: string[]
  domain: string
}

function scanRoutes(): RouteInfo[] {
  const content = readUtf8('start/routes.ts')
  const routes: RouteInfo[] = []

  // Extrair rotas com controller
  const routeRegex =
    /router\.(get|post|patch|delete|put)\(\s*'([^']+)'\s*,\s*\[controllers\.(\w+)\s*,\s*'(\w+)'\]\s*\)/g
  let m: RegExpExecArray | null
  while ((m = routeRegex.exec(content)) !== null) {
    routes.push({
      method: m[1].toUpperCase(),
      path: m[2],
      controller: m[3],
      action: m[4],
      name: '',
      middlewares: [],
      domain: 'localhost',
    })
  }

  // Extrair renderInertia inline
  const inertiaRegex =
    /router\.(get|post)\(\s*'([^']+)'\s*,\s*\([^)]*\)\s*=>\s*(?:\{[^}]*\})?\s*(?:inertia\.)?render(?:Inertia)?\(\s*'([^']+)'/g
  while ((m = inertiaRegex.exec(content)) !== null) {
    routes.push({
      method: m[1].toUpperCase(),
      path: m[2],
      controller: 'inline',
      action: `renderInertia('${m[3]}')`,
      name: '',
      middlewares: [],
      domain: 'localhost',
    })
  }

  // Extrair .on('/').renderInertia
  const onRegex = /router\.on\(\s*'([^']+)'\s*\)\.renderInertia\(\s*'([^']+)'/g
  while ((m = onRegex.exec(content)) !== null) {
    routes.push({
      method: 'GET',
      path: m[1],
      controller: 'inline',
      action: `renderInertia('${m[2]}')`,
      name: '',
      middlewares: [],
      domain: 'localhost',
    })
  }

  // Extrair .as('name') e associar à última rota
  const lines = content.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const asMatch = lines[i].match(/\.as\(\s*'([^']+)'\s*\)/)
    if (asMatch) {
      // Encontrar a última rota antes desta linha
      const linesBefore = lines.slice(0, i + 1).join('\n')
      const lastRoute = linesBefore.match(/router\.(get|post|patch|delete|put|on)\([^)]+/g)
      if (lastRoute && routes.length > 0) {
        // Associar pelo path — encontra a rota correspondente na mesma linha
        const pathMatch = lines[i].match(/router\.\w+\(\s*'([^']+)'/)
        const onMatch = lines[i].match(/router\.on\(\s*'([^']+)'/)
        const targetPath = pathMatch?.[1] || onMatch?.[1]
        if (targetPath) {
          const route = routes.find((r) => r.path === targetPath && !r.name)
          if (route) route.name = asMatch[1]
        }
      }
    }
  }

  // Detectar domínios baseado em grupos
  const adminBlock = content.indexOf('.domain(`admin.')
  const tenantBlock = content.indexOf('.domain(`:tenant.')
  if (adminBlock > -1 || tenantBlock > -1) {
    // Simplificação: marcar por contexto baseado no nome da rota
    for (const route of routes) {
      if (route.name.startsWith('admin.')) route.domain = 'admin'
      else if (route.name.startsWith('tenant.')) route.domain = 'tenant'
    }
  }

  return routes
}

function generateRoutesDoc(routes: RouteInfo[]): string {
  let mermaid = '```mermaid\nflowchart LR\n'

  const groups = new Map<string, RouteInfo[]>()
  for (const route of routes) {
    const group = route.domain || 'localhost'
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group)!.push(route)
  }

  for (const [group, groupRoutes] of groups) {
    mermaid += `  subgraph ${group}\n`
    for (const route of groupRoutes.slice(0, 20)) {
      const id = (route.name || route.path).replace(/[^a-zA-Z0-9]/g, '_')
      mermaid += `    ${id}["${route.method} ${route.path}"]\n`
    }
    mermaid += '  end\n'
  }

  mermaid += '```\n'

  let table = '## Tabela de Rotas\n\n'
  table += '| Método | Path | Controller | Action | Nome | Domínio |\n'
  table += '| --- | --- | --- | --- | --- | --- |\n'
  for (const route of routes) {
    table += `| ${route.method} | ${route.path} | ${route.controller} | ${route.action} | ${route.name || '-'} | ${route.domain} |\n`
  }

  return `# Routes — Mapa de Rotas\n\n${HEADER}\n## Diagrama\n\n${mermaid}\n${table}`
}

// --- Scanner: Controllers ---

interface ControllerInfo {
  name: string
  methods: string[]
  models: string[]
  pages: string[]
  flashMessages: string[]
}

function scanControllers(): ControllerInfo[] {
  const files = listFiles('app/controllers', '.ts')
  const controllers: ControllerInfo[] = []

  for (const file of files) {
    const content = readUtf8(file)
    const classMatch = content.match(/export default class (\w+)/)
    if (!classMatch) continue

    const name = classMatch[1]

    const methods: string[] = []
    const methodRegex = /async (\w+)\s*\(\s*\{/g
    let m: RegExpExecArray | null
    while ((m = methodRegex.exec(content)) !== null) {
      methods.push(m[1])
    }

    const models: string[] = []
    const modelRegex = /import \w+ from '#models\/(\w+)'/g
    while ((m = modelRegex.exec(content)) !== null) {
      models.push(m[1])
    }

    const pages: string[] = []
    const pageRegex = /inertia\.render\(\s*'([^']+)'/g
    while ((m = pageRegex.exec(content)) !== null) {
      pages.push(m[1])
    }

    const flashMessages: string[] = []
    const flashRegex = /session\.flash\(\s*'([^']+)'\s*,\s*'([^']+)'/g
    while ((m = flashRegex.exec(content)) !== null) {
      flashMessages.push(`${m[1]}: ${m[2]}`)
    }

    controllers.push({ name, methods, models, pages, flashMessages })
  }

  return controllers
}

function generateControllersDoc(controllers: ControllerInfo[]): string {
  let mermaid = '```mermaid\nclassDiagram\n'

  for (const ctrl of controllers) {
    mermaid += `  class ${ctrl.name} {\n`
    for (const method of ctrl.methods) {
      mermaid += `    +${method}()\n`
    }
    mermaid += '  }\n'
  }

  // Relações com models
  for (const ctrl of controllers) {
    for (const model of ctrl.models) {
      const modelClass = model
        .split('_')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join('')
      mermaid += `  ${ctrl.name} --> ${modelClass} : usa\n`
    }
  }

  mermaid += '```\n'

  let table = '## Tabela de Controllers\n\n'
  table += '| Controller | Métodos | Models | Páginas | Flash |\n'
  table += '| --- | --- | --- | --- | --- |\n'
  for (const ctrl of controllers) {
    table += `| ${ctrl.name} | ${ctrl.methods.join(', ')} | ${ctrl.models.join(', ') || '-'} | ${ctrl.pages.join(', ') || '-'} | ${ctrl.flashMessages.join('; ') || '-'} |\n`
  }

  return `# Controllers — Diagrama de Classes\n\n${HEADER}\n## Diagrama\n\n${mermaid}\n${table}`
}

// --- Scanner: Services & Middleware ---

interface ServiceInfo {
  name: string
  file: string
  type: 'service' | 'middleware'
  imports: string[]
  methods: string[]
}

function scanServices(): ServiceInfo[] {
  const serviceFiles = listFiles('app/services', '.ts')
  const middlewareFiles = listFiles('app/middleware', '.ts')
  const results: ServiceInfo[] = []

  for (const file of [...serviceFiles, ...middlewareFiles]) {
    const content = readUtf8(file)
    const type: 'service' | 'middleware' = file.includes('/middleware/') ? 'middleware' : 'service'

    const classMatch = content.match(/export default class (\w+)/)
    const fnMatch = content.match(/export default function (\w+)/)
    const name = classMatch?.[1] || fnMatch?.[1] || file.split('/').pop()!.replace('.ts', '')

    const imports: string[] = []
    const importRegex = /import \w+ from '#(models|services)\/(\w+)'/g
    let m: RegExpExecArray | null
    while ((m = importRegex.exec(content)) !== null) {
      imports.push(`#${m[1]}/${m[2]}`)
    }

    const methods: string[] = []
    const methodRegex = /(?:async\s+|static\s+(?:async\s+)?)(\w+)\s*\(/g
    while ((m = methodRegex.exec(content)) !== null) {
      if (m[1] !== 'handle' || type === 'middleware') {
        methods.push(m[1])
      }
    }

    results.push({ name, file, type, imports, methods })
  }

  return results
}

function generateServicesDoc(services: ServiceInfo[]): string {
  let mermaid = '```mermaid\nflowchart TB\n'

  for (const svc of services) {
    const id = svc.name.replace(/[^a-zA-Z0-9]/g, '_')
    const shape = svc.type === 'middleware' ? `{{${svc.name}}}` : `[${svc.name}]`
    mermaid += `  ${id}${shape}\n`
  }

  for (const svc of services) {
    const srcId = svc.name.replace(/[^a-zA-Z0-9]/g, '_')
    for (const imp of svc.imports) {
      const targetName = imp.split('/').pop()!
      const targetSvc = services.find((s) => s.file.includes(targetName))
      if (targetSvc) {
        const targetId = targetSvc.name.replace(/[^a-zA-Z0-9]/g, '_')
        mermaid += `  ${srcId} --> ${targetId}\n`
      }
    }
  }

  mermaid += '```\n'

  let table = '## Tabela de Services e Middleware\n\n'
  table += '| Nome | Tipo | Imports | Métodos |\n'
  table += '| --- | --- | --- | --- |\n'
  for (const svc of services) {
    table += `| ${svc.name} | ${svc.type} | ${svc.imports.join(', ') || '-'} | ${svc.methods.join(', ') || '-'} |\n`
  }

  return `# Services & Middleware — Grafo de Dependências\n\n${HEADER}\n## Diagrama\n\n${mermaid}\n${table}`
}

// --- Scanner: Frontend ---

interface FrontendInfo {
  name: string
  path: string
  type: 'page' | 'component' | 'layout'
  imports: string[]
  props: string[]
  composables: string[]
  layout: string | null
}

function scanFrontend(): FrontendInfo[] {
  const pageFiles = listFiles('inertia/pages', '.vue', true)
  const componentFiles = listFiles('inertia/components', '.vue', false)
  const layoutFiles = listFiles('inertia/layouts', '.vue', false)
  const results: FrontendInfo[] = []

  for (const file of [...pageFiles, ...componentFiles, ...layoutFiles]) {
    const content = readUtf8(file)
    const fileName = file.split('/').pop()!.replace('.vue', '')
    let type: 'page' | 'component' | 'layout' = 'component'
    if (file.includes('/pages/')) type = 'page'
    if (file.includes('/layouts/')) type = 'layout'

    // Ignorar componentes de UI (shadcn)
    if (file.includes('/components/ui/')) continue

    const imports: string[] = []
    const importRegex = /import \w+ from ['"]~\/(components|layouts)\/([^'"]+)['"]/g
    let m: RegExpExecArray | null
    while ((m = importRegex.exec(content)) !== null) {
      imports.push(`${m[1]}/${m[2]}`)
    }

    const props: string[] = []
    const propsMatch = content.match(/defineProps<\{([^}]+)\}>/)
    if (propsMatch) {
      const propsContent = propsMatch[1]
      const propRegex = /(\w+)\s*[?:]?\s*:\s*([^;\n]+)/g
      while ((m = propRegex.exec(propsContent)) !== null) {
        props.push(m[1])
      }
    }

    const composables: string[] = []
    if (content.includes('usePage()')) composables.push('usePage')
    if (content.includes('useForm(')) composables.push('useForm')
    if (content.includes('router.')) composables.push('router')

    const layoutMatch = content.match(/layout:\s*(\w+)/)
    const layout = layoutMatch ? layoutMatch[1] : null

    results.push({
      name: fileName,
      path: file,
      type,
      imports,
      props,
      composables,
      layout,
    })
  }

  return results
}

function generateFrontendDoc(items: FrontendInfo[]): string {
  let mermaid = '```mermaid\nflowchart TB\n'

  const pages = items.filter((i) => i.type === 'page')
  const components = items.filter((i) => i.type === 'component')
  const layouts = items.filter((i) => i.type === 'layout')

  if (layouts.length > 0) {
    mermaid += '  subgraph Layouts\n'
    for (const l of layouts) {
      mermaid += `    L_${l.name.replace(/[^a-zA-Z0-9]/g, '_')}["${l.name}"]\n`
    }
    mermaid += '  end\n'
  }

  mermaid += '  subgraph Pages\n'
  for (const p of pages) {
    const id = p.path.replace(/[^a-zA-Z0-9]/g, '_')
    mermaid += `    ${id}["${p.name}"]\n`
  }
  mermaid += '  end\n'

  if (components.length > 0) {
    mermaid += '  subgraph Components\n'
    for (const c of components) {
      mermaid += `    C_${c.name.replace(/[^a-zA-Z0-9]/g, '_')}["${c.name}"]\n`
    }
    mermaid += '  end\n'
  }

  mermaid += '```\n'

  let table = '## Tabela de Frontend\n\n'
  table += '| Nome | Tipo | Path | Props | Composables | Layout |\n'
  table += '| --- | --- | --- | --- | --- | --- |\n'
  for (const item of items) {
    table += `| ${item.name} | ${item.type} | ${item.path} | ${item.props.join(', ') || '-'} | ${item.composables.join(', ') || '-'} | ${item.layout || '-'} |\n`
  }

  return `# Frontend — Mapa de Componentes\n\n${HEADER}\n## Diagrama\n\n${mermaid}\n${table}`
}

// --- Scanner: Permissions ---

interface PermissionInfo {
  modules: { slug: string; name: string }[]
  groups: { slug: string; name: string; module: string }[]
  features: { slug: string; name: string; group: string; route: string }[]
  roles: { slug: string; name: string; description: string }[]
  bouncerRules: string[]
}

function scanPermissions(): PermissionInfo {
  const info: PermissionInfo = {
    modules: [],
    groups: [],
    features: [],
    roles: [],
    bouncerRules: [],
  }

  // Parse seeder
  const seederPath = 'database/seeders/main_seeder.ts'
  if (existsSync(join(root, seederPath))) {
    const content = readUtf8(seederPath)

    // Módulos
    const moduleRegex = /\{\s*slug:\s*'([^']+)'\s*,\s*name:\s*'([^']+)'/g
    let m: RegExpExecArray | null
    const moduleSection = content.match(/Module\.updateOrCreateMany[^[]*\[([^\]]+)\]/s)
    if (moduleSection) {
      while ((m = moduleRegex.exec(moduleSection[1])) !== null) {
        info.modules.push({ slug: m[1], name: m[2] })
      }
    }

    // Roles
    const roleSection = content.match(/Role\.updateOrCreateMany[^[]*\[([^\]]+)\]/s)
    if (roleSection) {
      const roleRegex =
        /\{\s*slug:\s*'([^']+)'\s*,\s*name:\s*'([^']+)'\s*,\s*description:\s*'([^']+)'/g
      while ((m = roleRegex.exec(roleSection[1])) !== null) {
        info.roles.push({ slug: m[1], name: m[2], description: m[3] })
      }
    }

    // Feature groups
    const groupSection = content.match(/FeatureGroup\.updateOrCreateMany[^[]*\[([^\]]+)\]/s)
    if (groupSection) {
      const grpRegex = /\{\s*slug:\s*'([^']+)'\s*,\s*name:\s*'([^']+)'/g
      while ((m = grpRegex.exec(groupSection[1])) !== null) {
        info.groups.push({ slug: m[1], name: m[2], module: '' })
      }
    }

    // Features
    const featureSection = content.match(/Feature\.updateOrCreateMany[^[]*\[([\s\S]+?)\]\s*\)/)
    if (featureSection) {
      const featRegex = /slug:\s*'([^']+)'\s*,\s*name:\s*'([^']+)'[^}]*route:\s*'([^']+)'/g
      while ((m = featRegex.exec(featureSection[1])) !== null) {
        info.features.push({ slug: m[1], name: m[2], group: '', route: m[3] })
      }
    }
  }

  // Parse abilities
  const abilitiesPath = 'app/abilities/main.ts'
  if (existsSync(join(root, abilitiesPath))) {
    const content = readUtf8(abilitiesPath)
    const abilityRegex = /export const (\w+)\s*=\s*Bouncer\.ability/g
    let m: RegExpExecArray | null
    while ((m = abilityRegex.exec(content)) !== null) {
      info.bouncerRules.push(m[1])
    }
  }

  return info
}

function generatePermissionsDoc(info: PermissionInfo): string {
  let mermaid = '```mermaid\nflowchart TB\n'

  // Roles
  mermaid += '  subgraph Roles\n'
  for (const role of info.roles) {
    mermaid += `    R_${role.slug}["${role.name}"]\n`
  }
  mermaid += '  end\n'

  // Módulos
  mermaid += '  subgraph Modulos\n'
  for (const mod of info.modules) {
    mermaid += `    M_${mod.slug}["${mod.name}"]\n`
  }
  mermaid += '  end\n'

  // Bouncer
  if (info.bouncerRules.length > 0) {
    mermaid += '  subgraph Bouncer\n'
    for (const rule of info.bouncerRules) {
      mermaid += `    B_${rule}["${rule}"]\n`
    }
    mermaid += '  end\n'
  }

  mermaid += '  R_owner --> |bypass| Modulos\n'
  mermaid += '  R_admin --> |quase tudo| Modulos\n'
  mermaid += '  R_member --> |via FeatureService| Bouncer\n'

  mermaid += '```\n'

  let table = '## Roles\n\n| Slug | Nome | Descrição |\n| --- | --- | --- |\n'
  for (const role of info.roles) {
    table += `| ${role.slug} | ${role.name} | ${role.description} |\n`
  }

  table += '\n## Módulos\n\n| Slug | Nome |\n| --- | --- |\n'
  for (const mod of info.modules) {
    table += `| ${mod.slug} | ${mod.name} |\n`
  }

  table += '\n## Features\n\n| Slug | Nome | Rota |\n| --- | --- | --- |\n'
  for (const feat of info.features) {
    table += `| ${feat.slug} | ${feat.name} | ${feat.route} |\n`
  }

  table += '\n## Bouncer Rules\n\n| Rule |\n| --- |\n'
  for (const rule of info.bouncerRules) {
    table += `| ${rule} |\n`
  }

  return `# Permissions — Mapa de Permissões\n\n${HEADER}\n## Diagrama\n\n${mermaid}\n${table}`
}

// --- Scanner: Auth Flow ---

function generateAuthFlowDoc(): string {
  let sequenceDiagram = '```mermaid\nsequenceDiagram\n'
  sequenceDiagram += '  participant U as Usuário\n'
  sequenceDiagram += '  participant B as Browser\n'
  sequenceDiagram += '  participant S as SessionController\n'
  sequenceDiagram += '  participant T as AuthTokenService\n'
  sequenceDiagram += '  participant DB as Database\n'
  sequenceDiagram += '\n'

  // Login flow
  sequenceDiagram += '  Note over U,DB: Fluxo de Login\n'
  sequenceDiagram += '  U->>B: Preenche email/senha\n'
  sequenceDiagram += '  B->>S: POST /login\n'
  sequenceDiagram += '  S->>DB: User.verifyCredentials()\n'
  sequenceDiagram += '  DB-->>S: User válido\n'
  sequenceDiagram += '  S->>S: auth.use("web").login(user)\n'
  sequenceDiagram += '  S->>S: resolveRedirect(user)\n'
  sequenceDiagram += '  alt Cross-domain (subdomínios)\n'
  sequenceDiagram += '    S->>T: AuthTokenService.generate(user, callbackUrl)\n'
  sequenceDiagram += '    T->>DB: Cria token (30s TTL, single-use)\n'
  sequenceDiagram += '    T-->>S: token hex\n'
  sequenceDiagram += '    S-->>B: X-Inertia-Location → /auth/callback?token=xxx\n'
  sequenceDiagram += '    B->>S: GET /auth/callback?token=xxx\n'
  sequenceDiagram += '    S->>T: AuthTokenService.validate(token)\n'
  sequenceDiagram += '    T->>DB: Busca token válido + marca usado\n'
  sequenceDiagram += '    T-->>S: User\n'
  sequenceDiagram += '    S->>S: auth.use("web").login(user)\n'
  sequenceDiagram += '    S-->>B: Redirect → /\n'
  sequenceDiagram += '  else Mesmo domínio (localhost)\n'
  sequenceDiagram += '    S-->>B: Redirect → /\n'
  sequenceDiagram += '  end\n'
  sequenceDiagram += '\n'

  // Signup flow
  sequenceDiagram += '  Note over U,DB: Fluxo de Signup\n'
  sequenceDiagram += '  U->>B: Preenche dados\n'
  sequenceDiagram += '  B->>S: POST /signup\n'
  sequenceDiagram += '  S->>DB: Cria User + Company\n'
  sequenceDiagram += '  S->>S: auth.use("web").login(user)\n'
  sequenceDiagram += '  S-->>B: Redirect → destino\n'
  sequenceDiagram += '\n'

  // Logout flow
  sequenceDiagram += '  Note over U,DB: Fluxo de Logout\n'
  sequenceDiagram += '  U->>B: Clica "Sair"\n'
  sequenceDiagram += '  B->>S: POST /logout (subdomínio)\n'
  sequenceDiagram += '  S->>S: auth.use("web").logout()\n'
  sequenceDiagram += '  alt Subdomínios\n'
  sequenceDiagram += '    S-->>B: X-Inertia-Location → domain/logout\n'
  sequenceDiagram += '    B->>S: GET /logout (domínio principal)\n'
  sequenceDiagram += '    S->>S: auth.use("web").logout()\n'
  sequenceDiagram += '    S-->>B: Redirect → /login\n'
  sequenceDiagram += '  else Localhost\n'
  sequenceDiagram += '    S-->>B: Redirect → /login\n'
  sequenceDiagram += '  end\n'

  sequenceDiagram += '```\n'

  // Flowchart do token
  let flowchart = '```mermaid\nflowchart TD\n'
  flowchart += '  A[Login no domínio principal] --> B{Destino cross-domain?}\n'
  flowchart += '  B -->|Sim| C[Gera token 30s single-use]\n'
  flowchart += '  B -->|Não| D[Redirect local]\n'
  flowchart += '  C --> E[Redirect para /auth/callback?token=xxx]\n'
  flowchart += '  E --> F[Valida token + cria sessão local]\n'
  flowchart += '  F --> G[Redirect para /]\n'
  flowchart += '  D --> G\n'
  flowchart += '```\n'

  return `# Auth Flow — Fluxo de Autenticação\n\n${HEADER}\n## Diagrama de Sequência\n\n${sequenceDiagram}\n## Token Cross-Domain\n\n${flowchart}`
}

// --- Scanner: Tests ---

interface TestInfo {
  file: string
  type: 'browser' | 'functional'
  group: string
  tests: string[]
  urls: string[]
}

function scanTests(): TestInfo[] {
  const files = listFiles('tests', '.spec.ts', true)
  const results: TestInfo[] = []

  for (const file of files) {
    const content = readUtf8(file)
    const type: 'browser' | 'functional' = file.includes('/browser/') ? 'browser' : 'functional'

    const groupMatch = content.match(/test\.group\(\s*'([^']+)'/)
    const group = groupMatch?.[1] || file.split('/').pop()!.replace('.spec.ts', '')

    const tests: string[] = []
    const testRegex = /test\(\s*'([^']+)'/g
    let m: RegExpExecArray | null
    while ((m = testRegex.exec(content)) !== null) {
      tests.push(m[1])
    }

    const urls: string[] = []
    const urlRegex = /visit\(\s*'([^']+)'/g
    while ((m = urlRegex.exec(content)) !== null) {
      if (!urls.includes(m[1])) urls.push(m[1])
    }
    const getRegex = /\.get\(\s*'([^']+)'/g
    while ((m = getRegex.exec(content)) !== null) {
      if (!urls.includes(m[1]) && m[1].startsWith('/')) urls.push(m[1])
    }
    const postRegex = /\.post\(\s*'([^']+)'/g
    while ((m = postRegex.exec(content)) !== null) {
      if (!urls.includes(m[1]) && m[1].startsWith('/')) urls.push(m[1])
    }

    results.push({ file, type, group, tests, urls })
  }

  return results
}

function generateTestsDoc(tests: TestInfo[]): string {
  const totalTests = tests.reduce((sum, t) => sum + t.tests.length, 0)
  const browserTests = tests.filter((t) => t.type === 'browser')
  const funcTests = tests.filter((t) => t.type === 'functional')

  let table = `## Resumo\n\n`
  table += `- **Total de testes**: ${totalTests}\n`
  table += `- **Browser tests**: ${browserTests.reduce((s, t) => s + t.tests.length, 0)} (${browserTests.length} arquivos)\n`
  table += `- **Functional tests**: ${funcTests.reduce((s, t) => s + t.tests.length, 0)} (${funcTests.length} arquivos)\n\n`

  table += '## Detalhamento\n\n'
  table += '| Arquivo | Tipo | Grupo | Testes | URLs |\n'
  table += '| --- | --- | --- | --- | --- |\n'
  for (const t of tests) {
    table += `| ${t.file} | ${t.type} | ${t.group} | ${t.tests.length} | ${t.urls.join(', ') || '-'} |\n`
  }

  table += '\n## Lista de Testes\n\n'
  for (const t of tests) {
    table += `### ${t.group} (${t.type})\n\n`
    for (const test of t.tests) {
      table += `- ${test}\n`
    }
    table += '\n'
  }

  return `# Tests — Mapa de Testes\n\n${HEADER}\n${table}`
}

// --- Gerador: Index unificado ---

function generateIndexDoc(sections: { title: string; file: string; content: string }[]): string {
  let toc = '## Índice\n\n'
  for (const s of sections) {
    const anchor = s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    toc += `- [${s.title}](#${anchor})\n`
  }

  let body = ''
  for (const s of sections) {
    body += `\n---\n\n`
    body += s.content + '\n'
  }

  return `# Graph — Documentação Visual do Projeto\n\n${HEADER}\n${toc}\n${body}`
}

// --- Comando principal ---

export default class GraphGenerate extends BaseCommand {
  static commandName = 'graph:generate'
  static description = 'Gera diagramas Mermaid e documentação visual do projeto'

  static options: CommandOptions = {}

  static {
    this.defineFlag('check', {
      type: 'boolean',
      description: 'Verifica se os grafos estão atualizados sem escrever arquivos',
    })
  }

  generatedFiles = new Map<string, string>()

  setFile(path: string, content: string) {
    this.generatedFiles.set(path, `${content.trimEnd()}\n`)
  }

  async run() {
    this.logger.info('Gerando documentação visual do projeto...')

    // 1. Models
    const models = scanModels()
    const modelsDoc = generateModelsDoc(models)
    this.setFile('docs/graph/models.generated.md', modelsDoc)

    // 2. Routes
    const routes = scanRoutes()
    const routesDoc = generateRoutesDoc(routes)
    this.setFile('docs/graph/routes.generated.md', routesDoc)

    // 3. Controllers
    const controllers = scanControllers()
    const controllersDoc = generateControllersDoc(controllers)
    this.setFile('docs/graph/controllers.generated.md', controllersDoc)

    // 4. Services
    const services = scanServices()
    const servicesDoc = generateServicesDoc(services)
    this.setFile('docs/graph/services.generated.md', servicesDoc)

    // 5. Frontend
    const frontend = scanFrontend()
    const frontendDoc = generateFrontendDoc(frontend)
    this.setFile('docs/graph/frontend.generated.md', frontendDoc)

    // 6. Permissions
    const permissions = scanPermissions()
    const permissionsDoc = generatePermissionsDoc(permissions)
    this.setFile('docs/graph/permissions.generated.md', permissionsDoc)

    // 7. Auth flow
    const authFlowDoc = generateAuthFlowDoc()
    this.setFile('docs/graph/auth-flow.generated.md', authFlowDoc)

    // 8. Tests
    const tests = scanTests()
    const testsDoc = generateTestsDoc(tests)
    this.setFile('docs/graph/tests.generated.md', testsDoc)

    // 9. Index unificado
    const sections = [
      { title: 'Models', file: 'docs/graph/models.generated.md', content: modelsDoc },
      { title: 'Routes', file: 'docs/graph/routes.generated.md', content: routesDoc },
      {
        title: 'Controllers',
        file: 'docs/graph/controllers.generated.md',
        content: controllersDoc,
      },
      {
        title: 'Services e Middleware',
        file: 'docs/graph/services.generated.md',
        content: servicesDoc,
      },
      { title: 'Frontend', file: 'docs/graph/frontend.generated.md', content: frontendDoc },
      {
        title: 'Permissions',
        file: 'docs/graph/permissions.generated.md',
        content: permissionsDoc,
      },
      { title: 'Auth Flow', file: 'docs/graph/auth-flow.generated.md', content: authFlowDoc },
      { title: 'Tests', file: 'docs/graph/tests.generated.md', content: testsDoc },
    ]
    const indexDoc = generateIndexDoc(sections)
    this.setFile('docs/graph/index.generated.md', indexDoc)

    // Escrever ou verificar
    let hasChanges = false

    for (const [path, content] of this.generatedFiles) {
      const absolutePath = join(root, path)
      const current = existsSync(absolutePath) ? readFileSync(absolutePath, 'utf8') : null

      if (current === content) continue

      hasChanges = true

      if (!this.parsed.flags.check) {
        mkdirSync(dirname(absolutePath), { recursive: true })
        writeFileSync(absolutePath, content)
      }
    }

    if (!this.parsed.flags.check) {
      this.logger.success(
        `Documentação visual gerada (${this.generatedFiles.size} arquivos em docs/graph/)`
      )
      return
    }

    if (hasChanges) {
      this.logger.error('Os grafos estão desatualizados. Execute `node ace graph:generate`.')
      this.exitCode = 1
      return
    }

    this.logger.success('Grafos atualizados')
  }
}
