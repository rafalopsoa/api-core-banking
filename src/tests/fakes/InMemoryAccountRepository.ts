import type { AccountRepository } from '../../application/ports/AccountRepository';
import { Account } from '../../domain/entities/Account';
import { Money } from '../../domain/value-objects/Money';
import { ConcurrencyConflictError } from '../../domain/errors/DomainErrors';

interface Row {
    balanceInCents: number;
    status: string;
    version: number;
}

/** Repositório falso para testes unitários: guarda "linhas" em um Map. */

export class InMemoryAccountRepository implements AccountRepository {
    private readonly rows = new Map<string, Row>();

    seed(accountNumber: string, balanceInCents: number, status = 'active'): void{
        this.rows.set(accountNumber, { balanceInCents, status, version: 0});

    }

    async findByNumber(accountNumber: string): Promise<Account | null> {
        const row = this.rows.get(accountNumber);
        if(!row) return null;
        return new Account({
            accountNumber,
            balance: Money.fromCents(row.balanceInCents),
            status: row.status,
            version: row.version,
        });
    }

    async save(account: Account): Promise<void> {
        const row = this.rows.get(account.accountNumber);
        if(!row || row.version !== account.version){
            throw new ConcurrencyConflictError(account.accountNumber);

        }
        this.rows.set(account.accountNumber,{
            ...row,
            balanceInCents: account.balance.toCents(),
            version: row.version + 1,
        
        })
    }
    
}