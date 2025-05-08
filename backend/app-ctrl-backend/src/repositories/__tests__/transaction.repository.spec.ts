import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionRepository } from '../transaction.repository';
import { Transaction, TransactionType } from '../../models/transaction.entity';

describe('TransactionRepository', () => {
  let transactionRepository: TransactionRepository;
  let typeOrmRepository: Repository<Transaction>;

  const createMockTransaction = (overrides = {}): Transaction => {
    const transaction = new Transaction();
    Object.assign(transaction, {
      id: '123e4567-e89b-12d3-a456-426614174000',
      usuarioId: '123e4567-e89b-12d3-a456-426614174001',
      tipo: TransactionType.RECEITA,
      valor: 100,
      data: new Date(),
      categoriaId: '123e4567-e89b-12d3-a456-426614174002',
      descricao: 'Salário',
      recorrente: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    });
    return transaction;
  };

  const mockTransaction = createMockTransaction();

  const mockTransactionArray = [
    mockTransaction,
    createMockTransaction({
      id: '123e4567-e89b-12d3-a456-426614174003',
      tipo: TransactionType.DESPESA,
      valor: 50,
      descricao: 'Supermercado',
    }),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionRepository,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockTransaction),
            find: jest.fn().mockResolvedValue(mockTransactionArray),
            findAndCount: jest.fn().mockResolvedValue([mockTransactionArray, 2]),
            create: jest.fn().mockReturnValue(mockTransaction),
            save: jest.fn().mockResolvedValue(mockTransaction),
            softRemove: jest.fn().mockResolvedValue(mockTransaction),
          },
        },
      ],
    }).compile();

    transactionRepository = module.get<TransactionRepository>(TransactionRepository);
    typeOrmRepository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
  });

  it('should be defined', () => {
    expect(transactionRepository).toBeDefined();
  });

  describe('findById', () => {
    it('should find a transaction by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const result = await transactionRepository.findById(id);
      
      expect(result).toEqual(mockTransaction);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should find a transaction by id and usuarioId', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const usuarioId = '123e4567-e89b-12d3-a456-426614174001';
      const result = await transactionRepository.findById(id, usuarioId);
      
      expect(result).toEqual(mockTransaction);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id, usuarioId },
      });
    });
  });

  describe('findAll', () => {
    it('should find all transactions for a user', async () => {
      const usuarioId = '123e4567-e89b-12d3-a456-426614174001';
      const result = await transactionRepository.findAll(usuarioId);
      
      expect(result).toEqual([mockTransactionArray, 2]);
      expect(typeOrmRepository.findAndCount).toHaveBeenCalledWith({
        where: { usuarioId },
        skip: undefined,
        take: undefined,
        order: { data: 'DESC' },
      });
    });

    it('should find transactions with filters', async () => {
      const usuarioId = '123e4567-e89b-12d3-a456-426614174001';
      const options = {
        tipo: TransactionType.RECEITA,
        categoriaId: '123e4567-e89b-12d3-a456-426614174002',
        dataInicio: new Date('2023-01-01'),
        dataFim: new Date('2023-12-31'),
        skip: 0,
        take: 10,
      };
      
      await transactionRepository.findAll(usuarioId, options);
      
      expect(typeOrmRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const transactionData = {
        usuarioId: '123e4567-e89b-12d3-a456-426614174001',
        tipo: TransactionType.RECEITA,
        valor: 100,
        data: new Date(),
        categoriaId: '123e4567-e89b-12d3-a456-426614174002',
        descricao: 'Salário',
      };
      
      const result = await transactionRepository.create(transactionData);
      
      expect(result).toEqual(mockTransaction);
      expect(typeOrmRepository.create).toHaveBeenCalledWith(transactionData);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(mockTransaction);
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = { valor: 150 };
      
      jest.spyOn(transactionRepository, 'findById').mockResolvedValue(createMockTransaction());
      
      const result = await transactionRepository.update(id, updateData);
      
      expect(result).toEqual(mockTransaction);
      expect(transactionRepository.findById).toHaveBeenCalledWith(id, undefined);
      expect(typeOrmRepository.save).toHaveBeenCalled();
    });

    it('should return null if transaction not found', async () => {
      const id = 'non-existent-id';
      const updateData = { valor: 150 };
      
      jest.spyOn(transactionRepository, 'findById').mockResolvedValue(null);
      
      const result = await transactionRepository.update(id, updateData);
      
      expect(result).toBeNull();
      expect(transactionRepository.findById).toHaveBeenCalledWith(id, undefined);
      expect(typeOrmRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a transaction', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      
      jest.spyOn(transactionRepository, 'findById').mockResolvedValue(createMockTransaction());
      
      const result = await transactionRepository.remove(id);
      
      expect(result).toBe(true);
      expect(transactionRepository.findById).toHaveBeenCalledWith(id, undefined);
      expect(typeOrmRepository.softRemove).toHaveBeenCalled();
    });

    it('should return false if transaction not found', async () => {
      const id = 'non-existent-id';
      
      jest.spyOn(transactionRepository, 'findById').mockResolvedValue(null);
      
      const result = await transactionRepository.remove(id);
      
      expect(result).toBe(false);
      expect(transactionRepository.findById).toHaveBeenCalledWith(id, undefined);
      expect(typeOrmRepository.softRemove).not.toHaveBeenCalled();
    });
  });

  describe('calcularSaldo', () => {
    it('should calculate balance for a user', async () => {
      const usuarioId = '123e4567-e89b-12d3-a456-426614174001';
      
      jest.spyOn(typeOrmRepository, 'find').mockResolvedValue(mockTransactionArray as Transaction[]);
      
      const result = await transactionRepository.calcularSaldo(usuarioId);
      
      expect(result).toEqual({
        receitas: 100,
        despesas: 50,
        saldo: 50,
      });
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: { usuarioId },
      });
    });
  });
});