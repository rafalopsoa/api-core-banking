import type { AccountRepository } from '../ports/AccountRepository';
import { AccountNotFoundError } from '../../domain/errors/DomainErrors';

export interface GetBalanceOutput {
    accountNumber: string;
    balanceInCents: number;
    status: string;
}

export class GetBalance {
    private readonly accounts: AccountRepository;

    constructor(accounts: AccountRepository) {
        this.accounts = accounts;
    }

    async execute(accountNumber: string): Promise<GetBalanceOutput> {
        const account = await this.accounts.findByNumber(accountNumber);
        if (!account){
            throw new AccountNotFoundError(accountNumber);
        }
        return {
            accountNumber: account.accountNumber,
            balanceInCents: account.balance.toCents(),
            status: account.status,
        };
    }
}