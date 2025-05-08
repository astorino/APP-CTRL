import { validate } from 'class-validator';
import { Transaction, TransactionType } from '../transaction.entity';

describe('Transaction Entity', () => {
  it('should be valid with all required fields', async () => {
    const transaction = new Transaction();
    transaction.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    transaction.tipo = TransactionType.RECEITA;
    transaction.valor = 100;
    transaction.data = new Date();
    transaction.categoriaId = '123e4567-e89b-12d3-a456-426614174001';

    const errors = await validate(transaction);
    expect(errors.length).toBe(0);
  });

  it('should be invalid without usuarioId', async () => {
    const transaction = new Transaction();
    transaction.tipo = TransactionType.RECEITA;
    transaction.valor = 100;
    transaction.data = new Date();
    transaction.categoriaId = '123e4567-e89b-12d3-a456-426614174001';

    const errors = await validate(transaction);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('usuarioId');
  });

  it('should be invalid without tipo', async () => {
    const transaction = new Transaction();
    transaction.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    transaction.valor = 100;
    transaction.data = new Date();
    transaction.categoriaId = '123e4567-e89b-12d3-a456-426614174001';

    const errors = await validate(transaction);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('tipo');
  });

  it('should be invalid with invalid tipo', async () => {
    const transaction = new Transaction();
    transaction.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    transaction.tipo = 'invalid' as TransactionType;
    transaction.valor = 100;
    transaction.data = new Date();
    transaction.categoriaId = '123e4567-e89b-12d3-a456-426614174001';

    const errors = await validate(transaction);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('tipo');
  });

  it('should be invalid without valor', async () => {
    const transaction = new Transaction();
    transaction.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    transaction.tipo = TransactionType.RECEITA;
    transaction.data = new Date();
    transaction.categoriaId = '123e4567-e89b-12d3-a456-426614174001';

    const errors = await validate(transaction);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('valor');
  });

  it('should be invalid without data', async () => {
    const transaction = new Transaction();
    transaction.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    transaction.tipo = TransactionType.RECEITA;
    transaction.valor = 100;
    transaction.categoriaId = '123e4567-e89b-12d3-a456-426614174001';

    const errors = await validate(transaction);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('data');
  });

  it('should be invalid without categoriaId', async () => {
    const transaction = new Transaction();
    transaction.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    transaction.tipo = TransactionType.RECEITA;
    transaction.valor = 100;
    transaction.data = new Date();

    const errors = await validate(transaction);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('categoriaId');
  });

  it('should be valid with optional fields', async () => {
    const transaction = new Transaction();
    transaction.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    transaction.tipo = TransactionType.DESPESA;
    transaction.valor = 100;
    transaction.data = new Date();
    transaction.categoriaId = '123e4567-e89b-12d3-a456-426614174001';
    transaction.descricao = 'Compra de supermercado';
    transaction.metodoPagamento = 'Cartão de crédito';
    transaction.tags = ['supermercado', 'alimentação'];
    transaction.recorrente = true;
    transaction.anexos = [
      { nome: 'nota_fiscal.pdf', url: 'https://example.com/nota_fiscal.pdf', tipo: 'application/pdf' },
    ];

    const errors = await validate(transaction);
    expect(errors.length).toBe(0);
  });
});