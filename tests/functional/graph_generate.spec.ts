import { test } from '@japa/runner'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const root = join(import.meta.dirname, '../..')
const graphDir = join(root, 'docs/graph')

const expectedFiles = [
  'models.generated.md',
  'routes.generated.md',
  'controllers.generated.md',
  'services.generated.md',
  'frontend.generated.md',
  'permissions.generated.md',
  'auth-flow.generated.md',
  'tests.generated.md',
  'index.generated.md',
]

test.group('GraphRAG - Comando graph:generate', () => {
  test('comando executa sem erros', async ({ assert }) => {
    const result = execSync('node ace graph:generate', { cwd: root, encoding: 'utf8' })
    assert.include(result, 'gerada')
  })

  test('gera todos os 9 arquivos esperados', async ({ assert }) => {
    for (const file of expectedFiles) {
      const filePath = join(graphDir, file)
      assert.isTrue(existsSync(filePath), `Arquivo ${file} deveria existir`)
    }
  })

  test('arquivos principais contêm blocos Mermaid', async ({ assert }) => {
    // tests.generated.md pode não ter mermaid (só tabelas), então verificamos os outros
    const filesWithMermaid = expectedFiles.filter((f) => f !== 'tests.generated.md')
    for (const file of filesWithMermaid) {
      const content = readFileSync(join(graphDir, file), 'utf8')
      assert.include(content, '```mermaid', `${file} deveria conter bloco mermaid`)
    }
  })

  test('models.generated.md contém models conhecidos', async ({ assert }) => {
    const content = readFileSync(join(graphDir, 'models.generated.md'), 'utf8')
    assert.include(content, 'User')
    assert.include(content, 'Company')
    assert.include(content, 'Role')
    assert.include(content, 'Feature')
    assert.include(content, 'Team')
  })

  test('routes.generated.md contém rotas conhecidas', async ({ assert }) => {
    const content = readFileSync(join(graphDir, 'routes.generated.md'), 'utf8')
    assert.include(content, 'login')
    assert.include(content, 'signup')
    assert.include(content, 'Session')
  })

  test('tests.generated.md contém testes conhecidos', async ({ assert }) => {
    const content = readFileSync(join(graphDir, 'tests.generated.md'), 'utf8')
    assert.include(content, 'browser')
    assert.include(content, 'functional')
    assert.include(content, 'auth')
  })

  test('index.generated.md contém links para todas as seções', async ({ assert }) => {
    const content = readFileSync(join(graphDir, 'index.generated.md'), 'utf8')
    assert.include(content, 'Models')
    assert.include(content, 'Routes')
    assert.include(content, 'Controllers')
    assert.include(content, 'Services')
    assert.include(content, 'Frontend')
    assert.include(content, 'Permissions')
    assert.include(content, 'Auth')
    assert.include(content, 'Tests')
  })

  test('flag --check não falha quando arquivos estão atualizados', async ({ assert }) => {
    execSync('node ace graph:generate', { cwd: root, encoding: 'utf8' })
    const result = execSync('node ace graph:generate --check', { cwd: root, encoding: 'utf8' })
    assert.notInclude(result, 'desatualizado')
  })

  test('comando é idempotente (rodar 2x gera mesmo output)', async ({ assert }) => {
    execSync('node ace graph:generate', { cwd: root, encoding: 'utf8' })
    const first = readFileSync(join(graphDir, 'index.generated.md'), 'utf8')

    execSync('node ace graph:generate', { cwd: root, encoding: 'utf8' })
    const second = readFileSync(join(graphDir, 'index.generated.md'), 'utf8')

    assert.equal(first, second)
  })
})
