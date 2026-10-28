import { AppDataSource } from '../../infrastructure/database/data-source';
import { AccountOrmEntity } from '../../infrastructure/database/AccountOrmEntity';
import { AuditLog } from '../../infrastructure/database/AuditLog';
import { TypeOrmAccountRepository } from '../../infrastructure/database/TypeOrmAccountRepository';
import { TypeOrmUnitOfWork } from '../../infrastructure/database/TypeOrmUnitOfWork';
import { Money } from '../../domain/value-objects/Money';
import { ConcurrencyConflictError } from '../../domain/errors/DomainErrors';
import { before } from 'node:test';

describe('Persistência TypeORM (Integração com SQLite)', () =>{
    const repository = new TypeOrmAccountRepository(AppDataSource.manager);
    const unitOfWork = new TypeOrmUnitOfWork(AppDataSource);

    const saldoNoBanco = async () =>
    (await AppDataSource.getRepository(AccountOrmEntity).findOneByOrFail({ accountNumber: '123456-7'})).balanceInCents;

    beforeAll(async () => {
        await AppDataSource.initialize();
    });

    afterAll(async () =>{
        await AppDataSource.destroy();
    });

    beforeEach(async () => {
        await AppDataSource.getRepository(AuditLog).clear();
        const orm = AppDataSource.getRepository(AccountOrmEntity);
        await orm.clear();
        await orm.save(orm.create({ accountNumber: '123456-7', balanceInCents: 50_000, status: 'active', version: 0}));
    });

    describe('TypeOrmAccountRepository', () => {
        it('Converte a linha do banco em entidade de domínio', async() => {
            const account = await repository.findByNumber('123456-7');
            expect(account?.balance.toCents()).toBe(50_000);
            expect(account?.status).toBe('active');
            expect(account?.version).toBe(0);
        });

        it('Retorna null para conta inexistente', async () => {
            await expect(repository.findByNumber('99999-9')).resolves.toBeNull();
        });

        it('Persiste o novo saldo e incrementa a versão', async () => {
            const account = await repository.findByNumber('123456-7');
            account!.debit(Money.fromCents(10_000));
            await repository.save(account!);

            const reloaded = await repository.findByNumber('123456-7');
            expect(reloaded?.balance.toCents()).toBe(40_000);
            expect(reloaded?.version).toBe(1);
        });

        it('Detecta atualização concorrente (lost update) e lança ConcurrencyConflictError', async () => {
            // Duas "requisições" leem a mesma versão (0) da conta
            const leituraA = await repository.findByNumber('123456-7');
            const leituraB = await repository.findByNumber('123456-7');
            
            leituraA!.debit(Money.fromCents(40_000));
            leituraB!.debit(Money.fromCents(40_000));

            await repository.save(leituraA!);// grava e a versão no banco vira 1
            await expect(repository.save(leituraB!)).rejects.toThrow(ConcurrencyConflictError);

            // Apenas UM débito foi aplicado: R$ 500,00 - R$ 400,00 = R$ 100,00
            expect(await saldoNoBanco()).toBe(10_000);

        });
    });

    describe('TypeOrmUnitOfWork', () => {
        it('Confirma débito e auditoria juntos', async () => {
            await unitOfWork.run(async ({ accounts, auditLog}) => {
                const account = await accounts.findByNumber('123456-7');
                account!.debit(Money.fromCents(10_000));
                await accounts.save(account!);
                await auditLog.record({ accountNumber: '123456-7', operation: 'DEBIT', amount: Money.fromCents(10_000)});
            });

        expect(await saldoNoBanco()).toBe(40_000);
        const logs = await AppDataSource.getRepository(AuditLog).find();
        expect(logs).toHaveLength(1);
        expect(Number(logs[0]?.amount)).toBe(100); //Auditoria continua em reais
        expect(logs[0]?.createdAt).toBeInstanceOf(Date); // @CreateDateColumn preenchido pelo banco
        });

        it('Desfaz o débito se algo falhar depois de gravar o saldo (rollback)', async () => {
            await expect(
                unitOfWork.run(async ({ accounts }) => {
                    const account = await accounts.findByNumber('123456-7');
                    account!.debit(Money.fromCents(10_000));
                    await accounts.save(account!);
                    throw new Error ('falha simulada ao gravar auditoria');
                }),
            ).rejects.toThrow('falha simulada ao gravar auditoria');

            expect(await saldoNoBanco()).toBe(50_000); //saldo intacto
            expect(await AppDataSource.getRepository(AuditLog).count()).toBe(0);
        });
    });

});