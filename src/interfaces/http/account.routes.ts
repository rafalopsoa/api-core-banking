import { Router } from 'express';
import type { AccountController } from './AccountController';
import { authMiddleware } from './middlewares/auth.middleware';

/**
 * Mesmas rotas e mesma ordem de middlewares do arquivo original:
 * o authMiddleware roda ANTES do controller no POST de transação.
 */

export function createAccountRoutes(controller: AccountController): Router{
    const routes = Router();
    routes.get('/api/accounts/:accountNumber/balance', controller.getBalance);
    routes.post('/api/accounts/:accountNumber/transaction', authMiddleware, controller.transaction);
    return routes;
}