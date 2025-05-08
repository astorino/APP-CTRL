import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryRepository } from '../category.repository';
import { Category, CategoryType } from '../../models/category.entity';

describe('CategoryRepository', () => {
  let categoryRepository: CategoryRepository;
  let typeOrmRepository: Repository<Category>;

  const createMockCategory = (overrides = {}): Category => {
    const category = new Category();
    Object.assign(category, {
      id: '123e4567-e89b-12d3-a456-426614174000',
      usuarioId: '123e4567-e89b-12d3-a456-426614174001',
      nome: 'Alimentação',
      tipo: CategoryType.DESPESA,
      cor: '#FF5733',
      icone: 'restaurant',
      padrao: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    });
    return category;
  };

  const mockCategory = createMockCategory();

  const mockCategoryArray = [
    mockCategory,
    createMockCategory({
      id: '123e4567-e89b-12d3-a456-426614174003',
      nome: 'Salário',
      tipo: CategoryType.RECEITA,
      cor: '#4CAF50',
      icone: 'work',
    }),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryRepository,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockCategory),
            find: jest.fn().mockResolvedValue(mockCategoryArray),
            findAndCount: jest.fn().mockResolvedValue([mockCategoryArray, 2]),
            create: jest.fn().mockReturnValue(mockCategory),
            save: jest.fn().mockResolvedValue(mockCategory),
            softRemove: jest.fn().mockResolvedValue(mockCategory),
          },
        },
      ],
    }).compile();

    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
    typeOrmRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(categoryRepository).toBeDefined();
  });

  describe('findById', () => {
    it('should find a category by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const result = await categoryRepository.findById(id);
      
      expect(result).toEqual(mockCategory);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should find a category by id and usuarioId', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const usuarioId = '123e4567-e89b-12d3-a456-426614174001';
      const result = await categoryRepository.findById(id, usuarioId);
      
      expect(result).toEqual(mockCategory);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id, usuarioId },
      });
    });
  });

  describe('findAll', () => {
    it('should find all categories for a user', async () => {
      const usuarioId = '123e4567-e89b-12d3-a456-426614174001';
      const result = await categoryRepository.findAll(usuarioId);
      
      expect(result).toEqual([mockCategoryArray, 2]);
      expect(typeOrmRepository.findAndCount).toHaveBeenCalledWith({
        where: { usuarioId },
        skip: undefined,
        take: undefined,
        order: { nome: 'ASC' },
      });
    });

    it('should find categories with filters', async () => {
      const usuarioId = '123e4567-e89b-12d3-a456-426614174001';
      const options = {
        tipo: CategoryType.DESPESA,
        padrao: true,
        skip: 0,
        take: 10,
      };
      
      await categoryRepository.findAll(usuarioId, options);
      
      expect(typeOrmRepository.findAndCount).toHaveBeenCalledWith({
        where: { usuarioId, tipo: CategoryType.DESPESA, padrao: true },
        skip: 0,
        take: 10,
        order: { nome: 'ASC' },
      });
    });
  });

  describe('create', () => {
    it('should create a category', async () => {
      const categoryData = {
        usuarioId: '123e4567-e89b-12d3-a456-426614174001',
        nome: 'Alimentação',
        tipo: CategoryType.DESPESA,
        cor: '#FF5733',
        icone: 'restaurant',
      };
      
      const result = await categoryRepository.create(categoryData);
      
      expect(result).toEqual(mockCategory);
      expect(typeOrmRepository.create).toHaveBeenCalledWith(categoryData);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(mockCategory);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = { nome: 'Alimentação e Bebidas' };
      
      jest.spyOn(categoryRepository, 'findById').mockResolvedValue(createMockCategory());
      
      const result = await categoryRepository.update(id, updateData);
      
      expect(result).toEqual(mockCategory);
      expect(categoryRepository.findById).toHaveBeenCalledWith(id, undefined);
      expect(typeOrmRepository.save).toHaveBeenCalled();
    });

    it('should return null if category not found', async () => {
      const id = 'non-existent-id';
      const updateData = { nome: 'Alimentação e Bebidas' };
      
      jest.spyOn(categoryRepository, 'findById').mockResolvedValue(null);
      
      const result = await categoryRepository.update(id, updateData);
      
      expect(result).toBeNull();
      expect(categoryRepository.findById).toHaveBeenCalledWith(id, undefined);
      expect(typeOrmRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      
      jest.spyOn(categoryRepository, 'findById').mockResolvedValue(createMockCategory());
      
      const result = await categoryRepository.remove(id);
      
      expect(result).toBe(true);
      expect(categoryRepository.findById).toHaveBeenCalledWith(id, undefined);
      expect(typeOrmRepository.softRemove).toHaveBeenCalled();
    });

    it('should return false if category not found', async () => {
      const id = 'non-existent-id';
      
      jest.spyOn(categoryRepository, 'findById').mockResolvedValue(null);
      
      const result = await categoryRepository.remove(id);
      
      expect(result).toBe(false);
      expect(categoryRepository.findById).toHaveBeenCalledWith(id, undefined);
      expect(typeOrmRepository.softRemove).not.toHaveBeenCalled();
    });
  });

  describe('findDefaultsByType', () => {
    it('should find default categories by type', async () => {
      const tipo = CategoryType.DESPESA;
      
      await categoryRepository.findDefaultsByType(tipo);
      
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: {
          tipo,
          padrao: true,
        },
        order: {
          nome: 'ASC',
        },
      });
    });
  });

  describe('createDefaultsForUser', () => {
    it('should create default categories for a user', async () => {
      const usuarioId = '123e4567-e89b-12d3-a456-426614174001';
      const mockDefaultCategories = [createMockCategory(), createMockCategory()];
      
      jest.spyOn(typeOrmRepository, 'create').mockReturnValue(mockDefaultCategories as any);
      jest.spyOn(typeOrmRepository, 'save').mockResolvedValue(mockDefaultCategories as any);
      
      const result = await categoryRepository.createDefaultsForUser(usuarioId);
      
      expect(result).toEqual(mockDefaultCategories);
      expect(typeOrmRepository.create).toHaveBeenCalled();
      expect(typeOrmRepository.save).toHaveBeenCalledWith(mockDefaultCategories);
    });
  });
});