import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { DebtsService } from './debts.service';
import { 
  CreateDebtDto, 
  UpdateDebtDto, 
  FilterDebtDto, 
  UpdateInstallmentDto 
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam, 
  ApiQuery 
} from '@nestjs/swagger';

@ApiTags('debts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova dívida com parcelas' })
  @ApiResponse({ status: 201, description: 'Dívida criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createDebtDto: CreateDebtDto, @CurrentUser() user: User) {
    return this.debtsService.create(user.id, createDebtDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar dívidas com filtros' })
  @ApiResponse({ status: 200, description: 'Lista de dívidas' })
  findAll(@Query() filterDto: FilterDebtDto, @CurrentUser() user: User) {
    return this.debtsService.findAll(user.id, filterDto);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Obter resumo de dívidas' })
  @ApiResponse({ status: 200, description: 'Resumo de dívidas' })
  getDebtSummary(@CurrentUser() user: User) {
    return this.debtsService.getDebtSummary(user.id);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Listar dívidas com parcelas próximas do vencimento' })
  @ApiResponse({ status: 200, description: 'Lista de dívidas com parcelas próximas do vencimento' })
  @ApiQuery({ 
    name: 'diasAntecedencia', 
    required: false, 
    type: Number, 
    description: 'Dias de antecedência para notificação' 
  })
  findUpcomingPayments(
    @CurrentUser() user: User,
    @Query('diasAntecedencia') diasAntecedencia: number = 3,
  ) {
    return this.debtsService.findUpcomingPayments(user.id, diasAntecedencia);
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Listar dívidas com parcelas atrasadas' })
  @ApiResponse({ status: 200, description: 'Lista de dívidas com parcelas atrasadas' })
  findOverduePayments(@CurrentUser() user: User) {
    return this.debtsService.findOverduePayments(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter uma dívida específica' })
  @ApiResponse({ status: 200, description: 'Dívida encontrada' })
  @ApiResponse({ status: 404, description: 'Dívida não encontrada' })
  @ApiParam({ name: 'id', description: 'ID da dívida' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.debtsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma dívida' })
  @ApiResponse({ status: 200, description: 'Dívida atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Dívida não encontrada' })
  @ApiParam({ name: 'id', description: 'ID da dívida' })
  update(
    @Param('id') id: string,
    @Body() updateDebtDto: UpdateDebtDto,
    @CurrentUser() user: User,
  ) {
    return this.debtsService.update(id, user.id, updateDebtDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover uma dívida' })
  @ApiResponse({ status: 204, description: 'Dívida removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Dívida não encontrada' })
  @ApiParam({ name: 'id', description: 'ID da dívida' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.debtsService.remove(id, user.id);
  }

  @Get(':id/installments')
  @ApiOperation({ summary: 'Listar parcelas de uma dívida' })
  @ApiResponse({ status: 200, description: 'Lista de parcelas' })
  @ApiResponse({ status: 404, description: 'Dívida não encontrada' })
  @ApiParam({ name: 'id', description: 'ID da dívida' })
  findInstallments(@Param('id') id: string, @CurrentUser() user: User) {
    return this.debtsService.findInstallments(id, user.id);
  }

  @Get(':id/installments/:installmentId')
  @ApiOperation({ summary: 'Obter uma parcela específica' })
  @ApiResponse({ status: 200, description: 'Parcela encontrada' })
  @ApiResponse({ status: 404, description: 'Dívida ou parcela não encontrada' })
  @ApiParam({ name: 'id', description: 'ID da dívida' })
  @ApiParam({ name: 'installmentId', description: 'ID da parcela' })
  findInstallment(
    @Param('id') id: string,
    @Param('installmentId') installmentId: string,
    @CurrentUser() user: User,
  ) {
    return this.debtsService.findInstallment(id, installmentId, user.id);
  }

  @Patch(':id/installments/:installmentId')
  @ApiOperation({ summary: 'Atualizar uma parcela' })
  @ApiResponse({ status: 200, description: 'Parcela atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Dívida ou parcela não encontrada' })
  @ApiParam({ name: 'id', description: 'ID da dívida' })
  @ApiParam({ name: 'installmentId', description: 'ID da parcela' })
  updateInstallment(
    @Param('id') id: string,
    @Param('installmentId') installmentId: string,
    @Body() updateInstallmentDto: UpdateInstallmentDto,
    @CurrentUser() user: User,
  ) {
    return this.debtsService.updateInstallment(
      id,
      installmentId,
      user.id,
      updateInstallmentDto,
    );
  }

  @Post(':id/installments/:installmentId/pay')
  @ApiOperation({ summary: 'Marcar uma parcela como paga' })
  @ApiResponse({ status: 200, description: 'Parcela marcada como paga com sucesso' })
  @ApiResponse({ status: 404, description: 'Dívida ou parcela não encontrada' })
  @ApiParam({ name: 'id', description: 'ID da dívida' })
  @ApiParam({ name: 'installmentId', description: 'ID da parcela' })
  @ApiQuery({ 
    name: 'dataPagamento', 
    required: false, 
    type: Date, 
    description: 'Data de pagamento (opcional)' 
  })
  @ApiQuery({ 
    name: 'observacao', 
    required: false, 
    type: String, 
    description: 'Observação sobre o pagamento (opcional)' 
  })
  payInstallment(
    @Param('id') id: string,
    @Param('installmentId') installmentId: string,
    @CurrentUser() user: User,
    @Query('dataPagamento') dataPagamento?: Date,
    @Query('observacao') observacao?: string,
  ) {
    return this.debtsService.payInstallment(
      id,
      installmentId,
      user.id,
      dataPagamento,
      observacao,
    );
  }
}