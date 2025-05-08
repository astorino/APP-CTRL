import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository, Between } from 'typeorm';
import { Debt, DebtStatus } from '../models/debt.entity';

@Injectable()
export class DebtRepository {
  constructor(
    @InjectRepository(Debt)
    private debtRepository: Repository<Debt>,
  ) {}

  /**
   * Encontra uma dívida pelo ID
   * @param id ID da dívida
   * @param usuarioId ID do usuário (para verificação de propriedade)
   * @returns A dívida encontrada ou null
   */
  async findById(id: string, usuarioId?: string): Promise<Debt | null> {
    const where: FindOptionsWhere<Debt> = { id };
    
    if (usuarioId) {
      where.usuarioId = usuarioId;
    }
    
    return this.debtRepository.findOne({ where });
  }

  /**
   * Busca dívidas com filtros
   * @param usuarioId ID do usuário
   * @param options Opções de filtro
   * @returns Lista de dívidas
   */
  async findAll(
    usuarioId: string,
    options?: {
      status?: DebtStatus;
      dataInicio?: Date;
      dataFim?: Date;
      search?: string;
      skip?: number;
      take?: number;
    },
  ): Promise<[Debt[], number]> {
    const where: FindOptionsWhere<Debt> = { usuarioId };
    
    if (options?.status) {
      where.status = options.status;
    }
    
    if (options?.dataInicio && options?.dataFim) {
      where.dataInicio = Between(options.dataInicio, options.dataFim);
    }
    
    // Nota: search não é implementado diretamente aqui porque o TypeORM
    // não suporta pesquisa de texto completo de forma simples.
    // Para implementar search, seria necessário usar QueryBuilder.
    
    return this.debtRepository.findAndCount({
      where,
      skip: options?.skip,
      take: options?.take,
      order: { dataInicio: 'DESC' },
    });
  }

  /**
   * Cria uma nova dívida
   * @param data Dados da dívida
   * @returns A dívida criada
   */
  async create(data: Partial<Debt>): Promise<Debt> {
    const debt = this.debtRepository.create(data);
    
    // Atualiza o status com base nas parcelas
    debt.atualizarStatus();
    
    return this.debtRepository.save(debt);
  }

  /**
   * Atualiza uma dívida existente
   * @param id ID da dívida
   * @param data Dados para atualização
   * @param usuarioId ID do usuário (para verificação de propriedade)
   * @returns A dívida atualizada ou null se não encontrada
   */
  async update(
    id: string,
    data: Partial<Debt>,
    usuarioId?: string,
  ): Promise<Debt | null> {
    const debt = await this.findById(id, usuarioId);
    
    if (!debt) {
      return null;
    }
    
    Object.assign(debt, data);
    
    // Atualiza o status com base nas parcelas
    debt.atualizarStatus();
    
    return this.debtRepository.save(debt);
  }

  /**
   * Remove uma dívida
   * @param id ID da dívida
   * @param usuarioId ID do usuário (para verificação de propriedade)
   * @returns true se removida, false se não encontrada
   */
  async remove(id: string, usuarioId?: string): Promise<boolean> {
    const debt = await this.findById(id, usuarioId);
    
    if (!debt) {
      return false;
    }
    
    await this.debtRepository.softRemove(debt);
    return true;
  }

  /**
   * Busca dívidas com parcelas próximas do vencimento
   * @param usuarioId ID do usuário
   * @param diasAntecedencia Número de dias de antecedência para notificação
   * @returns Lista de dívidas com parcelas próximas do vencimento
   */
  async findWithUpcomingInstallments(
    usuarioId: string,
    diasAntecedencia: number = 3,
  ): Promise<Debt[]> {
    const hoje = new Date();
    const dataLimite = new Date();
    dataLimite.setDate(hoje.getDate() + diasAntecedencia);
    
    // Esta consulta é mais complexa e requer QueryBuilder
    const debts = await this.debtRepository
      .createQueryBuilder('debt')
      .leftJoinAndSelect('debt.parcelas', 'installment')
      .where('debt.usuarioId = :usuarioId', { usuarioId })
      .andWhere('debt.status != :status', { status: DebtStatus.PAID })
      .andWhere('installment.dataPagamento IS NULL')
      .andWhere('installment.dataVencimento BETWEEN :hoje AND :dataLimite', {
        hoje,
        dataLimite,
      })
      .getMany();
    
    return debts;
  }

  /**
   * Busca dívidas com parcelas atrasadas
   * @param usuarioId ID do usuário
   * @returns Lista de dívidas com parcelas atrasadas
   */
  async findWithOverdueInstallments(usuarioId: string): Promise<Debt[]> {
    const hoje = new Date();
    
    // Esta consulta é mais complexa e requer QueryBuilder
    const debts = await this.debtRepository
      .createQueryBuilder('debt')
      .leftJoinAndSelect('debt.parcelas', 'installment')
      .where('debt.usuarioId = :usuarioId', { usuarioId })
      .andWhere('debt.status != :status', { status: DebtStatus.PAID })
      .andWhere('installment.dataPagamento IS NULL')
      .andWhere('installment.dataVencimento < :hoje', { hoje })
      .getMany();
    
    return debts;
  }

  /**
   * Calcula o resumo de dívidas do usuário
   * @param usuarioId ID do usuário
   * @returns Resumo de dívidas
   */
  async calcularResumo(usuarioId: string): Promise<{
    totalDividas: number;
    totalPago: number;
    totalPendente: number;
    quantidadeDividas: number;
    quantidadePagas: number;
    quantidadePendentes: number;
    quantidadeAtrasadas: number;
  }> {
    const [dividas] = await this.findAll(usuarioId);
    
    let totalDividas = 0;
    let totalPago = 0;
    let totalPendente = 0;
    let quantidadePagas = 0;
    let quantidadePendentes = 0;
    let quantidadeAtrasadas = 0;
    
    dividas.forEach(divida => {
      const valorTotal = Number(divida.valorTotal);
      totalDividas += valorTotal;
      
      const progresso = divida.calcularProgresso();
      totalPago += progresso.valorPago;
      totalPendente += progresso.valorPendente;
      
      if (divida.status === DebtStatus.PAID) {
        quantidadePagas++;
      } else {
        quantidadePendentes++;
      }
      
      if (divida.status === DebtStatus.OVERDUE) {
        quantidadeAtrasadas++;
      }
    });
    
    return {
      totalDividas,
      totalPago,
      totalPendente,
      quantidadeDividas: dividas.length,
      quantidadePagas,
      quantidadePendentes,
      quantidadeAtrasadas,
    };
  }
}