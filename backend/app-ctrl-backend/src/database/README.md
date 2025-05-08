# Configuração do Banco de Dados do App-Ctrl

Este diretório contém a configuração do banco de dados para o sistema App-Ctrl, implementado usando TypeORM com PostgreSQL.

## Estrutura

### database.module.ts

Módulo NestJS que configura a conexão com o banco de dados usando TypeORM. Este módulo:

- Importa o `ConfigModule` para acessar variáveis de ambiente
- Configura o TypeORM de forma assíncrona usando `TypeOrmModule.forRootAsync()`
- Define as entidades a serem usadas
- Configura opções como sincronização automática de schema (apenas em desenvolvimento)
- Configura o caminho para as migrações

```typescript
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'appctrl'),
        password: configService.get('DB_PASSWORD', 'appctrl'),
        database: configService.get('DB_DATABASE', 'appctrl'),
        entities: [
          User,
          Transaction,
          Category,
          Budget,
          Report,
        ],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
        migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
        migrationsRun: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
```

### data-source.ts

Configura e exporta uma instância do `DataSource` do TypeORM, que é usada para:

- Executar migrações via CLI do TypeORM
- Fornecer acesso direto ao banco de dados quando necessário
- Testar a conexão com o banco de dados

```typescript
// Configuração do DataSource para TypeORM
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'appctrl'),
  password: configService.get('DB_PASSWORD', 'appctrl'),
  database: configService.get('DB_DATABASE', 'appctrl'),
  entities: [
    User,
    Transaction,
    Category,
    Budget,
    Report,
  ],
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  synchronize: configService.get('NODE_ENV') !== 'production',
  logging: configService.get('NODE_ENV') === 'development',
};

// Cria e exporta a instância do DataSource
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
```

### base.entity.ts

Define uma classe base para todas as entidades do sistema, fornecendo campos comuns:

```typescript
export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
```

## Configuração do Banco de Dados

### Variáveis de Ambiente

As seguintes variáveis de ambiente são usadas para configurar a conexão com o banco de dados:

- `DB_HOST`: Host do banco de dados (padrão: 'localhost')
- `DB_PORT`: Porta do banco de dados (padrão: 5432)
- `DB_USERNAME`: Nome de usuário para conexão (padrão: 'appctrl')
- `DB_PASSWORD`: Senha para conexão (padrão: 'appctrl')
- `DB_DATABASE`: Nome do banco de dados (padrão: 'appctrl')
- `NODE_ENV`: Ambiente de execução ('development', 'production', etc.)

### Sincronização Automática

A opção `synchronize` do TypeORM é configurada para:

- `true` em ambiente de desenvolvimento: O schema é automaticamente atualizado com base nas entidades
- `false` em ambiente de produção: Alterações no schema devem ser feitas através de migrações

> ⚠️ **AVISO**: Nunca use `synchronize: true` em ambiente de produção, pois isso pode causar perda de dados.

### Logging

A opção `logging` do TypeORM é configurada para:

- `true` em ambiente de desenvolvimento: Todas as consultas SQL são logadas no console
- `false` em ambiente de produção: Apenas erros são logados

## Migrações

As migrações são configuradas para:

- Serem encontradas em `src/migrations/**/*{.ts,.js}`
- Serem executadas automaticamente na inicialização da aplicação (`migrationsRun: true`)

Para mais informações sobre migrações, consulte o [README.md do diretório de migrações](../migrations/README.md).

## Entidades

As seguintes entidades são configuradas:

- `User`: Usuários do sistema
- `Transaction`: Transações financeiras
- `Category`: Categorias de transações
- `Budget`: Orçamentos mensais por categoria
- `Report`: Relatórios gerados

Para mais informações sobre as entidades, consulte o [README.md do diretório de modelos](../models/README.md).

## Repositórios

Os repositórios são configurados para cada entidade e fornecem métodos para acessar e manipular os dados.

Para mais informações sobre os repositórios, consulte o [README.md do diretório de repositórios](../repositories/README.md).

## Testes

Para testes, é recomendado usar um banco de dados separado ou um banco de dados em memória. Isso pode ser configurado no arquivo `typeorm.config.ts` para testes.

```typescript
// Exemplo de configuração para testes
const testDataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: ':memory:',
  entities: [User, Transaction, Category, Budget, Report],
  synchronize: true,
  dropSchema: true,
};
```