import type { AuditEntry, AuditLogRepository } from '../../application/ports/AuditLogRepository';

/** Repositório falso para testes unitários: guarda "linhas" em um array. */

export class InMemoryAuditLogRepository implements AuditLogRepository {
    readonly entries: AuditEntry[] = [];

    async record(entry: AuditEntry): Promise<void> {
        this.entries.push(entry);
    }
}