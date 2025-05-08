import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository, Between, IsNull } from 'typeorm';
import { Installment, InstallmentStatus } from '../models/installment.entity';

@Injectable()
export class InstallmentRepository {
  constructor(
    @InjectRepository(Installment)
    private installmentRepository: Repository<Installment>,
  ) {}

  /**
   * Encontra uma parcela pelo ID
   * @param id ID da parcela
   * @returns A parcela encontrada ou null
   */
  async findById(id: string): Promise<Installment | null> {
    return this.installmentRepository.findOne({ where: { id } });
  }

  /**
   * Busca parcelas de uma dívida
   * @param debtId ID da dívida
   * @param options Opções de filtro
   * @returns Lista de parcelas
   */
  async findByDebtId(
    debtId: string,
    options?: {
      status?: InstallmentStatus;
      dataInicio?: Date;
      dataFim?: Date;
      skip?: number;
      take?: number;
    },
  ): Promise<[Installment[], number]> {
    const where: FindOptionsWhere<Installment> = { debtId };
    
    if (options?.status) {
      where.status = options.status;
    }
    
    if (options?.dataInicio && options?.dataFim) {
      where.dataVencimento = Between(options.dataInicio, options.dataFim);
    }
    
    return this.installmentRepository.findAndCount({
      where,
      skip: options?.skip,
      take: options?.take,
      order: { numero: 'ASC' },
    });
  }

  /**
   * Cria uma nova parcela
   * @param data Dados da parcela
   * @returns A parcela criada
   */
  async create(data: Partial<Installment>): Promise<Installment> {
    const installment = this.installmentRepository.create(data);
    
    // Atualiza o status com base na data de pagamento e vencimento
    installment.atualizarStatus();
    
    return this.installmentRepository.save(installment);
  }

  /**
   * Atualiza uma parcela existente
   * @param id ID da parcela
   * @param data Dados para atualização
   * @returns A parcela atualizada ou null se não encontrada
   */
  async update(
    id: string,
    data: Partial<Installment>,
  ): Promise<Installment | null> {
    const installment = await this.findById(id);
    
    if (!installment) {
      return null;
    }
    
    Object.assign(installment, data);
    
    // Atualiza o status com base na data de pagamento e vencimento
    installment.atualizarStatus();
    
    return this.installmentRepository.save(installment);
  }

  /**
   * Remove uma parcela
   * @param id ID da parcela
   * @returns true se removida, false se não encontrada
   */
  async remove(id: string): Promise<boolean> {
    const installment = await this.findById(id);
    
    if (!installment) {
      return false;
    }
    
    await this.installmentRepository.softRemove(installment);
    return true;
  }

  /**
   * Marca uma parcela como paga
   * @param id ID da parcela
   * @param dataPagamento Data de pagamento (opcional, padrão: data atual)
   * @param observacao Observação opcional
   * @returns A parcela atualizada ou null se não encontrada
   */
  async marcarComoPaga(
    id: string,
    dataPagamento: Date = new Date(),
    observacao?: string,
  ): Promise<Installment | null> {
    const installment = await this.findById(id);
    
    if (!installment) {
      return null;
    }
    
    installment.dataPagamento = dataPagamento;
    installment.status = InstallmentStatus.PAID;
    
    if (observacao) {
      installment.observacao = observacao;
    }
    
    return this.installmentRepository.save(installment);
  }

  /**
   * Busca parcelas próximas do vencimento
   * @param diasAntecedencia Número de dias de antecedência para notificação
   * @returns Lista de parcelas próximas do vencimento
   */
  async findUpcoming(diasAntecedencia: number = 3): Promise<Installment[]> {
    const hoje = new Date();
    const dataLimite = new Date();
    dataLimite.setDate(hoje.getDate() + diasAntecedencia);
    
    return this.installmentRepository.find({
      where: {
        dataPagamento: IsNull(),
        dataVencimento: Between(hoje, dataLimite),
      },
      order: {
        dataVencimento: 'ASC',
      },
    });
  }

  /**
   * Busca parcelas atrasadas
   * @returns Lista de parcelas atrasadas
   */
  async findOverdue(): Promise<Installment[]> {
    const hoje = new Date();
    
    return this.installmentRepository.find({
      where: {
        dataPagamento: IsNull(),
        dataVencimento: Between(new Date(2000, 0, 1), hoje),
      },
      order: {
        dataVencimento: 'ASC',
      },
    });
  }

  /**
   * Cria múltiplas parcelas para uma dívida
   * @param debtId ID da dívida
   * @param valorTotal Valor total da dívida
   * @param quantidadeParcelas Quantidade de parcelas
   * @param dataInicio Data da primeira parcela
   * @param intervaloMeses Intervalo em meses entre as parcelas
   * @returns Lista de parcelas criadas
   */
  async criarParcelas(
    debtId: string,
    valorTotal: number,
    quantidadeParcelas: number,
    dataInicio: Date,
    intervaloMeses: number = 1,
  ): Promise<Installment[]> {
    const valorParcela = Number((valorTotal / quantidadeParcelas).toFixed(2));
    const parcelas: Installment[] = [];
    
    // Ajusta o valor da última parcela para compensar arredondamentos
    const ajuste = valorTotal - (valorParcela * quantidadeParcelas);
    
    for (let i = 0; i < quantidadeParcelas; i++) {
      const dataVencimento = new Date(dataInicio);
      dataVencimento.setMonth(dataInicio.getMonth() + (i * intervaloMeses));
      
      // Ajusta o valor da última parcela
      const valor = i === quantidadeParcelas - 1
        ? valorParcela + ajuste
        : valorParcela;
      
      const parcela = this.installmentRepository.create({
        debtId,
        numero: i + 1,
        valor,
        dataVencimento,
        status: InstallmentStatus.PENDING,
      });
      
      parcelas.push(parcela);
    }
    
    return this.installmentRepository.save(parcelas);
  }
}