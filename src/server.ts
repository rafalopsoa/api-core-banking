import app from './app';
import { AppDataSource } from './data-source';
import { Account } from './entity/Account';

AppDataSource.initialize()
    .then(async () => {
        console.log("Banco de dados inicializado!");
        
        // --- SEED DE TESTE (Para testar no Postman) ---
        // A segurança aqui é garantir que o repositorio foi obtido com a entidade correta
        const repo = AppDataSource.getRepository(Account);
        
        // Verifica se a conta já existe para não duplicar em reloads do ts-node-dev
        const existing = await repo.findOneBy({ accountNumber: '12345-6' });
        if (!existing) {
            await repo.save({ accountNumber: '12345-6', balance: 500.00, status: 'active' });
            console.log("Conta de teste criada: 12345-6 (Saldo: 500.00)");
        }
        // ----------------------------------------------

        app.listen(3000, () => {
            console.log('Servidor rodando na porta 3000');
        });
    })
    .catch((error) => console.log("Erro ao iniciar banco:", error));