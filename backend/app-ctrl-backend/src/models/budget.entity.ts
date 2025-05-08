import { 
  Entity, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  Index 
} from 'typeorm';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID, Min, Max } from 'class-validator';
import { BaseEntity } from '../database/base.entity';
import { Category } from './category.entity';

export type Notification = {
  tipo: string;
  limite: number;
  ativo: boolean;
};

@Entity('budgets')
export class Budget extends BaseEntity {
  @Column()
  @Index()
  @IsUUID()
  @IsNotEmpty({ message: 'O ID do usuário é obrigatório' })
  usuarioId: string;

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Category;

  @Column({ name: 'categoria_id' })
  @Index()
  @IsUUID()
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  categoriaId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  @Min(0, { message: 'O valor deve ser maior ou igual a zero' })
  valor: number;

  @Column()
  @Index()
  @IsNumber({}, { message: 'O mês deve ser um número' })
  @IsNotEmpty({ message: 'O mês é obrigatório' })
  @Min(1, { message: 'O mês deve ser entre 1 e 12' })
  @Max(12, { message: 'O mês deve ser entre 1 e 12' })
  mes: number;

  @Column()
  @Index()
  @IsNumber({}, { message: 'O ano deve ser um número' })
  @IsNotEmpty({ message: 'O ano é obrigatório' })
  @Min(2000, { message: 'O ano deve ser maior ou igual a 2000' })
  ano: number;

  @Column('jsonb', { nullable: true })
  @IsOptional()
  notificacoes?: Notification[];

  /**
   * Verifica se um determinado valor ultrapassa algum limite de notificação
   * @param valor Valor atual gasto na categoria
   * @returns Array de notificações ativadas ou null se nenhuma
   */
  verificarLimites(valor: number): Notification[] | null {
    if (!this.notificacoes || this.notificacoes.length === 0 || !this.valor) {
      return null;
    }

    const percentual = (valor / Number(this.valor)) * 100;
    const notificacoesAtivadas = this.notificacoes
      .filter(n => n.ativo && percentual >= n.limite)
      .sort((a, b) => b.limite - a.limite);

    return notificacoesAtivadas.length > 0 ? notificacoesAtivadas : null;
  }
}