import type { DataSource } from 'typeorm';
import type { TransactionalRepositories, UnitOfWork } from '../../application/ports/UnitOfWork';
import { TypeOrmAccountRepository } from './TypeOrmAccountRepository';
import { TypeOrmAuditLogRepository } from './TypeOrmAuditLogRepository';

export class TypeOrmUnitOfWork implements UnitOfWork {
  private readonly dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  run<T>(work: (repos: TransactionalRepositories) => Promise<T>): Promise<T> {
    return this.dataSource.transaction((manager) =>
      work({
        accounts: new TypeOrmAccountRepository(manager),
        auditLog: new TypeOrmAuditLogRepository(manager),
      }),
    );
  }
}