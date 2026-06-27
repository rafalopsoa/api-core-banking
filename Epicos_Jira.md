# Estrutura de Épicos e Rastreabilidade (Jira + Zephyr)

## 1. Mapeamento de Épicos, Histórias e Casos de Teste

### Épico 1: Motor de Transações e Saldos
**Descrição:** Processamento de fluxo financeiro, limites e conciliação.

#### 🧪 Casos de Teste
* **[CB-T01]** Consulta de saldo com fundos suficientes.
* **[CB-T03]** Débito excedendo limite.
* **[CB-T04]** Transferência/Débito com sucesso.

### Épico 2: Ciclo de Vida da Conta
**Descrição:** Gestão de status, bloqueios e validações cadastrais.

#### 🧪 Casos de Teste
* **[CB-T02]** Débito em conta bloqueada.
* **[CB-T05]** Validação com conta inexistente.

### Épico 3: Segurança e Auditoria
**Descrição:** Rastreabilidade, logs imutáveis e autenticação JWT.

#### 🧪 Casos de Teste
* **[CB-T06]** Registo de log de auditoria após transação.
* **[CB-T07]** Acesso negado por falta de autenticação.
