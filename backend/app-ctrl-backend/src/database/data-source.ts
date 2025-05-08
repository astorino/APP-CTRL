import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { User } from '../users/entities/user.entity';
import { Transaction, Category, Budget, Report } from '../models';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Cria uma instância do ConfigService para acessar as variáveis de ambiente
const configService = new ConfigService();

// Configuração do DataSource para TypeORM
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'appctrl'),
  password: configService.get('DB_PASSWORD', 'appctrl'),
  database: configService.get('DB_DATABASE', 'appctrl'),
  entities: [
    User,
    Transaction,
    Category,
    Budget,
    Report,
  ],
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  synchronize: configService.get('NODE_ENV') !== 'production',
  logging: configService.get('NODE_ENV') === 'development',
};

// Cria e exporta a instância do DataSource
const dataSource = new DataSource(dataSourceOptions);

// Função para testar a conexão com o banco de dados
export const testConnection = async (): Promise<boolean> => {
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

export default dataSource;