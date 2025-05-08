# Modelos de Dados do App-Ctrl

Este diretório contém as entidades (models) do sistema App-Ctrl, implementadas usando TypeORM com PostgreSQL.

## Estrutura de Entidades

### BaseEntity

Classe base para todas as entidades do sistema, fornecendo campos comuns:

- `id`: UUID único gerado automaticamente
- `createdAt`: Data de criação do registro
- `updatedAt`: Data de atualização do registro
- `deletedAt`: Data de exclusão lógica (soft delete)

### Transaction

Representa uma transação financeira (receita ou despesa).

**Campos:**
- `usuarioId`: ID do usuário proprietário da transação
- `tipo`: Tipo da transação (enum: 'receita' ou 'despesa')
- `valor`: Valor da transação (decimal)
- `data`: Data da transação
- `categoriaId`: ID da categoria associada
- `categoria`: Relacionamento com a entidade Category
- `descricao`: Descrição opcional da transação
- `metodoPagamento`: Método de pagamento opcional
- `tags`: Array de tags associadas à transação
- `recorrente`: Indica se a transação é recorrente
- `anexos`: Array de anexos (documentos, comprovantes) associados à transação

**Índices:**
- `usuarioId`: Para filtrar transações por usuário
- `data`: Para ordenar e filtrar por data
- `categoriaId`: Para filtrar por categoria
- Composto `(usuarioId, data)`: Para consultas de período por usuário
- Composto `(usuarioId, categoriaId, data)`: Para relatórios de categoria por período

### Category

Representa uma categoria de transação (ex: Alimentação, Transporte, Salário).

**Campos:**
- `usuarioId`: ID do usuário proprietário da categoria
- `nome`: Nome da categoria
- `tipo`: Tipo da categoria (enum: 'receita' ou 'despesa')
- `cor`: Cor para representação visual (hexadecimal)
- `icone`: Nome do ícone para representação visual
- `padrao`: Indica se é uma categoria padrão do sistema
- `transacoes`: Relacionamento com as transações desta categoria

**Índices:**
- `usuarioId`: Para filtrar categorias por usuário
- `tipo`: Para filtrar por tipo de categoria
- Composto `(usuarioId, tipo)`: Para listar categorias de um tipo específico por usuário

### Budget

Representa um orçamento mensal para uma categoria específica.

**Campos:**
- `usuarioId`: ID do usuário proprietário do orçamento
- `categoriaId`: ID da categoria associada
- `categoria`: Relacionamento com a entidade Category
- `valor`: Valor limite do orçamento (decimal)
- `mes`: Mês do orçamento (1-12)
- `ano`: Ano do orçamento
- `notificacoes`: Configurações de notificação para alertas de limite

**Índices:**
- `usuarioId`: Para filtrar orçamentos por usuário
- `categoriaId`: Para filtrar por categoria
- Composto `(mes, ano)`: Para filtrar por período
- Composto `(usuarioId, mes, ano)`: Para relatórios mensais de orçamento
- Restrição única `(usuarioId, categoriaId, mes, ano)`: Garante apenas um orçamento por categoria/mês/ano

**Métodos:**
- `verificarLimites(valor)`: Verifica se um valor gasto ultrapassa algum limite de notificação configurado

### Report

Representa um relatório financeiro gerado pelo sistema.

**Campos:**
- `usuarioId`: ID do usuário proprietário do relatório
- `tipo`: Tipo do relatório (enum: 'mensal', 'categoria', 'tendencia', 'personalizado')
- `dataInicio`: Data de início do período do relatório
- `dataFim`: Data de fim do período do relatório
- `filtros`: Objeto JSON com os filtros aplicados ao relatório
- `dados`: Objeto JSON com os dados calculados do relatório
- `dataCriacao`: Data de criação do relatório

**Índices:**
- `usuarioId`: Para filtrar relatórios por usuário
- `tipo`: Para filtrar por tipo de relatório
- `dataCriacao`: Para ordenar por data de criação

**Métodos:**
- `serialize()`: Serializa o relatório para resposta da API

## Relacionamentos

- **Transaction → Category**: Muitos para Um (N:1)
- **Category → Transaction**: Um para Muitos (1:N)
- **Budget → Category**: Muitos para Um (N:1)

## Validação

Todas as entidades utilizam `class-validator` para validação de dados:

- Campos obrigatórios são validados com `@IsNotEmpty()`
- Tipos são validados com decoradores como `@IsString()`, `@IsNumber()`, etc.
- Enums são validados com `@IsEnum()`
- Valores numéricos têm validações de mínimo/máximo quando apropriado

## Soft Delete

Todas as entidades herdam de `BaseEntity` e suportam exclusão lógica (soft delete) através do campo `deletedAt`. Quando um registro é "excluído", na verdade ele é apenas marcado com a data atual no campo `deletedAt` e não aparece mais nas consultas normais.