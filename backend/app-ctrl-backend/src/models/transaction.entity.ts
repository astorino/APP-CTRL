import { 
  Entity, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  Index 
} from 'typeorm';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID, IsBoolean, IsDate } from 'class-validator';
import { BaseEntity } from '../database/base.entity';
import { Category } from './category.entity';

export enum TransactionType {
  RECEITA = 'receita',
  DESPESA = 'despesa'
}

export type Attachment = {
  nome: string;
  url: string;
  tipo: string;
};

@Entity('transactions')
export class Transaction extends BaseEntity {
  @Column()
  @Index()
  @IsUUID()
  @IsNotEmpty({ message: 'O ID do usuário é obrigatório' })
  usuarioId: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  @IsEnum(TransactionType, { message: 'O tipo deve ser receita ou despesa' })
  @IsNotEmpty({ message: 'O tipo é obrigatório' })
  tipo: TransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  valor: number;

  @Column({ type: 'timestamp' })
  @Index()
  @IsDate({ message: 'A data deve ser uma data válida' })
  @IsNotEmpty({ message: 'A data é obrigatória' })
  data: Date;

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Category;

  @Column({ name: 'categoria_id' })
  @Index()
  @IsUUID()
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  categoriaId: string;

  @Column({ nullable: true })
  @IsOptional()
  descricao?: string;

  @Column({ nullable: true, name: 'metodo_pagamento' })
  @IsOptional()
  metodoPagamento?: string;

  @Column('simple-array', { nullable: true })
  @IsOptional()
  tags?: string[];

  @Column({ default: false })
  @IsBoolean({ message: 'O campo recorrente deve ser um booleano' })
  @IsOptional()
  recorrente: boolean;

  @Column('jsonb', { nullable: true })
  @IsOptional()
  anexos?: Attachment[];
}