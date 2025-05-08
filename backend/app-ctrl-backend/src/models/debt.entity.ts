import { 
  Entity, 
  Column, 
  OneToMany, 
  Index 
} from 'typeorm';
import { 
  IsNotEmpty, 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsUUID, 
  IsEnum, 
  Min 
} from 'class-validator';
import { BaseEntity } from '../database/base.entity';
import { Installment } from './installment.entity';

export enum DebtStatus {
  PENDING = 'pendente',
  IN_PROGRESS = 'em_andamento',
  PAID = 'pago',
  OVERDUE = 'atrasado',
  CANCELLED = 'cancelado'
}

@Entity('debts')
export class Debt extends BaseEntity {
  @Column()
  @Index()
  @IsUUID()
  @IsNotEmpty({ message: 'O ID do usuário é obrigatório' })
  usuarioId: string;

  @Column()
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @Column({ nullable: true })
  @IsString({ message: 'A descrição deve ser uma string' })
  @IsOptional()
  descricao?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber({}, { message: 'O valor total deve ser um número' })
  @IsNotEmpty({ message: 'O valor total é obrigatório' })
  @Min(0, { message: 'O valor total deve ser maior ou igual a zero' })
  valorTotal: number;

  @Column({
    type: 'enum',
    enum: DebtStatus,
    default: DebtStatus.PENDING
  })
  @IsEnum(DebtStatus, { message: 'Status inválido' })
  @IsOptional()
  status: DebtStatus;

  @Column({ type: 'timestamp', name: 'data_inicio' })
  dataInicio: Date;

  @Column({ type: 'timestamp', name: 'data_fim', nullable: true })
  @IsOptional()
  dataFim?: Date;

  @OneToMany(() => Installment, installment => installment.debt, { 
    cascade: true,
    eager: true
  })
  parcelas: Installment[];

  /**
   * Calcula o progresso de pagamento da dívida
   * @returns Objeto com valor pago, valor pendente e percentual de progresso
   */
  calcularProgresso(): { valorPago: number; valorPendente: number; percentual: number } {
    if (!this.parcelas || this.parcelas.length === 0) {
      return { valorPago: 0, valorPendente: Number(this.valorTotal), percentual: 0 };
    }

    const valorPago = this.parcelas
      .filter(p => p.dataPagamento)
      .reduce((sum, p) => sum + Number(p.valor), 0);

    const valorPendente = Number(this.valorTotal) - valorPago;
    const percentual = (valorPago / Number(this.valorTotal)) * 100;

    return {
      valorPago,
      valorPendente,
      percentual: Math.min(100, Math.round(percentual * 100) / 100) // Limita a 100% e arredonda para 2 casas decimais
    };
  }

  /**
   * Verifica se há parcelas atrasadas
   * @returns true se houver parcelas atrasadas, false caso contrário
   */
  temParcelasAtrasadas(): boolean {
    if (!this.parcelas || this.parcelas.length === 0) {
      return false;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return this.parcelas.some(p => {
      const dataVencimento = new Date(p.dataVencimento);
      dataVencimento.setHours(0, 0, 0, 0);
      return !p.dataPagamento && dataVencimento < hoje;
    });
  }

  /**
   * Atualiza o status da dívida com base nas parcelas
   */
  atualizarStatus(): void {
    if (!this.parcelas || this.parcelas.length === 0) {
      this.status = DebtStatus.PENDING;
      return;
    }

    const todasPagas = this.parcelas.every(p => p.dataPagamento);
    const temAtrasadas = this.temParcelasAtrasadas();
    const temPagas = this.parcelas.some(p => p.dataPagamento);

    if (todasPagas) {
      this.status = DebtStatus.PAID;
    } else if (temAtrasadas) {
      this.status = DebtStatus.OVERDUE;
    } else if (temPagas) {
      this.status = DebtStatus.IN_PROGRESS;
    } else {
      this.status = DebtStatus.PENDING;
    }
  }

  /**
   * Serializa a dívida para resposta da API
   * @returns Objeto formatado para resposta da API
   */
  serialize(): Record<string, any> {
    const progresso = this.calcularProgresso();
    
    return {
      id: this.id,
      nome: this.nome,
      descricao: this.descricao,
      valorTotal: this.valorTotal,
      status: this.status,
      dataInicio: this.dataInicio,
      dataFim: this.dataFim,
      parcelas: this.parcelas?.map(p => p.serialize()) || [],
      progresso,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}