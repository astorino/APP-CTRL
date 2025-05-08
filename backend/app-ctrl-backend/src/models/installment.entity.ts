import { 
  Entity, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  Index 
} from 'typeorm';
import { 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsEnum, 
  Min, 
  IsDate 
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseEntity } from '../database/base.entity';
import { Debt } from './debt.entity';

export enum InstallmentStatus {
  PENDING = 'pendente',
  PAID = 'pago',
  OVERDUE = 'atrasado',
  CANCELLED = 'cancelado'
}

@Entity('installments')
export class Installment extends BaseEntity {
  @ManyToOne(() => Debt, debt => debt.parcelas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'debt_id' })
  debt: Debt;

  @Column({ name: 'debt_id' })
  @Index()
  @IsNotEmpty({ message: 'O ID da dívida é obrigatório' })
  debtId: string;

  @Column()
  @IsNumber({}, { message: 'O número da parcela deve ser um número' })
  @IsNotEmpty({ message: 'O número da parcela é obrigatório' })
  @Min(1, { message: 'O número da parcela deve ser maior ou igual a 1' })
  numero: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  @Min(0, { message: 'O valor deve ser maior ou igual a zero' })
  valor: number;

  @Column({ type: 'timestamp', name: 'data_vencimento' })
  @IsDate({ message: 'A data de vencimento deve ser uma data válida' })
  @Type(() => Date)
  @IsNotEmpty({ message: 'A data de vencimento é obrigatória' })
  dataVencimento: Date;

  @Column({ type: 'timestamp', name: 'data_pagamento', nullable: true })
  @IsDate({ message: 'A data de pagamento deve ser uma data válida' })
  @Type(() => Date)
  @IsOptional()
  dataPagamento?: Date;

  @Column({
    type: 'enum',
    enum: InstallmentStatus,
    default: InstallmentStatus.PENDING
  })
  @IsEnum(InstallmentStatus, { message: 'Status inválido' })
  @IsOptional()
  status: InstallmentStatus;

  @Column({ nullable: true })
  @IsOptional()
  observacao?: string;

  /**
   * Verifica se a parcela está atrasada
   * @returns true se a parcela estiver atrasada, false caso contrário
   */
  estaAtrasada(): boolean {
    if (this.dataPagamento) {
      return false;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const dataVencimento = new Date(this.dataVencimento);
    dataVencimento.setHours(0, 0, 0, 0);
    
    return dataVencimento < hoje;
  }

  /**
   * Atualiza o status da parcela com base na data de pagamento e vencimento
   */
  atualizarStatus(): void {
    if (this.dataPagamento) {
      this.status = InstallmentStatus.PAID;
    } else if (this.estaAtrasada()) {
      this.status = InstallmentStatus.OVERDUE;
    } else {
      this.status = InstallmentStatus.PENDING;
    }
  }

  /**
   * Serializa a parcela para resposta da API
   * @returns Objeto formatado para resposta da API
   */
  serialize(): Record<string, any> {
    return {
      id: this.id,
      numero: this.numero,
      valor: this.valor,
      dataVencimento: this.dataVencimento,
      dataPagamento: this.dataPagamento,
      status: this.status,
      observacao: this.observacao,
      atrasada: this.estaAtrasada(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}