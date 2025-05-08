import { Injectable, NotFoundException } from '@nestjs/common';
import { DebtRepository } from '../repositories/debt.repository';
import { InstallmentRepository } from '../repositories/installment.repository';
import { CreateDebtDto, UpdateDebtDto, FilterDebtDto, UpdateInstallmentDto } from './dto';
import { Debt } from '../models/debt.entity';
import { Installment } from '../models/installment.entity';

@Injectable()
export class DebtsService {
  constructor(
    private readonly debtRepository: DebtRepository,
    private readonly installmentRepository: InstallmentRepository,
  ) {}

  /**
   * Busca todas as dívidas com filtros
   * @param usuarioId ID do usuário
   * @param filterDto Filtros para busca
   * @returns Lista de dívidas e contagem total
   */
  async findAll(usuarioId: string, filterDto: FilterDebtDto): Promise<[Debt[], number]> {
    const { page = 1, limit = 20, ...filters } = filterDto;
    const skip = (page - 1) * limit;

    return this.debtRepository.findAll(usuarioId, {
      ...filters,
      skip,
      take: limit,
    });
  }

  /**
   * Busca uma dívida específica
   * @param id ID da dívida
   * @param usuarioId ID do usuário
   * @returns A dívida encontrada
   */
  async findOne(id: string, usuarioId: string): Promise<Debt> {
    const debt = await this.debtRepository.findById(id, usuarioId);
    
    if (!debt) {
      throw new NotFoundException(`Dívida com ID ${id} não encontrada`);
    }
    
    return debt;
  }

  /**
   * Cria uma nova dívida com parcelas
   * @param usuarioId ID do usuário
   * @param createDebtDto Dados da dívida
   * @returns A dívida criada
   */
  async create(usuarioId: string, createDebtDto: CreateDebtDto): Promise<Debt> {
    // Extrair parcelas do DTO
    const { parcelas, ...debtData } = createDebtDto;
    
    // Criar a dívida sem parcelas primeiro
    const debt = await this.debtRepository.create({
      ...debtData,
      usuarioId,
    });
    
    // Criar parcelas associadas à dívida
    for (const parcela of parcelas) {
      await this.installmentRepository.create({
        ...parcela,
        debtId: debt.id,
      });
    }
    
    // Buscar a dívida completa com parcelas
    return this.findOne(debt.id, usuarioId);
  }

  /**
   * Atualiza uma dívida existente
   * @param id ID da dívida
   * @param usuarioId ID do usuário
   * @param updateDebtDto Dados para atualização
   * @returns A dívida atualizada
   */
  async update(id: string, usuarioId: string, updateDebtDto: UpdateDebtDto): Promise<Debt> {
    // Verificar se a dívida existe
    await this.findOne(id, usuarioId);
    
    // Atualizar a dívida
    const updatedDebt = await this.debtRepository.update(id, updateDebtDto, usuarioId);
    
    if (!updatedDebt) {
      throw new NotFoundException(`Dívida com ID ${id} não encontrada`);
    }
    
    return updatedDebt;
  }

  /**
   * Remove uma dívida
   * @param id ID da dívida
   * @param usuarioId ID do usuário
   */
  async remove(id: string, usuarioId: string): Promise<void> {
    // Verificar se a dívida existe
    await this.findOne(id, usuarioId);
    
    const result = await this.debtRepository.remove(id, usuarioId);
    
    if (!result) {
      throw new NotFoundException(`Dívida com ID ${id} não encontrada`);
    }
  }

  /**
   * Busca parcelas de uma dívida
   * @param debtId ID da dívida
   * @param usuarioId ID do usuário
   * @returns Lista de parcelas
   */
  async findInstallments(debtId: string, usuarioId: string): Promise<Installment[]> {
    // Verificar se a dívida existe e pertence ao usuário
    await this.findOne(debtId, usuarioId);
    
    // Buscar parcelas
    const [installments] = await this.installmentRepository.findByDebtId(debtId);
    return installments;
  }

