import { BaseCommand } from '@adonisjs/core/ace'

import type { CommandOptions } from '@adonisjs/core/types/ace'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function normalizePath(path: string): string {
  return path.split('\\').join('/')
}

function readUtf8(path: string): string {
  return readFileSync(join(root, path), 'utf8')
}

function listMarkdownFiles(dir: string): string[] {
  const output: string[] = []
  const absoluteDir = join(root, dir)

  if (!existsSync(absoluteDir)) {
    return output
  }

  for (const entry of readdirSync(absoluteDir)) {
    if (entry === '.DS_Store') continue

    const absolutePath = join(absoluteDir, entry)
    const stats = statSync(absolutePath)

    if (stats.isDirectory()) {
      output.push(...listMarkdownFiles(normalizePath(relative(root, absolutePath))))
      continue
    }

    if (stats.isFile() && entry.endsWith('.md')) {
      output.push(normalizePath(relative(root, absolutePath)))
    }
  }

  return output.sort((a, b) => a.localeCompare(b))
}

function firstHeading(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : null
}

function sha256(content: string): string {
  return createHash('sha256').update(content).digest('hex')
}

export default class SyncKnowledgeBase extends BaseCommand {
  static commandName = 'docs:sync'
  static description = 'Sincroniza a base de conhecimento e os arquivos de agentes'

  static options: CommandOptions = {}

  static {
    this.defineFlag('check', {
      type: 'boolean',
      description: 'Verifica se a base esta sincronizada sem escrever arquivos',
    })
  }

  generatedFiles = new Map<string, string>()

  setFile(path: string, content: string) {
    this.generatedFiles.set(path, `${content.trimEnd()}\n`)
  }

  buildKnowledgeManifest() {
    const docs = listMarkdownFiles('docs').filter(
      (path) => path !== 'docs/knowledge-base.generated.md'
    )
    const rows = docs.map((path) => {
      const content = readUtf8(path)
      const title = firstHeading(content) ?? path
      return `| [${title}](${path.replace(/^docs\//, '')}) | \`${path}\` | \`${sha256(content).slice(0, 12)}\` |`
    })

    return `# Base de Conhecimento Gerada

    Consulte este documento quando precisar de um manifesto atualizado dos documentos Markdown disponíveis para humanos e agentes de IA.

    > Arquivo gerado automaticamente por \`node ace docs:sync\`. Não edite manualmente.

    ## Ordem recomendada de leitura

    1. [Documentação](README.md)
    2. [Visão geral do projeto](project/overview.md)
    3. [Visão geral da arquitetura](architecture/overview.md)
    4. [Guia de desenvolvimento](guides/development.md)
    5. [Guia de commits](guides/commits.md)
    6. [Guia de releases e versionamento](guides/releases.md)
    7. [Referências externas](references/README.md)
    8. [Guia de agentes](agents/index.md)

    ## Documentos indexados

    | Documento | Caminho | Hash |
    | --- | --- | --- |
    ${rows.join('\n')}`
  }

