import { validate } from 'class-validator';
import { Category, CategoryType } from '../category.entity';

describe('Category Entity', () => {
  it('should be valid with all required fields', async () => {
    const category = new Category();
    category.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    category.nome = 'Alimentação';
    category.tipo = CategoryType.DESPESA;

    const errors = await validate(category);
    expect(errors.length).toBe(0);
  });

  it('should be invalid without usuarioId', async () => {
    const category = new Category();
    category.nome = 'Alimentação';
    category.tipo = CategoryType.DESPESA;

    const errors = await validate(category);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('usuarioId');
  });

  it('should be invalid without nome', async () => {
    const category = new Category();
    category.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    category.tipo = CategoryType.DESPESA;

    const errors = await validate(category);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('nome');
  });

  it('should be invalid without tipo', async () => {
    const category = new Category();
    category.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    category.nome = 'Alimentação';

    const errors = await validate(category);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('tipo');
  });

  it('should be invalid with invalid tipo', async () => {
    const category = new Category();
    category.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    category.nome = 'Alimentação';
    category.tipo = 'invalid' as CategoryType;

    const errors = await validate(category);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('tipo');
  });

  it('should be valid with optional fields', async () => {
    const category = new Category();
    category.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    category.nome = 'Alimentação';
    category.tipo = CategoryType.DESPESA;
    category.cor = '#FF5733';
    category.icone = 'restaurant';
    category.padrao = true;

    const errors = await validate(category);
    expect(errors.length).toBe(0);
  });

  it('should have default value for padrao field', () => {
    const category = new Category();
    expect(category.padrao).toBe(false);
  });

  it('should have correct enum values for tipo', () => {
    expect(CategoryType.RECEITA).toBe('receita');
    expect(CategoryType.DESPESA).toBe('despesa');
  });
});