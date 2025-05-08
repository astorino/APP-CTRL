import { dataSourceOptions } from './src/database/data-source';
import { DataSource } from 'typeorm';

// Este arquivo é usado pelo CLI do TypeORM para executar migrações
export default new DataSource(dataSourceOptions);