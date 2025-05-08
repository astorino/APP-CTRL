import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDebtAndInstallmentTables1683547317000 implements MigrationInterface {
  name = 'CreateDebtAndInstallmentTables1683547317000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar enum para status da dívida
    await queryRunner.query(`
      CREATE TYPE "public"."debt_status_enum" AS ENUM (
        'pendente', 
        'em_andamento', 
        'pago', 
        'atrasado', 
        'cancelado'
      )
    `);

    // Criar tabela de dívidas
    await queryRunner.query(`
      CREATE TABLE "debts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "usuario_id" uuid NOT NULL,
        "nome" character varying NOT NULL,
        "descricao" character varying,
        "valor_total" numeric(10,2) NOT NULL,
        "status" "public"."debt_status_enum" NOT NULL DEFAULT 'pendente',
        "data_inicio" TIMESTAMP NOT NULL,
        "data_fim" TIMESTAMP,
        CONSTRAINT "pk_debts" PRIMARY KEY ("id")
      )
    `);

    // Criar índice para usuarioId na tabela de dívidas
    await queryRunner.query(`
      CREATE INDEX "idx_debts_usuario_id" ON "debts" ("usuario_id")
    `);

    // Criar enum para status da parcela
    await queryRunner.query(`
      CREATE TYPE "public"."installment_status_enum" AS ENUM (
        'pendente', 
        'pago', 
        'atrasado', 
        'cancelado'
      )
    `);

    // Criar tabela de parcelas
    await queryRunner.query(`
      CREATE TABLE "installments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "debt_id" uuid NOT NULL,
        "numero" integer NOT NULL,
        "valor" numeric(10,2) NOT NULL,
        "data_vencimento" TIMESTAMP NOT NULL,
        "data_pagamento" TIMESTAMP,
        "status" "public"."installment_status_enum" NOT NULL DEFAULT 'pendente',
        "observacao" character varying,
        CONSTRAINT "pk_installments" PRIMARY KEY ("id")
      )
    `);

    // Criar índice para debtId na tabela de parcelas
    await queryRunner.query(`
      CREATE INDEX "idx_installments_debt_id" ON "installments" ("debt_id")
    `);

    // Adicionar chave estrangeira para relacionar parcelas com dívidas
    await queryRunner.query(`
      ALTER TABLE "installments" 
      ADD CONSTRAINT "fk_installments_debt_id" 
      FOREIGN KEY ("debt_id") 
      REFERENCES "debts"("id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover chave estrangeira
    await queryRunner.query(`
      ALTER TABLE "installments" 
      DROP CONSTRAINT "fk_installments_debt_id"
    `);

    // Remover índices
    await queryRunner.query(`
      DROP INDEX "public"."idx_installments_debt_id"
    `);
    await queryRunner.query(`
      DROP INDEX "public"."idx_debts_usuario_id"
    `);

    // Remover tabelas
    await queryRunner.query(`
      DROP TABLE "installments"
    `);
    await queryRunner.query(`
      DROP TABLE "debts"
    `);

    // Remover enums
    await queryRunner.query(`
      DROP TYPE "public"."installment_status_enum"
    `);
    await queryRunner.query(`
      DROP TYPE "public"."debt_status_enum"
    `);
  }
}