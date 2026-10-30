import type { Request, Response, NextFunction } from 'express';
import {
    AccountBlockedError,
    AccountNotFoundError,
    ConcurrencyConflictError,
    InsufficientFundsError,
    InvalidAmountError,
} from '../../domain/errors/DomainErrors';
import { HttpValidationError } from './HttpValidationError';

/**
 * Único ponto que decide status HTTP + corpo de erro.
 * As três primeiras mensagens são IDÊNTICAS às do controller original.
 */

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void{
    if(err instanceof AccountNotFoundError){
        res.status(404).json({ message: 'Conta não localizada.' });
        return;
    }

    if(err instanceof AccountBlockedError){
        res.status(403).json({ message: 'Conta bloqueada.'});
        return;
    }

    if(err instanceof InsufficientFundsError){
        res.status(400).json({ message: 'Saldo insuficiente.'});
        return;
    }
  // A partir daqui: respostas NOVAS, que o controller original não tinha
    if(err instanceof InvalidAmountError || err instanceof HttpValidationError){
        res.status(400).json({ message: 'Valor inválido.'});
        return;
    }

    if(err instanceof ConcurrencyConflictError){
        res.status(400).json({ message: 'Conta alterada por outra operação. Tente novamente.'});
        return;
    }
// JSON malformado: o express.json() marca o erro com type 'entity.parse.failed'
    if(typeof err === 'object' && err !== null && (err as { type?: unknown}).type === 'entity.parse.failed'){
        res.status(400).json({ message: 'JSON inválido.'});
        return;
    }
  // Falha técnica inesperada: registra no servidor, resposta genérica ao cliente
    console.error(err);
    res.status(500).json({ message: 'Erro interno. '});
}