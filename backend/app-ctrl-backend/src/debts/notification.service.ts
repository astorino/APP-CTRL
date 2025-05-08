import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DebtRepository } from '../repositories/debt.repository';
import { InstallmentRepository } from '../repositories/installment.repository';
import { Debt } from '../models/debt.entity';
import { Installment } from '../models/installment.entity';

@Injectable()
export class DebtNotificationService {
  private readonly logger = new Logger(DebtNotificationService.name);

  constructor(
    private readonly debtRepository: DebtRepository,
    private readonly installmentRepository: InstallmentRepository,
  ) {}

  /**
   * Verifica diariamente parcelas próximas do vencimento (3 dias de antecedência)
   * e envia notificações
   */
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async checkUpcomingInstallments() {
    this.logger.log('Verificando parcelas próximas do vencimento...');
    
    try {
      // Buscar parcelas que vencem nos próximos 3 dias
      const installments = await this.installmentRepository.findUpcoming(3);
      
      if (installments.length === 0) {
        this.logger.log('Nenhuma parcela próxima do vencimento encontrada.');
        return;
      }
      
      this.logger.log(`Encontradas ${installments.length} parcelas próximas do vencimento.`);
      
      // Agrupar parcelas por dívida e usuário para enviar notificações agrupadas
      const debtMap = new Map<string, { debt: Debt; installments: Installment[] }>();
      
      for (const installment of installments) {
        const debt = await this.debtRepository.findById(installment.debtId);
        
        if (!debt) continue;
        
        const key = `${debt.usuarioId}-${debt.id}`;
        
        if (!debtMap.has(key)) {
          debtMap.set(key, { debt, installments: [] });
        }
        
        debtMap.get(key)?.installments.push(installment);
      }
      
      // Enviar notificações para cada usuário/dívida
      for (const [key, { debt, installments }] of debtMap.entries()) {
        await this.sendUpcomingInstallmentNotification(debt, installments);
      }
      
      this.logger.log('Notificações de parcelas próximas do vencimento enviadas com sucesso.');
    } catch (error) {
      this.logger.error('Erro ao verificar parcelas próximas do vencimento:', error);
    }
  }

  /**
   * Verifica diariamente parcelas atrasadas e envia notificações
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkOverdueInstallments() {
    this.logger.log('Verificando parcelas atrasadas...');
    
    try {
      // Buscar parcelas atrasadas
      const installments = await this.installmentRepository.findOverdue();
      
      if (installments.length === 0) {
        this.logger.log('Nenhuma parcela atrasada encontrada.');
        return;
      }
      
      this.logger.log(`Encontradas ${installments.length} parcelas atrasadas.`);
      
      // Agrupar parcelas por dívida e usuário para enviar notificações agrupadas
      const debtMap = new Map<string, { debt: Debt; installments: Installment[] }>();
      
      for (const installment of installments) {
        const debt = await this.debtRepository.findById(installment.debtId);
        
        if (!debt) continue;
        
        const key = `${debt.usuarioId}-${debt.id}`;
        
        if (!debtMap.has(key)) {
          debtMap.set(key, { debt, installments: [] });
        }
        
        debtMap.get(key)?.installments.push(installment);
      }
      
      // Enviar notificações para cada usuário/dívida
      for (const [key, { debt, installments }] of debtMap.entries()) {
        await this.sendOverdueInstallmentNotification(debt, installments);
      }
      
      this.logger.log('Notificações de parcelas atrasadas enviadas com sucesso.');
    } catch (error) {
      this.logger.error('Erro ao verificar parcelas atrasadas:', error);
    }
  }

  /**
   * Envia notificação de parcelas próximas do vencimento
   * @param debt Dívida
   * @param installments Parcelas próximas do vencimento
   */
  private async sendUpcomingInstallmentNotification(debt: Debt, installments: Installment[]): Promise<void> {
    // Aqui seria implementada a lógica de envio de notificações
    // Poderia ser por e-mail, push notification, SMS, etc.
    
    this.logger.log(
      `[SIMULAÇÃO] Enviando notificação para usuário ${debt.usuarioId}: ` +
      `${installments.length} parcela(s) da dívida "${debt.nome}" próxima(s) do vencimento.`,
    );
    
    // Exemplo de mensagem que seria enviada
    const message = `
      Olá,
      
      Você tem ${installments.length} parcela(s) da dívida "${debt.nome}" próxima(s) do vencimento:
      
      ${installments
        .map(
          (i) =>
            `- Parcela ${i.numero}: R$ ${i.valor} (vencimento: ${i.dataVencimento.toLocaleDateString()})`,
        )
        .join('\n')}
      
      Acesse o aplicativo para mais detalhes.
      
      Atenciosamente,
      Equipe App-Ctrl
    `;
    
    this.logger.debug(`Mensagem de notificação: ${message}`);
    
    // Aqui seria chamado o serviço de notificação real
    // await this.notificationService.send(debt.usuarioId, 'Parcelas próximas do vencimento', message);
  }

  /**
   * Envia notificação de parcelas atrasadas
   * @param debt Dívida
   * @param installments Parcelas atrasadas
   */
  private async sendOverdueInstallmentNotification(debt: Debt, installments: Installment[]): Promise<void> {
    // Aqui seria implementada a lógica de envio de notificações
    // Poderia ser por e-mail, push notification, SMS, etc.
    
    this.logger.log(
      `[SIMULAÇÃO] Enviando notificação para usuário ${debt.usuarioId}: ` +
      `${installments.length} parcela(s) da dívida "${debt.nome}" atrasada(s).`,
    );
    
    // Exemplo de mensagem que seria enviada
    const message = `
      Olá,
      
      Você tem ${installments.length} parcela(s) da dívida "${debt.nome}" atrasada(s):
      
      ${installments
        .map(
          (i) =>
            `- Parcela ${i.numero}: R$ ${i.valor} (vencimento: ${i.dataVencimento.toLocaleDateString()})`,
        )
        .join('\n')}
      
      Acesse o aplicativo para regularizar sua situação.
      
      Atenciosamente,
      Equipe App-Ctrl
    `;
    
    this.logger.debug(`Mensagem de notificação: ${message}`);
    
    // Aqui seria chamado o serviço de notificação real
    // await this.notificationService.send(debt.usuarioId, 'Parcelas atrasadas', message);
  }
}