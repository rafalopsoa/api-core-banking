# 🏦 Core Banking API - TDD & Compliance

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

[**Português**](#-português) | [**English**](#-english)

---

## 🇵🇹 Português

Este projeto é uma API de Core Banking desenvolvida com foco em **TDD (Test-Driven Development)**, **Segurança** e **Rastreabilidade (Compliance)**. O sistema simula o motor financeiro de um banco, garantindo a integridade de saldos, bloqueios administrativos e auditoria imutável de transações.

### 🎯 Objetivos do Projeto e Épicos
O desenvolvimento foi guiado por BDD/TDD, dividido em 3 Sprints principais:
1. **Motor de Transações:** Validação de saldos e prevenção de débitos acima do limite.
2. **Ciclo de Vida da Conta:** Mecanismos de bloqueio administrativo e proteção contra transações em contas inativas/inexistentes.
3. **Segurança e Auditoria:** Middleware de autenticação (JWT/Bearer) e geração de logs imutáveis (`AuditLog`).

### 🚀 Tecnologias
* **Backend:** Node.js, Express.js, TypeScript
* **Persistência:** TypeORM com SQLite (In-Memory)
* **Qualidade:** Jest, Supertest
* **QA/Gestão:** Jira, Zephyr Scale

---

## 🇺🇸 English

This project is a Core Banking API developed with a focus on **TDD (Test-Driven Development)**, **Security**, and **Compliance**. It simulates a bank's financial engine, ensuring balance integrity, administrative locks, and immutable transaction auditing.

### 🎯 Project Goals and Epics
The development followed BDD/TDD practices, organized into 3 main Sprints:
1. **Transaction Engine:** Balance validation and overdraft prevention.
2. **Account Lifecycle:** Administrative locks and protection against transactions on inactive/non-existent accounts.
3. **Security & Audit:** Authentication middleware (JWT/Bearer) and immutable logging (`AuditLog`).

### 🚀 Technologies
* **Backend:** Node.js, Express.js, TypeScript
* **Persistence:** TypeORM with SQLite (In-Memory)
* **Quality:** Jest, Supertest
* **QA/Management:** Jira, Zephyr Scale

---

## ⚙️ How to Run / Como Executar

```bash
git clone [https://github.com/SEU_USUARIO/api-core-banking.git](https://github.com/SEU_USUARIO/api-core-banking.git)
cd api-core-banking
npm install
npm run dev

## 🧪 Tests / Testes (E2E)

```bash
npm test

## 🧪 Test Coverage / Cobertura de Testes (7 Validated Scenarios)

* `[CBANK-T1]` Consultar saldo / Check balance ✅
* `[CBANK-T2]` Bloquear limite excedido / Block overdraft ✅
* `[CBANK-T3]` Débito efetivado / Successful debit ✅
* `[CBANK-T4]` Bloquear conta inativa / Block inactive account ✅
* `[CBANK-T5]` Conta inexistente (404) / Non-existent account (404) ✅
* `[CBANK-T6]` Auditoria de transação / Transaction auditing ✅
* `[CBANK-T7]` Falha de autenticação (401) / Auth failure (401) ✅

## 📂 Documentation / Documentação
* `Epicos_Jira.md`: BDD structure and User Stories.
* `Execucao_Zephyr.md`: Test Cycle planning.
* `Guia_Implementacao_TDD.md`: TDD implementation guide.

