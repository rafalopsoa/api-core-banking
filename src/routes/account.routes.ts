import { Router } from 'express';
// Importamos a instância do Controller
import accountController from '../controllers/AccountController';
// Importamos o Middleware de Segurança que criámos
import { authMiddleware } from '../middlewares/auth.middleware';

const routes = Router();

routes.get('/api/accounts/:accountNumber/balance', (req, res) => accountController.getBalance(req, res));

// INJEÇÃO DA SEGURANÇA: Colocamos o "authMiddleware" ANTES do controller!
// Assim, se não houver token, o middleware bloqueia a requisição e ela nem chega ao Controller.
routes.post('/api/accounts/:accountNumber/transaction', authMiddleware, (req, res) => accountController.transaction(req, res));

export default routes;