import type { EntityManager } from 'typeorm';
import type { AuditEntry, AuditLogRepository } from '../../application/ports/AuditLogRepository';
import { AuditLog } from './AuditLog';
import { EntityCreateCommand } from 'typeorm/commands/EntityCreateCommand.js';

/**
 * ADAPTADOR de auditoria. Grava exatamente os mesmos campos que o
 * controller original gravava: { accountNumber, operation, amount }.
 * O valor continua em REAIS na tabela de auditoria, como antes.
 */

export class TypeOrmAuditLogRepository implements AuditLogRepository {
    private readonly manager: EntityManager;

    constructor(manager: EntityManager){
        this.manager = manager;
    }

    async record(entry: AuditEntry): Promise<void>{
        await this.manager.getRepository(AuditLog).insert({
            accountNumber: entry.accountNumber,
            operation: entry.operation,
            amount: entry.amount.toCents() / 100,
        });
    }
}