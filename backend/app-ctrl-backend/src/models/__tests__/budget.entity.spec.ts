import { validate } from 'class-validator';
import { Budget } from '../budget.entity';

describe('Budget Entity', () => {
  it('should be valid with all required fields', async () => {
    const budget = new Budget();
    budget.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    budget.categoriaId = '123e4567-e89b-12d3-a456-426614174001';
    budget.valor = 1000;
    budget.mes = 5;
    budget.ano = 2023;

    const errors = await validate(budget);
    expect(errors.length).toBe(0);
  });

  it('should be invalid without usuarioId', async () => {
    const budget = new Budget();
    budget.categoriaId = '123e4567-e89b-12d3-a456-426614174001';
    budget.valor = 1000;
    budget.mes = 5;
    budget.ano = 2023;

    const errors = await validate(budget);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('usuarioId');
  });

  it('should be invalid without categoriaId', async () => {
    const budget = new Budget();
    budget.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    budget.valor = 1000;
    budget.mes = 5;
    budget.ano = 2023;

    const errors = await validate(budget);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('categoriaId');
  });

  it('should be invalid without valor', async () => {
    const budget = new Budget();
    budget.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    budget.categoriaId = '123e4567-e89b-12d3-a456-426614174001';
    budget.mes = 5;
    budget.ano = 2023;

    const errors = await validate(budget);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('valor');
  });

  it('should be invalid with negative valor', async () => {
    const budget = new Budget();
    budget.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    budget.categoriaId = '123e4567-e89b-12d3-a456-426614174001';
    budget.valor = -100;
    budget.mes = 5;
    budget.ano = 2023;

    const errors = await validate(budget);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('valor');
  });

  it('should be invalid without mes', async () => {
    const budget = new Budget();
    budget.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    budget.categoriaId = '123e4567-e89b-12d3-a456-426614174001';
    budget.valor = 1000;
    budget.ano = 2023;

    const errors = await validate(budget);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('mes');
  });

  it('should be invalid with mes less than 1', async () => {
    const budget = new Budget();
    budget.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    budget.categoriaId = '123e4567-e89b-12d3-a456-426614174001';
    budget.valor = 1000;
    budget.mes = 0;
    budget.ano = 2023;

    const errors = await validate(budget);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('mes');
  });

  it('should be invalid with mes greater than 12', async () => {
    const budget = new Budget();
    budget.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    budget.categoriaId = '123e4567-e89b-12d3-a456-426614174001';
    budget.valor = 1000;
    budget.mes = 13;
    budget.ano = 2023;

    const errors = await validate(budget);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('mes');
  });

  it('should be invalid without ano', async () => {
    const budget = new Budget();
    budget.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    budget.categoriaId = '123e4567-e89b-12d3-a456-426614174001';
    budget.valor = 1000;
    budget.mes = 5;

    const errors = await validate(budget);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('ano');
  });

  it('should be invalid with ano less than 2000', async () => {
    const budget = new Budget();
    budget.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    budget.categoriaId = '123e4567-e89b-12d3-a456-426614174001';
    budget.valor = 1000;
    budget.mes = 5;
    budget.ano = 1999;

    const errors = await validate(budget);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('ano');
  });

  it('should be valid with optional notificacoes field', async () => {
    const budget = new Budget();
    budget.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    budget.categoriaId = '123e4567-e89b-12d3-a456-426614174001';
    budget.valor = 1000;
    budget.mes = 5;
    budget.ano = 2023;
    budget.notificacoes = [
      { tipo: 'alerta', limite: 80, ativo: true },
      { tipo: 'critico', limite: 100, ativo: true },
    ];

    const errors = await validate(budget);
    expect(errors.length).toBe(0);
  });

  describe('verificarLimites', () => {
    it('should return null if no notificacoes', () => {
      const budget = new Budget();
      budget.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
      budget.categoriaId = '123e4567-e89b-12d3-a456-426614174001';
      budget.valor = 1000;
      budget.mes = 5;
      budget.ano = 2023;

      const result = budget.verificarLimites(500);
      expect(result).toBeNull();
    });

    it('should return null if no notificacoes are activated', () => {
      const budget = new Budget();
      budget.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
      budget.categoriaId = '123e4567-e89b-12d3-a456-426614174001';
      budget.valor = 1000;
      budget.mes = 5;
      budget.ano = 2023;
      budget.notificacoes = [
        { tipo: 'alerta', limite: 80, ativo: true },
        { tipo: 'critico', limite: 100, ativo: true },
      ];

      const result = budget.verificarLimites(500); // 50% do orçamento
      expect(result).toBeNull();
    });

    it('should return activated notificacoes', () => {
      const budget = new Budget();
      budget.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
      budget.categoriaId = '123e4567-e89b-12d3-a456-426614174001';
      budget.valor = 1000;
      budget.mes = 5;
      budget.ano = 2023;
      budget.notificacoes = [
        { tipo: 'alerta', limite: 80, ativo: true },
        { tipo: 'critico', limite: 100, ativo: true },
      ];

      const result = budget.verificarLimites(800); // 80% do orçamento
      expect(result).toEqual([
        { tipo: 'alerta', limite: 80, ativo: true },
      ]);
    });

    it('should return multiple activated notificacoes in descending order', () => {
      const budget = new Budget();
      budget.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
      budget.categoriaId = '123e4567-e89b-12d3-a456-426614174001';
      budget.valor = 1000;
      budget.mes = 5;
      budget.ano = 2023;
      budget.notificacoes = [
        { tipo: 'alerta', limite: 80, ativo: true },
        { tipo: 'critico', limite: 100, ativo: true },
      ];

      const result = budget.verificarLimites(1000); // 100% do orçamento
      expect(result).toEqual([
        { tipo: 'critico', limite: 100, ativo: true },
        { tipo: 'alerta', limite: 80, ativo: true },
      ]);
    });

    it('should ignore inactive notificacoes', () => {
      const budget = new Budget();
      budget.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
      budget.categoriaId = '123e4567-e89b-12d3-a456-426614174001';
      budget.valor = 1000;
      budget.mes = 5;
      budget.ano = 2023;
      budget.notificacoes = [
        { tipo: 'alerta', limite: 80, ativo: false },
        { tipo: 'critico', limite: 100, ativo: true },
      ];

      const result = budget.verificarLimites(800); // 80% do orçamento
      expect(result).toBeNull();
    });
  });
});