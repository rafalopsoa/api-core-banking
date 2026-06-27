import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';

class AccountController {
    
    async getBalance(req: Request, res: Response) {
        const { accountNumber } = req.params;
        const accountRepo = AppDataSource.getRepository("Account");
        
        const account: any = await accountRepo.findOneBy({ accountNumber });
        
        if (!account) return res.status(404).json({ message: "Conta não localizada." });
        
        return res.status(200).json({ 
            balance: account.balance, 
            status: account.status 
        });
    }

    async transaction(req: Request, res: Response) {
        const { accountNumber } = req.params;
        const { amount } = req.body;
        
        const accountRepo = AppDataSource.getRepository("Account");
        const auditRepo = AppDataSource.getRepository("AuditLog");
        
        const account: any = await accountRepo.findOneBy({ accountNumber });

        if (!account) return res.status(404).json({ message: "Conta não localizada." });
        if (account.status !== 'active') return res.status(403).json({ message: "Conta bloqueada." });
        if (account.balance < amount) return res.status(400).json({ message: "Saldo insuficiente." });

        // Atualiza o saldo
        account.balance = Number(account.balance) - Number(amount);
        await accountRepo.save(account);

        // Garante a persistência do log de auditoria
        await auditRepo.save({
            accountNumber,
            operation: 'DEBIT',
            amount: Number(amount)
        });

        return res.status(200).json({ success: true, newBalance: account.balance });
    }
}

export default new AccountController();