  registerGeneratedFiles() {
    const agentReadingOrder = `1. \`docs/README.md\`
    2. \`docs/project/overview.md\`
    3. \`docs/architecture/overview.md\`
    4. \`docs/guides/development.md\`
    5. \`docs/guides/commits.md\`
    6. \`docs/guides/releases.md\`
    7. \`docs/references/README.md\`
    8. \`docs/knowledge-base.generated.md\`
    9. \`docs/graph/index.generated.md\``

    const sharedAgentInstructions = (
      agentName: string,
      specificPath: string
    ) => `# Instruções para ${agentName}

    Antes de alterar o projeto, leia a documentação central em pt_BR:

    ${agentReadingOrder}

    Instruções específicas deste agente ficam em \`${specificPath}\`.

    Siga a convenção de commits descrita em \`docs/guides/commits.md\`.
    `

    const projectKnowledgeSkill = `---
    name: project-knowledge
    description: Use quando precisar consultar a documentação, referências técnicas, contexto de produto, arquitetura ou regras operacionais deste repositório antes de implementar, revisar ou planejar mudanças.
    ---

    # Base de Conhecimento do Projeto

    Use esta skill para consultar a documentação canônica do projeto em pt_BR.

    ## Ordem de leitura

    ${agentReadingOrder}

    ## Regras

    - A fonte canônica é a pasta \`docs/\`.
    - Não duplique documentação longa em arquivos específicos de agente.
    - Consulte \`docs/references/README.md\` antes de alterar código que dependa de AdonisJS ou Lucid.
    - Consulte \`docs/guides/commits.md\` antes de criar commits.
    - Se adicionar, remover ou renomear documentação, execute \`node ace docs:sync\`.`

    this.setFile(
      'AGENTS.md',
      `# Instruções para Agentes

         Antes de alterar o projeto, leia a documentação central em pt_BR:

         ${agentReadingOrder}

         Consulte \`docs/agents/index.md\` para instruções compartilhadas entre agentes.

         Siga a convenção de commits descrita em \`docs/guides/commits.md\`.
      `
    )

    this.setFile('CLAUDE.md', sharedAgentInstructions('Claude', 'docs/agents/claude.md'))
    this.setFile('GEMINI.md', sharedAgentInstructions('Gemini', 'docs/agents/gemini.md'))

    this.setFile(
      '.github/copilot-instructions.md',
      `# Instruções do GitHub Copilot

      Use pt_BR para explicações, comentários de documentação e respostas textuais neste repositório.

      Antes de sugerir mudanças, considere a documentação central:

      ${agentReadingOrder}

      Regras principais:

      - A fonte canônica de contexto é \`docs/\`.
      - Consulte \`docs/references/README.md\` para referências AdonisJS e Lucid.
      - Siga os padrões existentes de AdonisJS, Vue, Inertia e Vite.
      - Siga a convenção de commits em \`docs/guides/commits.md\`.`
    )

    this.setFile(
      '.github/instructions/docs.instructions.md',
      `---
      applyTo: 'docs/**/*.md'
      ---

      # Instruções para documentação

      - Escreva documentação em pt_BR.
      - Comece cada documento com uma frase dizendo quando ele deve ser consultado.
      - Mantenha \`docs/\` como fonte canônica de conhecimento.
      - Execute \`node ace docs:sync\` após criar, remover ou renomear documentos.
      - Não inclua arquivos binários, \`.DS_Store\` ou conteúdo gerado manualmente nos índices.
      `
    )
    let agentInstructionsKiro: string = agentReadingOrder
      .split('\n')
      .map((line) => line.replaceAll('`docs/', '`../docs/'))
      .join('\n')

    this.setFile(
      '.kiro/README.md',
      `# Instruções do Kiro

      Antes de alterar o projeto, leia a documentação central em pt_BR:

      ${agentInstructionsKiro}

      Instruções específicas do Kiro ficam em \`../docs/agents/kiro.md\` e \`.kiro/steering/\`.

      Siga a convenção de commits descrita em \`../docs/guides/commits.md\`.
      `
    )

    this.setFile(
      '.kiro/steering/project.md',
      `---
      inclusion: always
      ---

      # Contexto do Projeto

      Use pt_BR ao trabalhar neste repositório.

      A fonte canônica de contexto é \`docs/\`. Leia primeiro:

      ${agentReadingOrder}

      Consulte \`docs/knowledge-base.generated.md\` para descobrir documentos disponíveis.
      `
    )

    this.setFile(
      '.kiro/steering/tech.md',
      `---
      inclusion: always
      ---

      # Diretrizes Técnicas

      - Backend: AdonisJS com TypeScript.
      - Frontend: Vue, Inertia e Vite.
      - Banco de dados: Lucid ORM.
      - Referências técnicas ficam em \`docs/references/\`.
      - Antes de alterar código dependente de framework, consulte \`docs/references/README.md\`.
      `
    )

    this.setFile(
      '.kiro/steering/structure.md',
      `---
      inclusion: always
      ---

      # Estrutura de Documentação

      - Documentação autoral: \`docs/project/\`, \`docs/planning/\`, \`docs/architecture/\` e \`docs/guides/\`.
      - Referências externas: \`docs/references/\`.
      - Instruções de agentes: \`docs/agents/\`.
      - Manifesto gerado: \`docs/knowledge-base.generated.md\`.

      Execute \`node ace docs:sync\` após mudar documentos.
      `
    )

    this.setFile('.agents/skills/project-knowledge/SKILL.md', projectKnowledgeSkill)
    this.setFile('.claude/skills/project-knowledge/SKILL.md', projectKnowledgeSkill)
    this.setFile('docs/knowledge-base.generated.md', this.buildKnowledgeManifest())
  }

  async run() {
    this.logger.info('Hello world from "Docs"')
    this.registerGeneratedFiles()

    let hasChanges = false

    for (const [path, content] of this.generatedFiles) {
      const absolutePath = join(root, path)
      const current = existsSync(absolutePath) ? readFileSync(absolutePath, 'utf8') : null

      if (current === content) {
        continue
      }

      hasChanges = true

      if (!this.parsed.flags.check) {
        mkdirSync(dirname(absolutePath), { recursive: true })
        writeFileSync(absolutePath, content)
      }
    }

    if (!this.parsed.flags.check) {
      this.logger.success('Base de conhecimento sincronizada')
      return
    }

    if (hasChanges) {
      this.logger.error('A base de conhecimento esta desatualizada. Execute `node ace docs:sync`.')
      this.exitCode = 1
      return
    }

    try {
      execFileSync('git', ['diff', '--quiet', '--', ...this.generatedFiles.keys()], {
        cwd: root,
        stdio: 'ignore',
      })
    } catch {
      this.logger.error('Existem diffs pendentes nos arquivos gerados da base de conhecimento.')
      this.exitCode = 1
      return
    }

    this.logger.success('Base de conhecimento sincronizada')
  }
}
