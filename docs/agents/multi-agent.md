# Guia de Trabalho Multiagente

Consulte este documento ao dividir uma tarefa entre agentes no mesmo repositório.

## Configuração

O recurso estável `multi_agent` do Codex está habilitado em `.codex/config.toml`. Reinicie a
sessão do Codex depois de clonar o projeto ou alterar essa configuração.

## Quando delegar

Delegue somente subtarefas concretas que possam avançar de forma independente, por exemplo:

- investigar partes distintas do código;
- implementar backend e frontend em arquivos separados;
- executar validações independentes;
- revisar uma mudança já implementada.

Mantenha no agente principal tarefas pequenas, sequenciais ou que dependam continuamente do
mesmo contexto.

## Protocolo de coordenação

1. O agente principal define para cada subagente um escopo, uma entrega e os arquivos sob sua
   responsabilidade.
2. Todos os agentes leem `AGENTS.md` e a documentação exigida antes de alterar o projeto.
3. Dois agentes não editam o mesmo arquivo simultaneamente.
4. Subagentes não criam commits, branches ou pull requests, salvo pedido explícito do agente
   principal.
5. O agente principal integra os resultados, revisa o diff completo e executa as validações.
6. Se houver mudanças locais preexistentes, todos devem preservá-las e comunicar qualquer
   sobreposição antes de editar.

## Isolamento

Subagentes da mesma tarefa compartilham o diretório de trabalho. Para trabalhos longos que
precisem editar os mesmos arquivos ou evoluir em ritmos diferentes, use tarefas separadas do
Codex com worktrees Git distintas. Cada worktree deve usar uma branch com prefixo `codex/`.

## Exemplo de divisão

Para uma funcionalidade full-stack, uma divisão segura pode ser:

- agente principal: contrato da mudança, integração e validação final;
- subagente 1: controllers, services e validators;
- subagente 2: páginas e componentes Vue;
- subagente 3: testes e revisão de regressões.

Antes de iniciar, confirme que os arquivos de cada frente não se sobrepõem.
