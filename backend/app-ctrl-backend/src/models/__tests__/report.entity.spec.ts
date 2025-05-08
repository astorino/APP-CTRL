import { validate } from 'class-validator';
import { Report, ReportType } from '../report.entity';

describe('Report Entity', () => {
  it('should be valid with all required fields', async () => {
    const report = new Report();
    report.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    report.tipo = ReportType.MENSAL;
    report.dataInicio = new Date('2023-05-01');
    report.dataFim = new Date('2023-05-31');

    const errors = await validate(report);
    expect(errors.length).toBe(0);
  });

  it('should be invalid without usuarioId', async () => {
    const report = new Report();
    report.tipo = ReportType.MENSAL;
    report.dataInicio = new Date('2023-05-01');
    report.dataFim = new Date('2023-05-31');

    const errors = await validate(report);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('usuarioId');
  });

  it('should be invalid without tipo', async () => {
    const report = new Report();
    report.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    report.dataInicio = new Date('2023-05-01');
    report.dataFim = new Date('2023-05-31');

    const errors = await validate(report);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('tipo');
  });

  it('should be invalid with invalid tipo', async () => {
    const report = new Report();
    report.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    report.tipo = 'invalid' as ReportType;
    report.dataInicio = new Date('2023-05-01');
    report.dataFim = new Date('2023-05-31');

    const errors = await validate(report);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('tipo');
  });

  it('should be invalid without dataInicio', async () => {
    const report = new Report();
    report.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    report.tipo = ReportType.MENSAL;
    report.dataFim = new Date('2023-05-31');

    const errors = await validate(report);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('dataInicio');
  });

  it('should be invalid without dataFim', async () => {
    const report = new Report();
    report.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    report.tipo = ReportType.MENSAL;
    report.dataInicio = new Date('2023-05-01');

    const errors = await validate(report);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('dataFim');
  });

  it('should be valid with optional fields', async () => {
    const report = new Report();
    report.usuarioId = '123e4567-e89b-12d3-a456-426614174000';
    report.tipo = ReportType.MENSAL;
    report.dataInicio = new Date('2023-05-01');
    report.dataFim = new Date('2023-05-31');
    report.filtros = { mes: 5, ano: 2023 };
    report.dados = {
      resumo: {
        receitas: 1000,
        despesas: 800,
        saldo: 200,
      },
    };

    const errors = await validate(report);
    expect(errors.length).toBe(0);
  });

  it('should have correct enum values for tipo', () => {
    expect(ReportType.MENSAL).toBe('mensal');
    expect(ReportType.CATEGORIA).toBe('categoria');
    expect(ReportType.TENDENCIA).toBe('tendencia');
    expect(ReportType.PERSONALIZADO).toBe('personalizado');
  });

  describe('serialize', () => {
    it('should serialize report data correctly', () => {
      const report = new Report();
      report.id = '123e4567-e89b-12d3-a456-426614174000';
      report.usuarioId = '123e4567-e89b-12d3-a456-426614174001';
      report.tipo = ReportType.MENSAL;
      report.dataInicio = new Date('2023-05-01');
      report.dataFim = new Date('2023-05-31');
      report.filtros = { mes: 5, ano: 2023 };
      report.dados = {
        resumo: {
          receitas: 1000,
          despesas: 800,
          saldo: 200,
        },
      };
      report.dataCriacao = new Date('2023-05-15');

      const serialized = report.serialize();

      expect(serialized).toEqual({
        id: report.id,
        tipo: report.tipo,
        dataInicio: report.dataInicio,
        dataFim: report.dataFim,
        filtros: report.filtros,
        dados: report.dados,
        dataCriacao: report.dataCriacao,
      });
    });

    it('should handle missing optional fields when serializing', () => {
      const report = new Report();
      report.id = '123e4567-e89b-12d3-a456-426614174000';
      report.usuarioId = '123e4567-e89b-12d3-a456-426614174001';
      report.tipo = ReportType.MENSAL;
      report.dataInicio = new Date('2023-05-01');
      report.dataFim = new Date('2023-05-31');
      report.dataCriacao = new Date('2023-05-15');

      const serialized = report.serialize();

      expect(serialized).toEqual({
        id: report.id,
        tipo: report.tipo,
        dataInicio: report.dataInicio,
        dataFim: report.dataFim,
        filtros: {},
        dados: {},
        dataCriacao: report.dataCriacao,
      });
    });
  });
});