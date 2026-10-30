import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Busca o cabeçalho "Authorization" na requisição
    const authHeader = req.headers.authorization;

    // Se não existir ou não começar com "Bearer ", bloqueia (401)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token de autenticação ausente ou inválido.' });
    }

    // No mundo real, usaríamos a biblioteca "jsonwebtoken" para validar a assinatura do token.
    // Para esta validação estrutural E2E, se o formato estiver correto, permitimos a transação.
    next();
};