import type { Account } from '../../domain/entities/Account';

/**
 * PORTA (interface) definida pela camada de aplicação.
 * Quem implementa é a infraestrutura (TypeORM) ou um fake (testes).
 * O caso de uso depende desta abstração, nunca do TypeORM.
 */

export interface AccountRepository {
    findByNumber(accountNumber: string): Promise<Account | null>;
/**
   * Persiste o novo estado da conta.
   * Deve lançar ConcurrencyConflictError se a conta foi alterada
   * por outra operação depois de ter sido lida (versão diferente).
*/
    save(account: Account): Promise<void>;
}