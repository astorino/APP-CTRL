import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { Transaction, TransactionType } from '../models/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  /**
   * Encontra uma transação pelo ID
   * @param id ID da transação
   * @param usuarioId ID do usuário (para verificação de propriedade)
   * @returns A transação encontrada ou null
   */
  async findById(id: string, usuarioId?: string): Promise<Transaction | null> {
    const where: FindOptionsWhere<Transaction> = { id };
    
    if (usuarioId) {
      where.usuarioId = usuarioId;
    }
    
    return this.transactionRepository.findOne({ where });
  }

  /**
   * Busca transações com filtros
   * @param usuarioId ID do usuário
   * @param options Opções de filtro
   * @returns Lista de transações
   */
  async findAll(
    usuarioId: string,
    options?: {
      tipo?: TransactionType;
      categoriaId?: string;
      dataInicio?: Date;
      dataFim?: Date;
      search?: string;
      skip?: number;
      take?: number;
    },
  ): Promise<[Transaction[], number]> {
    const where: FindOptionsWhere<Transaction> = { usuarioId };
    
    if (options?.tipo) {
      where.tipo = options.tipo;
    }
    
    if (options?.categoriaId) {
      where.categoriaId = options.categoriaId;
    }
    
    if (options?.dataInicio && options?.dataFim) {
      where.data = Between(options.dataInicio, options.dataFim);
    }
    
    // Nota: search não é implementado diretamente aqui porque o TypeORM
    // não suporta pesquisa de texto completo de forma simples.
    // Para implementar search, seria necessário usar QueryBuilder ou
    // uma extensão específica do PostgreSQL.
    
    return this.transactionRepository.findAndCount({
      where,
      skip: options?.skip,
      take: options?.take,
      order: { data: 'DESC' },
    });
  }

  /**
   * Cria uma nova transação
   * @param data Dados da transação
   * @returns A transação criada
   */
  async create(data: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.transactionRepository.create(data);
    return this.transactionRepository.save(transaction);
  }

  /**
   * Atualiza uma transação existente
   * @param id ID da transação
   * @param data Dados para atualização
   * @param usuarioId ID do usuário (para verificação de propriedade)
   * @returns A transação atualizada ou null se não encontrada
   */
  async update(
    id: string,
    data: Partial<Transaction>,
    usuarioId?: string,
  ): Promise<Transaction | null> {
    const transaction = await this.findById(id, usuarioId);
    
    if (!transaction) {
      return null;
    }
    
    Object.assign(transaction, data);
    return this.transactionRepository.save(transaction);
  }

  /**
   * Remove uma transação
   * @param id ID da transação
   * @param usuarioId ID do usuário (para verificação de propriedade)
   * @returns true se removida, false se não encontrada
   */
  async remove(id: string, usuarioId?: string): Promise<boolean> {
    const transaction = await this.findById(id, usuarioId);
    
    if (!transaction) {
      return false;
    }
    
    await this.transactionRepository.softRemove(transaction);
    return true;
  }

  /**
   * Calcula o saldo (receitas - despesas) para um período
   * @param usuarioId ID do usuário
   * @param options Opções de filtro
   * @returns Objeto com receitas, despesas e saldo
   */
  async calcularSaldo(
    usuarioId: string,
    options?: {
      dataInicio?: Date;
      dataFim?: Date;
    },
  ): Promise<{ receitas: number; despesas: number; saldo: number }> {
    const where: FindOptionsWhere<Transaction> = { usuarioId };
    
    if (options?.dataInicio && options?.dataFim) {
      where.data = Between(options.dataInicio, options.dataFim);
    }
    
    const transactions = await this.transactionRepository.find({ where });
    
    const receitas = transactions
      .filter(t => t.tipo === TransactionType.RECEITA)
      .reduce((sum, t) => sum + Number(t.valor), 0);
      
    const despesas = transactions
      .filter(t => t.tipo === TransactionType.DESPESA)
      .reduce((sum, t) => sum + Number(t.valor), 0);
    
    return {
      receitas,
      despesas,
      saldo: receitas - despesas,
    };
  }

  /**
   * Busca transações de uma categoria específica
   * @param usuarioId ID do usuário
   * @param categoriaId ID da categoria
   * @param options Opções de filtro
   * @returns Lista de transações
   */
  async findByCategoria(
    usuarioId: string,
    categoriaId: string,
    options?: {
      dataInicio?: Date;
      dataFim?: Date;
      skip?: number;
      take?: number;
    },
  ): Promise<[Transaction[], number]> {
    const where: FindOptionsWhere<Transaction> = { 
      usuarioId,
      categoriaId,
    };
    
    if (options?.dataInicio && options?.dataFim) {
      where.data = Between(options.dataInicio, options.dataFim);
    }
    
    return this.transactionRepository.findAndCount({
      where,
      skip: options?.skip,
      take: options?.take,
      order: { data: 'DESC' },
    });
  }
}