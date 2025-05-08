import { 
  Entity, 
  Column, 
  Index,
  OneToMany
} from 'typeorm';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID, IsBoolean, IsString } from 'class-validator';
import { BaseEntity } from '../database/base.entity';
import { Transaction } from './transaction.entity';

export enum CategoryType {
  RECEITA = 'receita',
  DESPESA = 'despesa'
}

@Entity('categories')
export class Category extends BaseEntity {
  @Column()
  @Index()
  @IsUUID()
  @IsNotEmpty({ message: 'O ID do usuário é obrigatório' })
  usuarioId: string;

  @Column()
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @Column({
    type: 'enum',
    enum: CategoryType,
  })
  @IsEnum(CategoryType, { message: 'O tipo deve ser receita ou despesa' })
  @IsNotEmpty({ message: 'O tipo é obrigatório' })
  tipo: CategoryType;

  @Column({ nullable: true })
  @IsString({ message: 'A cor deve ser uma string' })
  @IsOptional()
  cor?: string;

  @Column({ nullable: true })
  @IsString({ message: 'O ícone deve ser uma string' })
  @IsOptional()
  icone?: string;

  @Column({ default: false })
  @IsBoolean({ message: 'O campo padrão deve ser um booleano' })
  @IsOptional()
  padrao: boolean;

  @OneToMany(() => Transaction, transaction => transaction.categoria)
  transacoes: Transaction[];
}