import type { AccountRepository } from './AccountRepository';
import type { AuditLogRepository } from './AuditLogRepository';

export interface TransactionalRepositories {
    accounts: AccountRepository;
    auditLog: AuditLogRepository;
}

/**
 * PORTA de Unidade de Trabalho: tudo que acontece dentro de run()
 * é confirmado junto ou desfeito junto (atomicidade).
 * Garante que nunca exista débito sem registro de auditoria, nem o contrário.
 */

export interface UnitOfWork {
    run<T>(work: (repos: TransactionalRepositories) => Promise<T>): Promise<T>;
}