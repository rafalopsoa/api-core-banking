import express from 'express';
import { AppDataSource } from './infrastructure/database/data-source';
import { TypeOrmAccountRepository } from './infrastructure/database/TypeOrmAccountRepository';
import { TypeOrmUnitOfWork } from './infrastructure/database/TypeOrmUnitOfWork';
import { GetBalance } from './application/use-cases/GetBalance';
import { DebitAccount } from './application/use-cases/DebitAccount';
import { AccountController } from './interfaces/http/AccountController';
import { createAccountRoutes } from './interfaces/http/account.routes';
import { errorHandler } from './interfaces/http/errorHandler';
import { appendFile } from 'fs';

// COMPOSITION ROOT: único lugar que conhece todas as implementações concretas.
const accountController = new AccountController(
    new GetBalance(new TypeOrmAccountRepository(AppDataSource.manager)),
    new DebitAccount(new TypeOrmUnitOfWork(AppDataSource)),
);

const app = express();
app.use(express.json());
app.use(createAccountRoutes(accountController));// as rotas já contêm o prefixo /api
app.use(errorHandler); //sempre depois das rotas

export default app;