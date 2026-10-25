import { Money } from '../value-objects/Money';
import { AccountBlockedError } from '../errors/DomainErrors';

/** Único status que permite movimentação (mesma regra do controller original). */

export const ACTIVE_STATUS = 'active';

export interface AccountProps {
    accountNumber: string;
    balance: Money;
    status: string;
    version: number;
    // controle otimista de concorrência
}
/**
 * Entidade de domínio. Não conhece Express, TypeORM nem SQLite.
 * Toda regra de movimentação de saldo mora aqui.
 */

export class Account {
    readonly accountNumber: string;
    readonly status: string;
    readonly version: number;
    private _balance: Money;

    constructor(props: AccountProps){
        this.accountNumber = props.accountNumber;
        this.status = props.status;
        this.version = props.version;
        this._balance = props.balance;
    }

    get balance(): Money {
        return this._balance;
    }

    isActive(): boolean {
        return this.status === ACTIVE_STATUS;
    }

    debit(amount: Money): void{
        if(!this.isActive()){
            throw new AccountBlockedError(this.accountNumber);
        }
        // minus() lança erro ANTES da atribuição: o saldo nunca fica inconsistente.
        this._balance = this._balance.minus(amount);
    }
}