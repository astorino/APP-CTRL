import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1683547316000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela de categorias
    await queryRunner.query(`
      CREATE TYPE "category_type_enum" AS ENUM ('receita', 'despesa');

      CREATE TABLE "categories" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "usuario_id" VARCHAR NOT NULL,
        "nome" VARCHAR NOT NULL,
        "tipo" "category_type_enum" NOT NULL,
        "cor" VARCHAR,
        "icone" VARCHAR,
        "padrao" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        
        CONSTRAINT "pk_categories" PRIMARY KEY ("id")
      );

      CREATE INDEX "idx_categories_usuario_id" ON "categories" ("usuario_id");
      CREATE INDEX "idx_categories_tipo" ON "categories" ("tipo");
    `);

    // Criar tabela de transações
    await queryRunner.query(`
      CREATE TYPE "transaction_type_enum" AS ENUM ('receita', 'despesa');

      CREATE TABLE "transactions" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "usuario_id" VARCHAR NOT NULL,
        "tipo" "transaction_type_enum" NOT NULL,
        "valor" DECIMAL(10,2) NOT NULL,
        "data" TIMESTAMP NOT NULL,
        "categoria_id" UUID NOT NULL,
        "descricao" VARCHAR,
        "metodo_pagamento" VARCHAR,
        "tags" TEXT,
        "recorrente" BOOLEAN NOT NULL DEFAULT false,
        "anexos" JSONB,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        
        CONSTRAINT "pk_transactions" PRIMARY KEY ("id"),
        CONSTRAINT "fk_transactions_categoria" FOREIGN KEY ("categoria_id") 
          REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );

      CREATE INDEX "idx_transactions_usuario_id" ON "transactions" ("usuario_id");
      CREATE INDEX "idx_transactions_data" ON "transactions" ("data");
      CREATE INDEX "idx_transactions_categoria_id" ON "transactions" ("categoria_id");
      CREATE INDEX "idx_transactions_usuario_data" ON "transactions" ("usuario_id", "data");
      CREATE INDEX "idx_transactions_usuario_categoria_data" ON "transactions" ("usuario_id", "categoria_id", "data");
    `);

    // Criar tabela de orçamentos
    await queryRunner.query(`
      CREATE TABLE "budgets" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "usuario_id" VARCHAR NOT NULL,
        "categoria_id" UUID NOT NULL,
        "valor" DECIMAL(10,2) NOT NULL,
        "mes" INTEGER NOT NULL,
        "ano" INTEGER NOT NULL,
        "notificacoes" JSONB,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        
        CONSTRAINT "pk_budgets" PRIMARY KEY ("id"),
        CONSTRAINT "fk_budgets_categoria" FOREIGN KEY ("categoria_id") 
          REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "uq_budgets_usuario_categoria_mes_ano" UNIQUE ("usuario_id", "categoria_id", "mes", "ano")
      );

      CREATE INDEX "idx_budgets_usuario_id" ON "budgets" ("usuario_id");
      CREATE INDEX "idx_budgets_categoria_id" ON "budgets" ("categoria_id");
      CREATE INDEX "idx_budgets_mes_ano" ON "budgets" ("mes", "ano");
      CREATE INDEX "idx_budgets_usuario_mes_ano" ON "budgets" ("usuario_id", "mes", "ano");
    `);

    // Criar tabela de relatórios
    await queryRunner.query(`
      CREATE TYPE "report_type_enum" AS ENUM ('mensal', 'categoria', 'tendencia', 'personalizado');

      CREATE TABLE "reports" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "usuario_id" VARCHAR NOT NULL,
        "tipo" "report_type_enum" NOT NULL DEFAULT 'mensal',
        "data_inicio" TIMESTAMP NOT NULL,
        "data_fim" TIMESTAMP NOT NULL,
        "filtros" JSONB,
        "dados" JSONB,
        "data_criacao" TIMESTAMP NOT NULL DEFAULT now(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        
        CONSTRAINT "pk_reports" PRIMARY KEY ("id")
      );

      CREATE INDEX "idx_reports_usuario_id" ON "reports" ("usuario_id");
      CREATE INDEX "idx_reports_tipo" ON "reports" ("tipo");
      CREATE INDEX "idx_reports_data_criacao" ON "reports" ("data_criacao");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover tabelas na ordem inversa
    await queryRunner.query(`DROP TABLE IF EXISTS "reports" CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "report_type_enum"`);
    
    await queryRunner.query(`DROP TABLE IF EXISTS "budgets" CASCADE`);
    
    await queryRunner.query(`DROP TABLE IF EXISTS "transactions" CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "transaction_type_enum"`);
    
    await queryRunner.query(`DROP TABLE IF EXISTS "categories" CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "category_type_enum"`);
  }
}