  /**
   * Busca uma parcela específica
   * @param debtId ID da dívida
   * @param installmentId ID da parcela
   * @param usuarioId ID do usuário
   * @returns A parcela encontrada
   */
  async findInstallment(debtId: string, installmentId: string, usuarioId: string): Promise<Installment> {
    // Verificar se a dívida existe e pertence ao usuário
    await this.findOne(debtId, usuarioId);
    
    // Buscar parcela
    const installment = await this.installmentRepository.findById(installmentId);
    
    if (!installment || installment.debtId !== debtId) {
      throw new NotFoundException(`Parcela com ID ${installmentId} não encontrada para a dívida ${debtId}`);
    }
    
    return installment;
  }

  /**
   * Atualiza uma parcela
   * @param debtId ID da dívida
   * @param installmentId ID da parcela
   * @param usuarioId ID do usuário
   * @param updateInstallmentDto Dados para atualização
   * @returns A parcela atualizada
   */
  async updateInstallment(
    debtId: string,
    installmentId: string,
    usuarioId: string,
    updateInstallmentDto: UpdateInstallmentDto,
  ): Promise<Installment> {
    // Verificar se a parcela existe e pertence à dívida do usuário
    await this.findInstallment(debtId, installmentId, usuarioId);
    
    // Atualizar parcela
    const updatedInstallment = await this.installmentRepository.update(
      installmentId,
      updateInstallmentDto,
    );
    
    if (!updatedInstallment) {
      throw new NotFoundException(`Parcela com ID ${installmentId} não encontrada`);
    }
    
    // Atualizar status da dívida após atualizar parcela
    const debt = await this.findOne(debtId, usuarioId);
    debt.atualizarStatus();
    await this.debtRepository.update(debtId, { status: debt.status }, usuarioId);
    
    return updatedInstallment;
  }

  /**
   * Marca uma parcela como paga
   * @param debtId ID da dívida
   * @param installmentId ID da parcela
   * @param usuarioId ID do usuário
   * @param dataPagamento Data de pagamento (opcional)
   * @param observacao Observação (opcional)
   * @returns A parcela atualizada
   */
  async payInstallment(
    debtId: string,
    installmentId: string,
    usuarioId: string,
    dataPagamento?: Date,
    observacao?: string,
  ): Promise<Installment> {
    // Verificar se a parcela existe e pertence à dívida do usuário
    await this.findInstallment(debtId, installmentId, usuarioId);
    
    // Marcar parcela como paga
    const updatedInstallment = await this.installmentRepository.marcarComoPaga(
      installmentId,
      dataPagamento,
      observacao,
    );
    
    if (!updatedInstallment) {
      throw new NotFoundException(`Parcela com ID ${installmentId} não encontrada`);
    }
    
    // Atualizar status da dívida após pagar parcela
    const debt = await this.findOne(debtId, usuarioId);
    debt.atualizarStatus();
    await this.debtRepository.update(debtId, { status: debt.status }, usuarioId);
    
    return updatedInstallment;
  }

  /**
   * Calcula o resumo de dívidas do usuário
   * @param usuarioId ID do usuário
   * @returns Resumo de dívidas
   */
  async getDebtSummary(usuarioId: string): Promise<{
    totalDividas: number;
    totalPago: number;
    totalPendente: number;
    quantidadeDividas: number;
    quantidadePagas: number;
    quantidadePendentes: number;
    quantidadeAtrasadas: number;
  }> {
    return this.debtRepository.calcularResumo(usuarioId);
  }

  /**
   * Busca dívidas com parcelas próximas do vencimento
   * @param usuarioId ID do usuário
   * @param diasAntecedencia Dias de antecedência
   * @returns Lista de dívidas com parcelas próximas do vencimento
   */
  async findUpcomingPayments(usuarioId: string, diasAntecedencia: number = 3): Promise<Debt[]> {
    return this.debtRepository.findWithUpcomingInstallments(usuarioId, diasAntecedencia);
  }

  /**
   * Busca dívidas com parcelas atrasadas
   * @param usuarioId ID do usuário
   * @returns Lista de dívidas com parcelas atrasadas
   */
  async findOverduePayments(usuarioId: string): Promise<Debt[]> {
    return this.debtRepository.findWithOverdueInstallments(usuarioId);
  }
}