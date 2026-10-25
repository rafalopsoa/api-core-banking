import type { Money } from '../..domain/value-objects/Money';

export interface AuditEntry {
    accountNumber: string;
    operation: 'DEBIT';
    amount: Money;
}

/** PORTA para registrar a trilha de auditoria de cada movimentação. */

export interface AuditLogRepository{
    record(entry: AuditEntry): Promise<void>;
}