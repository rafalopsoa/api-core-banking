import type { EntityManager } from 'typeorm';
import type { AccountRepository } from '../../application/ports/AccountRepository';
import { Account } from '../../domain/entities/Account';
import { Money } from '../../domain/value-objects/Money';
import { ConcurrencyConflictError } from '../../domain/errors/DomainErrors';
import { AccountOrmEntity } from './AccountOrmEntity';
import { version } from 'node:os';

/**
 * ADAPTADOR: implementa a porta AccountRepository usando TypeORM.
 * Recebe um EntityManager para poder participar de uma transação.
 */

export class TypeOrmAccountRepository implements AccountRepository {
    private readonly manager: EntityManager;

    constructor(manager: EntityManager){
        this.manager = manager;
    }

    async findByNumber(accountNumber: string): Promise<Account | null>{
        const row = await this.manager.getRepository(AccountOrmEntity).findOneBy({ accountNumber });
        return row ? this.toDomain(row) : null;
    }

    async save(account: Account): Promise<void> {
    // UPDATE condicional: só grava se a versão no banco ainda for a que foi lida.
    // O status não é gravado: nenhuma regra atual o altera.
    const result = await this.manager
        .createQueryBuilder()
        .update(AccountOrmEntity)
        .set({
            balanceInCents: account.balance.toCents(),
            version: account.version + 1,
        })
        .where('accountNumber = :accountNumber AND version = :version',{
            accountNumber: account.accountNumber,
            version: account.version,
        })
        .execute();

        if (result.affected !== 1){
            throw new ConcurrencyConflictError(account.accountNumber);
        } 
    }

    private toDomain(row: AccountOrmEntity): Account {
        return new Account({
            accountNumber: row.accountNumber,
            balance: Money.fromCents(row.balanceInCents),
            status: row.status,
            version: row.version,
        });
    }
}