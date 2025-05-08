# Repositórios do App-Ctrl

Este diretório contém os repositórios do sistema App-Ctrl, que implementam a camada de acesso a dados usando o padrão Repository do TypeORM.

## Estrutura de Repositórios

Cada repositório encapsula a lógica de acesso a dados para uma entidade específica, fornecendo métodos para operações CRUD e consultas especializadas.

### TransactionRepository

Gerencia o acesso a dados para a entidade `Transaction`.

**Métodos Principais:**
- `findById(id, usuarioId?)`: Busca uma transação por ID, opcionalmente verificando o proprietário
- `findAll(usuarioId, options?)`: Busca transações com filtros (tipo, categoria, período, paginação)
- `create(data)`: Cria uma nova transação
- `update(id, data, usuarioId?)`: Atualiza uma transação existente
- `remove(id, usuarioId?)`: Remove uma transação (soft delete)
- `calcularSaldo(usuarioId, options?)`: Calcula o saldo (receitas - despesas) para um período
- `findByCategoria(usuarioId, categoriaId, options?)`: Busca transações de uma categoria específica

**Exemplo de Uso:**
```typescript
// Buscar transações do mês atual
const dataInicio = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const dataFim = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

const [transacoes, total] = await transactionRepository.findAll(usuarioId, {
  dataInicio,
  dataFim,
});

// Calcular saldo
const saldo = await transactionRepository.calcularSaldo(usuarioId, {
  dataInicio,
  dataFim,
});
```

### CategoryRepository

Gerencia o acesso a dados para a entidade `Category`.

**Métodos Principais:**
- `findById(id, usuarioId?)`: Busca uma categoria por ID, opcionalmente verificando o proprietário
- `findAll(usuarioId, options?)`: Busca categorias com filtros (tipo, padrão, paginação)
- `create(data)`: Cria uma nova categoria
- `update(id, data, usuarioId?)`: Atualiza uma categoria existente
- `remove(id, usuarioId?)`: Remove uma categoria (soft delete)
- `findDefaultsByType(tipo)`: Busca categorias padrão por tipo (receita/despesa)
- `createDefaultsForUser(usuarioId)`: Cria categorias padrão para um novo usuário

**Exemplo de Uso:**
```typescript
// Buscar categorias de despesa
const [categorias, total] = await categoryRepository.findAll(usuarioId, {
  tipo: CategoryType.DESPESA,
});

// Criar categorias padrão para um novo usuário
await categoryRepository.createDefaultsForUser(usuarioId);
```

### BudgetRepository

Gerencia o acesso a dados para a entidade `Budget`.

**Métodos Principais:**
- `findById(id, usuarioId?)`: Busca um orçamento por ID, opcionalmente verificando o proprietário
- `findAll(usuarioId, options?)`: Busca orçamentos com filtros (categoria, mês, ano, paginação)
- `create(data)`: Cria um novo orçamento
- `update(id, data, usuarioId?)`: Atualiza um orçamento existente
- `remove(id, usuarioId?)`: Remove um orçamento (soft delete)
- `findByPeriod(usuarioId, mes, ano)`: Busca orçamentos para um período específico
- `findByCategoriaAndPeriod(usuarioId, categoriaId, mes, ano)`: Busca um orçamento específico
- `calculateUtilization(budget, valorGasto)`: Calcula a utilização de um orçamento

**Exemplo de Uso:**
```typescript
// Buscar orçamentos do mês atual
const mes = new Date().getMonth() + 1;
const ano = new Date().getFullYear();

const orcamentos = await budgetRepository.findByPeriod(usuarioId, mes, ano);

// Calcular utilização de um orçamento
const valorGasto = 800; // Valor gasto na categoria
const utilizacao = budgetRepository.calculateUtilization(orcamento, valorGasto);
```

### ReportRepository

Gerencia o acesso a dados para a entidade `Report` e implementa a lógica de geração de relatórios.

**Métodos Principais:**
- `findById(id, usuarioId?)`: Busca um relatório por ID, opcionalmente verificando o proprietário
- `findAll(usuarioId, options?)`: Busca relatórios com filtros (tipo, período, paginação)
- `create(data)`: Cria um novo relatório
- `update(id, data, usuarioId?)`: Atualiza um relatório existente
- `remove(id, usuarioId?)`: Remove um relatório (soft delete)
- `gerarRelatorioMensal(usuarioId, mes, ano)`: Gera um relatório mensal
- `gerarRelatorioCategoria(usuarioId, categoriaId, dataInicio, dataFim)`: Gera um relatório por categoria
- `gerarRelatorioTendencia(usuarioId, meses)`: Gera um relatório de tendência
- `gerarRelatorioPersonalizado(usuarioId, filtros, dataInicio, dataFim)`: Gera um relatório personalizado

**Exemplo de Uso:**
```typescript
// Gerar relatório mensal
const mes = new Date().getMonth() + 1;
const ano = new Date().getFullYear();

const relatorio = await reportRepository.gerarRelatorioMensal(usuarioId, mes, ano);

// Gerar relatório de tendência dos últimos 6 meses
const relatorioTendencia = await reportRepository.gerarRelatorioTendencia(usuarioId, 6);
```

## Padrões de Implementação

### Soft Delete

Todos os repositórios implementam exclusão lógica (soft delete) usando o método `softRemove()` do TypeORM, que marca o registro com a data atual no campo `deletedAt` em vez de excluí-lo fisicamente do banco de dados.

### Verificação de Propriedade

Métodos que modificam dados (update, remove) aceitam um parâmetro opcional `usuarioId` para verificar se o usuário tem permissão para modificar o registro. Isso implementa uma camada adicional de segurança além da autenticação JWT.

### Paginação

Métodos de listagem (`findAll`) suportam paginação através dos parâmetros `skip` e `take`, permitindo implementar facilmente a navegação por páginas na interface do usuário.

### Eager Loading

Relacionamentos importantes são carregados automaticamente usando a opção `relations` do TypeORM, como a categoria em transações e orçamentos, para evitar múltiplas consultas ao banco de dados.

### Ordenação

Resultados de consultas são ordenados de forma consistente:
- Transações: por data (mais recentes primeiro)
- Categorias: por nome (ordem alfabética)
- Orçamentos: por ano e mês (mais recentes primeiro)
- Relatórios: por data de criação (mais recentes primeiro)

## Testes

Cada repositório possui testes unitários abrangentes que verificam:
- Operações CRUD básicas
- Consultas especializadas
- Validação de dados
- Comportamento de soft delete
- Cálculos e agregações