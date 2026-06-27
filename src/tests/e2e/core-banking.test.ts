import "reflect-metadata";
import request from 'supertest';
import { AppDataSource } from '../../data-source';

describe('Core Banking E2E Tests', () => {
    let app: any;
    let accountRepo: any;
    let auditRepo: any;
    
    beforeAll(async () => {
        // 1. Inicializa a base de dados primeiro
        await AppDataSource.initialize();
        
        // 2. Extrai os repositórios diretamente pelo nome da tabela (Forma mais segura!)
        accountRepo = AppDataSource.getRepository("Account");
        auditRepo = AppDataSource.getRepository("AuditLog");
        
        // 3. A API só é carregada AQUI dentro
        const appModule = require('../../app');
        app = appModule.default || appModule;
    });

    beforeEach(async () => {
        // Limpa as tabelas antes de cada teste
        await accountRepo.clear(); 
        await auditRepo.clear();
        
        // Injeta a massa de dados
        await accountRepo.save({ accountNumber: '12345-6', balance: 500.00, status: 'active' });
        await accountRepo.save({ accountNumber: '99999-9', balance: 1000.00, status: 'blocked' });
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    it('[CBANK-T1] Deve retornar o saldo de uma conta ativa', async () => {
        const res = await request(app).get('/api/accounts/12345-6/balance');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('active');
        expect(Number(res.body.balance)).toBe(500.00);
    });

    it('[CBANK-T2] Deve bloquear transação que excede o limite', async () => {
        const res = await request(app)
            .post('/api/accounts/12345-6/transaction')
            .set('Authorization', 'Bearer token-valido-aqui') 
            .send({ amount: 600.00 }); 
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Saldo insuficiente.');
    });

    it('[CBANK-T3] Deve efetivar o débito com sucesso', async () => {
        const res = await request(app)
            .post('/api/accounts/12345-6/transaction')
            .set('Authorization', 'Bearer token-valido-aqui') 
            .send({ amount: 100.00 }); 
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('[CBANK-T4] Deve impedir débito em conta bloqueada', async () => {
        const res = await request(app)
            .post('/api/accounts/99999-9/transaction')
            .set('Authorization', 'Bearer token-valido-aqui') 
            .send({ amount: 200.00 }); 
        expect(res.status).toBe(403);
    });

    it('[CBANK-T5] Deve retornar 404 ao transacionar com conta inexistente', async () => {
        const res = await request(app)
            .post('/api/accounts/00000-0/transaction')
            .set('Authorization', 'Bearer token-valido-aqui') 
            .send({ amount: 100.00 }); 
        expect(res.status).toBe(404);
    });

    it('[CBANK-T6] Registo de log de auditoria após transação', async () => {
        const res = await request(app)
            .post('/api/accounts/12345-6/transaction')
            .set('Authorization', 'Bearer token-valido-aqui') 
            .send({ amount: 50.00 }); 

        expect(res.status).toBe(200);

        // Busca o extrato na tabela de Auditoria
        const logs: any = await auditRepo.find();
        
        expect(logs.length).toBeGreaterThan(0);
        expect(logs[0].accountNumber).toBe('12345-6');
        expect(logs[0].operation).toBe('DEBIT');
        expect(Number(logs[0].amount)).toBe(50.00);
    });

    it('[CBANK-T7] Acesso negado por falta de autenticação (Token Inválido)', async () => {
        const res = await request(app)
            .post('/api/accounts/12345-6/transaction')
            // Note que NÃO enviamos o header "Authorization"
            .send({ amount: 50.00 }); 

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Token de autenticação ausente ou inválido.');
    });
});