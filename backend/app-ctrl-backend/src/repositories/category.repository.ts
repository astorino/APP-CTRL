import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Category, CategoryType } from '../models/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  /**
   * Encontra uma categoria pelo ID
   * @param id ID da categoria
   * @param usuarioId ID do usuário (para verificação de propriedade)
   * @returns A categoria encontrada ou null
   */
  async findById(id: string, usuarioId?: string): Promise<Category | null> {
    const where: FindOptionsWhere<Category> = { id };
    
    if (usuarioId) {
      where.usuarioId = usuarioId;
    }
    
    return this.categoryRepository.findOne({ where });
  }

  /**
   * Busca categorias com filtros
   * @param usuarioId ID do usuário
   * @param options Opções de filtro
   * @returns Lista de categorias
   */
  async findAll(
    usuarioId: string,
    options?: {
      tipo?: CategoryType;
      padrao?: boolean;
      skip?: number;
      take?: number;
    },
  ): Promise<[Category[], number]> {
    const where: FindOptionsWhere<Category> = { usuarioId };
    
    if (options?.tipo) {
      where.tipo = options.tipo;
    }
    
    if (options?.padrao !== undefined) {
      where.padrao = options.padrao;
    }
    
    return this.categoryRepository.findAndCount({
      where,
      skip: options?.skip,
      take: options?.take,
      order: { nome: 'ASC' },
    });
  }

  /**
   * Cria uma nova categoria
   * @param data Dados da categoria
   * @returns A categoria criada
   */
  async create(data: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create(data);
    return this.categoryRepository.save(category);
  }

  /**
   * Atualiza uma categoria existente
   * @param id ID da categoria
   * @param data Dados para atualização
   * @param usuarioId ID do usuário (para verificação de propriedade)
   * @returns A categoria atualizada ou null se não encontrada
   */
  async update(
    id: string,
    data: Partial<Category>,
    usuarioId?: string,
  ): Promise<Category | null> {
    const category = await this.findById(id, usuarioId);
    
    if (!category) {
      return null;
    }
    
    Object.assign(category, data);
    return this.categoryRepository.save(category);
  }

  /**
   * Remove uma categoria
   * @param id ID da categoria
   * @param usuarioId ID do usuário (para verificação de propriedade)
   * @returns true se removida, false se não encontrada
   */
  async remove(id: string, usuarioId?: string): Promise<boolean> {
    const category = await this.findById(id, usuarioId);
    
    if (!category) {
      return false;
    }
    
    await this.categoryRepository.softRemove(category);
    return true;
  }

  /**
   * Busca categorias padrão por tipo
   * @param tipo Tipo da categoria (receita/despesa)
   * @returns Lista de categorias padrão
   */
  async findDefaultsByType(tipo: CategoryType): Promise<Category[]> {
    return this.categoryRepository.find({
      where: {
        tipo,
        padrao: true,
      },
      order: {
        nome: 'ASC',
      },
    });
  }

  /**
   * Cria categorias padrão para um novo usuário
   * @param usuarioId ID do usuário
   * @returns Lista de categorias criadas
   */
  async createDefaultsForUser(usuarioId: string): Promise<Category[]> {
    // Categorias padrão de receita
    const receitasDefault = [
      { nome: 'Salário', tipo: CategoryType.RECEITA, cor: '#4CAF50', icone: 'work' },
      { nome: 'Investimentos', tipo: CategoryType.RECEITA, cor: '#2196F3', icone: 'trending_up' },
      { nome: 'Freelance', tipo: CategoryType.RECEITA, cor: '#9C27B0', icone: 'computer' },
      { nome: 'Outros', tipo: CategoryType.RECEITA, cor: '#607D8B', icone: 'more_horiz' },
    ];

    // Categorias padrão de despesa
    const despesasDefault = [
      { nome: 'Alimentação', tipo: CategoryType.DESPESA, cor: '#FF5722', icone: 'restaurant' },
      { nome: 'Moradia', tipo: CategoryType.DESPESA, cor: '#795548', icone: 'home' },
      { nome: 'Transporte', tipo: CategoryType.DESPESA, cor: '#FF9800', icone: 'directions_car' },
      { nome: 'Saúde', tipo: CategoryType.DESPESA, cor: '#F44336', icone: 'local_hospital' },
      { nome: 'Educação', tipo: CategoryType.DESPESA, cor: '#3F51B5', icone: 'school' },
      { nome: 'Lazer', tipo: CategoryType.DESPESA, cor: '#E91E63', icone: 'sports_esports' },
      { nome: 'Outros', tipo: CategoryType.DESPESA, cor: '#9E9E9E', icone: 'more_horiz' },
    ];

    // Combinar todas as categorias padrão
    const defaultCategories = [...receitasDefault, ...despesasDefault].map(cat => ({
      ...cat,
      usuarioId,
      padrao: true,
    }));

    // Criar todas as categorias padrão
    const categories = this.categoryRepository.create(defaultCategories);
    return this.categoryRepository.save(categories);
  }
}