import type { UnitOfWork } from '../ports/UnitOfWork';
import { Money } from '../../domain/value-objects/Money';
import { AccountNotFoundError, InvalidAmountError } from '../../domain/errors/DomainErrors';

export interface DebitAccountInput {
    accountNumber: string;
    amountInCents: number;
}

export interface DebitAccountOutput {
    accountNumber: string;
    balanceInCents: number;
}

export class DebitAccount {
    private readonly unitOfWork: UnitOfWork;

    constructor(unitOfWork: UnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    async execute(input: DebitAccountInput): Promise<DebitAccountOutput>{
        const amount = Money.fromCents(input.amountInCents);
        if(amount.isZero()){
            throw new InvalidAmountError(input.amountInCents);
        }

     // Débito + auditoria na MESMA transação: ou os dois acontecem, ou nenhum.
     return this.unitOfWork.run(async ({ accounts, auditLog}) => {
        const account = await accounts.findByNumber(input.accountNumber);
        if(!account){
            throw new AccountNotFoundError(input.accountNumber);
        }

        account.debit(amount);
        await accounts.save(account);
        await auditLog.record({ accountNumber: account.accountNumber, operation: 'DEBIT', amount });

        return { accountNumber: account.accountNumber, balanceInCents: account.balance.toCents() };
     });
    }
}