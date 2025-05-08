import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateTransactionDto, UpdateTransactionDto, FilterTransactionDto } from './dto';
import { Transaction } from '../models/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async findAll(usuarioId: string, filterDto: FilterTransactionDto): Promise<[Transaction[], number]> {
    const { page = 1, limit = 20, ...filters } = filterDto;
    const skip = (page - 1) * limit;

    return this.transactionRepository.findAll(usuarioId, {
      ...filters,
      skip,
      take: limit,
    });
  }

  async findOne(id: string, usuarioId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id, usuarioId);
    
    if (!transaction) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada`);
    }
    
    return transaction;
  }

  async create(usuarioId: string, createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    // Verificar se a categoria existe
    const category = await this.categoryRepository.findById(
      createTransactionDto.categoriaId,
      usuarioId,
    );
    
    if (!category) {
      throw new NotFoundException(
        `Categoria com ID ${createTransactionDto.categoriaId} não encontrada`,
      );
    }
    
    return this.transactionRepository.create({
      ...createTransactionDto,
      usuarioId,
    });
  }

  async update(id: string, usuarioId: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    // Verificar se a transação existe
    const transaction = await this.findOne(id, usuarioId);
    
    // Verificar se a categoria existe, se estiver sendo atualizada
    if (updateTransactionDto.categoriaId) {
      const category = await this.categoryRepository.findById(
        updateTransactionDto.categoriaId,
        usuarioId,
      );
      
      if (!category) {
        throw new NotFoundException(
          `Categoria com ID ${updateTransactionDto.categoriaId} não encontrada`,
        );
      }
    }
    
    const updatedTransaction = await this.transactionRepository.update(
      id,
      updateTransactionDto,
      usuarioId,
    );
    
    if (!updatedTransaction) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada`);
    }
    
    return updatedTransaction;
  }

  async remove(id: string, usuarioId: string): Promise<void> {
    // Verificar se a transação existe
    await this.findOne(id, usuarioId);
    
    const result = await this.transactionRepository.remove(id, usuarioId);
    
    if (!result) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada`);
    }
  }

  async getSummary(usuarioId: string, dataInicio?: Date, dataFim?: Date): Promise<{ receitas: number; despesas: number; saldo: number }> {
    return this.transactionRepository.calcularSaldo(usuarioId, {
      dataInicio,
      dataFim,
    });
  }
}