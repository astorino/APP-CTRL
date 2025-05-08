import { 
  Entity, 
  Column, 
  Index 
} from 'typeorm';
import { IsNotEmpty, IsOptional, IsUUID, IsDate, IsString } from 'class-validator';
import { BaseEntity } from '../database/base.entity';

export enum ReportType {
  MENSAL = 'mensal',
  CATEGORIA = 'categoria',
  TENDENCIA = 'tendencia',
  PERSONALIZADO = 'personalizado'
}

@Entity('reports')
export class Report extends BaseEntity {
  @Column()
  @Index()
  @IsUUID()
  @IsNotEmpty({ message: 'O ID do usuário é obrigatório' })
  usuarioId: string;

  @Column({
    type: 'enum',
    enum: ReportType,
    default: ReportType.MENSAL
  })
  @IsString({ message: 'O tipo deve ser uma string válida' })
  @IsNotEmpty({ message: 'O tipo é obrigatório' })
  tipo: ReportType;

  @Column({ type: 'timestamp', name: 'data_inicio' })
  @IsDate({ message: 'A data de início deve ser uma data válida' })
  @IsNotEmpty({ message: 'A data de início é obrigatória' })
  dataInicio: Date;

  @Column({ type: 'timestamp', name: 'data_fim' })
  @IsDate({ message: 'A data de fim deve ser uma data válida' })
  @IsNotEmpty({ message: 'A data de fim é obrigatória' })
  dataFim: Date;

  @Column('jsonb', { nullable: true })
  @IsOptional()
  filtros?: Record<string, any>;

  @Column('jsonb', { nullable: true })
  @IsOptional()
  dados?: Record<string, any>;

  @Column({ type: 'timestamp', name: 'data_criacao', default: () => 'CURRENT_TIMESTAMP' })
  dataCriacao: Date;

  /**
   * Serializa o relatório para resposta da API
   * @returns Objeto formatado para resposta da API
   */
  serialize(): Record<string, any> {
    return {
      id: this.id,
      tipo: this.tipo,
      dataInicio: this.dataInicio,
      dataFim: this.dataFim,
      filtros: this.filtros || {},
      dados: this.dados || {},
      dataCriacao: this.dataCriacao,
    };
  }
}