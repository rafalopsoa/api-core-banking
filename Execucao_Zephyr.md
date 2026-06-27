# Estrutura de Execução e Ciclos de Teste (Zephyr Scale)

## 1. Organização dos Casos de Teste
A organização na biblioteca do Zephyr segue a hierarquia dos Épicos:

* **Pasta: Motor de Transações**
    * [CBANK-T1] Consulta de saldo.
    * [CBANK-T3] Débito com sucesso.
* **Pasta: Ciclo de Vida da Conta**
    * [CBANK-T2] Bloqueio de transação (limite).
    * [CBANK-T4] Conta bloqueada.
    * [CBANK-T5] Conta inexistente.
* **Pasta: Segurança e Auditoria**
    * [CBANK-T6] Auditoria de log.
    * [CBANK-T7] Falha de autenticação.

## 2. Planeamento de Ciclos de Teste (Cycles)
* **Sprint 1 (Base Engine):** Foco nos testes de saldo e débito simples (T1, T3).
* **Sprint 2 (Security & Lifecycle):** Validação de restrições de negócio (T2, T4, T5).
* **Release 1.0 (Regressão Total):** Execução do plano completo de testes E2E (T1 a T7) para garantir a estabilidade do sistema antes da subida para produção.
