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
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionDto, FilterTransactionDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova transação' })
  @ApiResponse({ status: 201, description: 'Transação criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  create(@Body() createTransactionDto: CreateTransactionDto, @CurrentUser() user: User) {
    return this.transactionsService.create(user.id, createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar transações com filtros' })
  @ApiResponse({ status: 200, description: 'Lista de transações' })
  findAll(@Query() filterDto: FilterTransactionDto, @CurrentUser() user: User) {
    return this.transactionsService.findAll(user.id, filterDto);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Obter resumo financeiro (receitas, despesas, saldo)' })
  @ApiResponse({ status: 200, description: 'Resumo financeiro' })
  getSummary(
    @Query('dataInicio') dataInicio: Date,
    @Query('dataFim') dataFim: Date,
    @CurrentUser() user: User,
  ) {
    return this.transactionsService.getSummary(user.id, dataInicio, dataFim);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter uma transação específica' })
  @ApiResponse({ status: 200, description: 'Transação encontrada' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.transactionsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma transação' })
  @ApiResponse({ status: 200, description: 'Transação atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Transação ou categoria não encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @CurrentUser() user: User,
  ) {
    return this.transactionsService.update(id, user.id, updateTransactionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover uma transação' })
  @ApiResponse({ status: 204, description: 'Transação removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.transactionsService.remove(id, user.id);
  }
}