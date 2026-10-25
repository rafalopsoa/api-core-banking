import type { TransactionalRepositories, UnitOfWork } from '../../application/ports/UnitOfWork';

/**
 * Fake simples: só repassa os repositórios em memória.
 * A garantia real de rollback é testada na integração com o banco.
 */

export class InMemoryUnitOfWork implements UnitOfWork{
    private readonly repos: TransactionalRepositories;

    constructor(repos: TransactionalRepositories) {
        this.repos = repos;
    }
    async run<T>(work: (repos: TransactionalRepositories) => Promise<T>): Promise<T>{
        return work(this.repos);
    }
    
}