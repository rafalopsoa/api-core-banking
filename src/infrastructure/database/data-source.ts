import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AccountOrmEntity } from './AccountOrmEntity';
import { AuditLog } from './AuditLog';

export const AppDataSource = new DataSource({
    type: 'better-sqlite3',
    database: 'memory',
    synchronize: true, // aceitável APENAS no banco em memória dos testes
    entities: [AccountOrmEntity, AuditLog]
});