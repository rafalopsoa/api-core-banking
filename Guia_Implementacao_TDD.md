# Guia de Implementação e Ciclo TDD

## 1. Configuração do Ambiente
Utilizamos `better-sqlite3` para garantir que os testes rodem contra um banco relacional real, porém isolado em memória a cada execução, garantindo deterministicidade.

## 2. Ciclo TDD Aplicado
1. **Red:** Escrevemos o teste E2E usando `supertest` que descreve o comportamento esperado da API (ex: esperar um 403 ao debitar uma conta bloqueada).
2. **Green:** Implementamos a lógica no `Controller` que trata o status da conta e verifica a condição de bloqueio.
3. **Refactor:** Extraímos a validação de conta para um `middleware` ou serviço de domínio, reduzindo a duplicação de código.

## 3. Comandos Principais
* `npm test`: Executa a suíte de testes E2E em modo serial (`--runInBand`).
* `npm run dev`: Inicia o servidor com `ts-node-dev` para observação de mudanças em tempo real.
