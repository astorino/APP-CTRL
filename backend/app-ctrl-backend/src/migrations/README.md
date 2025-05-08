# Migrações do TypeORM para App-Ctrl

Este diretório contém as migrações do banco de dados para o sistema App-Ctrl, implementadas usando o TypeORM.

## Sobre Migrações

As migrações são uma forma de versionar o schema do banco de dados, permitindo:
- Rastrear alterações no schema ao longo do tempo
- Aplicar alterações de forma consistente em diferentes ambientes
- Reverter alterações quando necessário
- Manter o histórico de evolução do banco de dados

## Migrações Disponíveis

### 1683547316000-CreateInitialSchema

**Descrição:** Migração inicial que cria todas as tabelas principais do sistema.

**Tabelas Criadas:**
- `categories`: Armazena as categorias de transações
- `transactions`: Armazena as transações financeiras
- `budgets`: Armazena os orçamentos mensais por categoria
- `reports`: Armazena os relatórios gerados

**Tipos Enum Criados:**
- `category_type_enum`: Tipos de categoria ('receita', 'despesa')
- `transaction_type_enum`: Tipos de transação ('receita', 'despesa')
- `report_type_enum`: Tipos de relatório ('mensal', 'categoria', 'tendencia', 'personalizado')

**Índices Criados:**
- `idx_categories_usuario_id`: Índice para filtrar categorias por usuário
- `idx_categories_tipo`: Índice para filtrar categorias por tipo
- `idx_transactions_usuario_id`: Índice para filtrar transações por usuário
- `idx_transactions_data`: Índice para ordenar e filtrar transações por data
- `idx_transactions_categoria_id`: Índice para filtrar transações por categoria
- `idx_transactions_usuario_data`: Índice composto para consultas de período por usuário
- `idx_transactions_usuario_categoria_data`: Índice composto para relatórios de categoria por período
- `idx_budgets_usuario_id`: Índice para filtrar orçamentos por usuário
- `idx_budgets_categoria_id`: Índice para filtrar orçamentos por categoria
- `idx_budgets_mes_ano`: Índice para filtrar orçamentos por período
- `idx_budgets_usuario_mes_ano`: Índice composto para relatórios mensais de orçamento
- `idx_reports_usuario_id`: Índice para filtrar relatórios por usuário
- `idx_reports_tipo`: Índice para filtrar relatórios por tipo
- `idx_reports_data_criacao`: Índice para ordenar relatórios por data de criação

**Restrições Criadas:**
- Chaves primárias para todas as tabelas
- Chaves estrangeiras para relacionamentos entre tabelas
- Restrição única para orçamentos (usuário, categoria, mês, ano)

## Como Executar Migrações

### Executar Migrações Pendentes

```bash
# Usando npm
npm run migration:run

# Usando yarn
yarn migration:run
```

### Reverter a Última Migração

```bash
# Usando npm
npm run migration:revert

# Usando yarn
yarn migration:revert
```

### Gerar uma Nova Migração

```bash
# Usando npm
npm run migration:generate -- -n NomeDaMigracao

# Usando yarn
yarn migration:generate -n NomeDaMigracao
```

### Criar uma Migração Vazia

```bash
# Usando npm
npm run migration:create -- -n NomeDaMigracao

# Usando yarn
yarn migration:create -n NomeDaMigracao
```

### Verificar Migrações Pendentes

```bash
# Usando npm
npm run migration:show

# Usando yarn
yarn migration:show
```

## Boas Práticas para Migrações

1. **Nunca modifique uma migração já aplicada em produção**
   - Crie uma nova migração para corrigir problemas ou fazer alterações

2. **Teste migrações antes de aplicá-las em produção**
   - Use um ambiente de teste ou desenvolvimento

3. **Inclua tanto o método `up` quanto o `down` em cada migração**
   - O método `up` aplica as alterações
   - O método `down` reverte as alterações

4. **Use nomes descritivos para migrações**
   - O nome deve indicar claramente o que a migração faz

5. **Mantenha migrações pequenas e focadas**
   - Cada migração deve fazer uma alteração específica
   - Evite migrações que fazem muitas alterações diferentes

6. **Documente alterações complexas**
   - Adicione comentários para explicar o propósito de alterações não óbvias

7. **Verifique o SQL gerado antes de aplicar**
   - Use o comando `queryRunner.query` para ver o SQL que será executado

## Estrutura de uma Migração

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class NomeDaMigracao1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Código para aplicar alterações
    await queryRunner.query(`CREATE TABLE ...`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Código para reverter alterações
    await queryRunner.query(`DROP TABLE ...`);
  }
}
```