import { Account } from '../../../domain/entities/Account';
import { Money } from '../../../domain/value-objects/Money';
import { AccountBlockedError, InsufficientFundsError } from '../../../domain/errors/DomainErrors';

const conta = (status: string) =>
  new Account({ accountNumber: '12345-6', balance: Money.fromCents(50_000), status, version: 0 });

describe('Account', () => {
  it('debita quando há saldo suficiente', () => {
    const c = conta('active');
    c.debit(Money.fromCents(10_000));
    expect(c.balance.toCents()).toBe(40_000);
  });

  it('permite debitar o saldo total', () => {
    const c = conta('active');
    c.debit(Money.fromCents(50_000));
    expect(c.balance.isZero()).toBe(true);
  });

  it('rejeita débito acima do saldo SEM alterar o saldo', () => {
    const c = conta('active');
    expect(() => c.debit(Money.fromCents(50_001))).toThrow(InsufficientFundsError);
    expect(c.balance.toCents()).toBe(50_000);
  });

  // Mesma regra do controller original: qualquer status diferente de 'active' bloqueia
  it.each(['blocked', 'ACTIVE', ''])('rejeita débito com status %p SEM alterar o saldo', (status) => {
    const c = conta(status);
    expect(() => c.debit(Money.fromCents(100))).toThrow(AccountBlockedError);
    expect(c.balance.toCents()).toBe(50_000);
  });

  it('isActive() só é verdadeiro para "active"', () => {
    expect(conta('active').isActive()).toBe(true);
    expect(conta('blocked').isActive()).toBe(false);
  });
});