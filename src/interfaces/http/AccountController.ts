import type { Request, Response, NextFunction } from 'express';
import type { GetBalance } from '../../application/use-cases/GetBalance';
import type { DebitAccount } from '../../application/use-cases/DebitAccount';
import { reaisToCents, centsToReais } from './moneyMapper';
import { get } from 'http';
import { NestedSetMultipleRootError } from 'typeorm/error/NestedSetMultipleRootError.js';

/**
 * Controller FINO: só traduz HTTP<-> caso de uso.
 * Nenhuma regra de negócio aqui (sem "if saldo < valor").
 * Formato das respostas idêntico ao controller original.
 */

export class AccountController{
    private readonly getBalanceUseCase: GetBalance;
    private readonly debitAccountUseCase: DebitAccount;

    constructor(getBalance: GetBalance, debitAccount: DebitAccount){
        this.getBalanceUseCase = getBalance;
        this.debitAccountUseCase = debitAccount;
    }
  // Arrow functions preservam o "this" quando o método é passado ao Router.
  getBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const result = await this.getBalanceUseCase.execute(String(req.params.accountNumber));
        res.status(200).json({
            balance: centsToReais(result.balanceInCents),
            status: result.status,
        });
    } catch (error){
        next(error);
    }
  };

  transaction = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const amountInCents = reaisToCents(req.body?.amount);
        const result = await this.debitAccountUseCase.execute({
            accountNumber: String(req.params.accountNumber),
            amountInCents,
        });
        res.status(200).json({
            success: true,
            newBalance: centsToReais(result.balanceInCents),
        });
    }catch (error){
        next(error);
    }
  };

}