import { DebitAccount } from '../../../application/use-cases/DebitAccount';
import { GetBalance } from '../../../application/use-cases/GetBalance';
import { InMemoryAccountRepository } from '../../../tests/fakes/InMemoryAccountRepository';
import { InMemoryAuditLogRepository } from '../../fakes/InMemoryAuditLogRepository';
import { InMemoryUnitOfWork } from '../../../tests/fakes/InMemoryUnitOfWork';

import{
    AccountBlockedError,
    AccountNotFoundError,
    InsufficientFundsError,
    InvalidAmountError,
} from '../../../domain/errors/DomainErrors';

describe('Casos de uso da conta', () => {
    let accounts: InMemoryAccountRepository;
    let auditLogs: InMemoryAuditLogRepository;
    let debitAccount: DebitAccount;
    let getBalance: GetBalance;

    beforeEach(() =>{
        accounts = new InMemoryAccountRepository();
        auditLogs = new InMemoryAuditLogRepository();
        accounts.seed('123456-7', 50_000); // R$ 500,00, status 'active'
        debitAccount = new DebitAccount(accounts, auditLogs, new InMemoryUnitOfWork({ accounts, auditLogs }));
        getBalance = new GetBalance(accounts);
    });

    describe('GetBalance',() => {
        it('retorna o saldo da conta e status', async() => {
            await expect(getBalance.execute('123456-7')).resolves.toEqual({
                accountNumber: '123456-7',
                balanceInCents: 50_000,
                status: 'active',
            });
        });

        it('lança AccountNotFoundError se a conta não existir', async() => {
            await expect(getBalance.execute('999999-9')).rejects.toThrow(AccountNotFoundError);
        });

        });

    describe('DebitAccount', () => {
        it('debita valor da conta e registra no log de auditoria', async() => {
            const result = await debitAccount.execute({ accountNumber: '123456-7', amountInCents: 20_000 });
            expect(result.balanceInCents).toBe(30_000);
            await expect(getBalance.execute('123456-7')).resolves.toMatchObject({ balanceInCents: 30_000 });
            expect(auditLogs.entries).toHaveLength(1);
            expect(auditLogs.entries[0]?.operation).toBe('DEBIT');
            expect(auditLogs.entries[0]?.amount.toCents()).toBe(20_000);
        });

        it('rejeita valor zero sem registrar no log de auditoria', async() => {
            await expect(debitAccount.execute({ accountNumber: '123456-7', amountInCents: 0 })).rejects.toThrow(InvalidAmountError,);
            expect(auditLogs.entries).toHaveLength(0);
        });

        it('rejeita saldo insuficiente sem registrar no log de auditoria', async() => {
            await expect(debitAccount.execute({ accountNumber: '123456-7', amountInCents: 70_000 })).rejects.toThrow(InsufficientFundsError,);
            expect(auditLogs.entries).toHaveLength(0);
        });

        it('rejeita débito em conta bloqueada sem registrar no log de auditoria', async() => {
            accounts.seed('987654-3', 75_000, 'blocked');
            await expect(debitAccount.execute({ accountNumber: '987654-3', amountInCents: 500 })).rejects.toThrow(AccountBlockedError,);
            expect(auditLogs.entries).toHaveLength(0);
        });

        it('lança AccountNotFoundError se a conta não existir', async() => {
            await expect(debitAccount.execute({ accountNumber: '999999-9', amountInCents: 500 })).rejects.toThrow(AccountNotFoundError,);
            expect(auditLogs.entries).toHaveLength(0);
        
        });
    });
});
