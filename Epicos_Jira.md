Estrutura de Épicos e Rastreabilidade (Jira + Zephyr)

1. Mapeamento de Épicos, Histórias e Casos de Teste (Core Banking)

Para abraçar as regras de negócio desenhadas e deixar espaço para o crescimento do sistema, a hierarquia no Jira e Zephyr deve seguir a estrutura abaixo:

Épico 1: Motor de Transações e Saldos (Transaction Engine)

Descrição: Este módulo é responsável por processar todo o fluxo de dinheiro. Engloba as validações matemáticas, limites de crédito, débitos, transferências e conciliação de saldos.

📖 História de Usuário 1: Consulta e Movimentação de Saldo

Como sistema cliente (front-end ou outro microsserviço),
quero consultar o saldo da conta e efetuar movimentações financeiras,
para que eu possa autorizar ou recusar transações de forma segura, mantendo a integridade financeira do banco.

🧪 Casos de Teste Vinculados (Zephyr)

$$CBANK-T1$$

 Consulta de saldo com fundos suficientes

Pré-condições:

O banco de dados SQLite de testes deve estar em execução.

A tabela Account deve conter um registro com accountNumber igual a "12345-6".

O status dessa conta deve ser "active".

O balance (saldo) inicial deve ser de R$ 500,00.

Cenário em Gherkin (BDD):

Funcionalidade: Gestão de Saldos - Consulta

  Cenário: Consulta de saldo de uma conta ativa e válida
    Dado que a conta "12345-6" está cadastrada no sistema
    E o status da conta é "active"
    E o saldo atu# language: ptal no banco de dados é de R$ 500,00
    Quando o sistema cliente enviar uma requisição GET para "/api/accounts/12345-6/balance"
    Então a API deve retornar o status code 200
    E o corpo da resposta deve conter o status "active"
    E o corpo da resposta deve apresentar o saldo de R$ 500,00



$CBANK-T3$$

 Débito excedendo limite

Pré-condições:

A conta "12345-6" deve estar ativa com saldo de R$ 500,00.

Cenário em Gherkin (BDD):

Funcionalidade: Gestão de Saldos - Regras de Limite

  Cenário: Tentativa de débito com valor superior ao saldo disponível
    Dado que a conta "12345-6" possui o status "active"
    E o saldo atual no banco de dados é de R$ 500,00
    Quando o sistema cliente enviar uma requisição POST para "/api/accounts/12345-6/transaction" com o valor de R$ 600,00
    Então a API deve retornar o status code 400
    E a mensagem de retorno deve ser "Saldo insuficiente."
    E o saldo da conta "12345-6" no banco de dados deve permanecer inalterado em R$ 500,00



$$CBANK-T4$$

 Transferência / Débito com sucesso

Pré-condições:

A conta "12345-6" deve estar ativa com saldo de R$ 1000,00.

Cenário em Gherkin (BDD):

Funcionalidade: Gestão de Saldos - Transações Financeiras

  Cenário: Efetivação de débito em conta com fundos suficientes
    Dado que a conta "12345-6" possui o status "active"
    E o saldo atual no banco de dados é de R$ 1000,00
    Quando o sistema cliente enviar uma requisição POST para "/api/accounts/12345-6/transaction" com o valor de R$ 300,00
    Então a API deve retornar o status code 200
    E o corpo da resposta deve confirmar o sucesso da transação
    E o novo saldo retornado na resposta da API deve ser de R$ 700,00
    E o saldo da conta "12345-6" verificado diretamente no banco de dados deve ser atualizado para R$ 700,00


Épico 2: Gestão do Ciclo de Vida da Conta (Account Lifecycle)

Descrição: Este módulo gere a entidade "Conta". Trata da abertura, validação de dados cadastrais, bloqueios administrativos (ex: fraude ou ordem judicial) e encerramento de contas.

📖 História de Usuário 2: Validação de Dados Cadastrais e Status da Conta

Como motor de processamento do banco,
quero validar constantemente os dados cadastrais e o status da conta a cada requisição,
para que eu impeça qualquer movimentação financeira em contas bloqueadas, inativas ou inexistentes.

🧪 Casos de Teste Vinculados (Zephyr)

$$CBANK-T2$$

 Débito em conta bloqueada

Pré-condições:

A conta "99999-9" deve existir no TypeORM.

O status da conta deve ser obrigatoriamente "blocked".

O balance inicial deve ser de R$ 1000,00.

Cenário em Gherkin (BDD):

Funcionalidade: Status e Cadastro - Restrições Administrativas

  Cenário: Tentativa de débito em uma conta com status bloqueado
    Dado que a conta "99999-9" está cadastrada no sistema
    E o status da conta é "blocked"
    E o saldo atual no banco de dados é de R$ 1000,00
    Quando o sistema cliente enviar uma requisição POST para "/api/accounts/99999-9/transaction" com o valor de R$ 200,00
    Então a API deve retornar o status code 403
    E a mensagem de retorno deve ser "Conta bloqueada."
    E o saldo da conta "99999-9" no banco de dados deve permanecer R$ 1000,00



$$CBANK-T5$$

 Validação com conta inexistente (Cenário de Segurança)

Pré-condições:

O banco de dados não deve possuir a conta "00000-0" registrada.

Cenário em Gherkin (BDD):

Funcionalidade: Status e Cadastro - Integridade de Dados

  Cenário: Consulta ou transação enviada para um identificador de conta não cadastrado
    Dado que a conta "00000-0" não existe no banco de dados
    Quando o sistema cliente enviar uma requisição para a rota da conta "00000-0"
    Então a API deve retornar o status code 404
    E a mensagem de retorno deve ser "Conta não localizada."



Épico 3: Segurança e Auditoria (Security & Audit)

Descrição: Módulo transversal responsável pelo registo de logs de transações (extrato imutável) e autenticação de sistemas clientes para mitigar riscos e prevenir fraudes.

📖 História de Usuário 3: Autenticação e Registo de Auditoria

Como auditor do sistema,
quero que todos os acessos via API exijam um token válido e que todas as transações gerem logs imutáveis,
para que o banco possa garantir a rastreabilidade total das operações e o cumprimento de normas regulatórias.

🧪 Casos de Teste Vinculados (Zephyr)

$$CBANK-T6$$

 Registo de log de auditoria após transação

Pré-condições:

A base de dados SQLite de testes deve estar em execução.

A tabela Account deve conter a conta "12345-6" ativa com saldo de R$ 1000,00.

A tabela AuditLog deve estar inicialmente vazia.

Cenário em Gherkin (BDD):

Funcionalidade: Segurança e Auditoria - Logs Imutáveis

  Cenário: Geração de log de auditoria automático para transação financeira
    Dado que a conta "12345-6" possui o status "active"
    E o sistema cliente está autenticado com um token de acesso válido
    Quando o sistema cliente enviar uma requisição POST para "/api/accounts/12345-6/transaction" com o valor de R$ 200,00
    Então a API deve retornar o status code 200
    E um registo imutável do tipo "DEBIT" no valor de R$ 200,00 deve ser criado na tabela de auditoria
    E o registo deve estar inequivocamente associado à conta "12345-6"



$$CBANK-T7$$

 Acesso negado por falta de autenticação (Token Inválido)

Pré-condições:

A rota /api/accounts/*/transaction deve estar protegida por um middleware de autenticação (ex: JWT/Bearer Token).

A conta "12345-6" deve existir na base de dados com saldo de R$ 1000,00.

Cenário em Gherkin (BDD):

Funcionalidade: Segurança e Auditoria - Controlo de Acesso

  Cenário: Tentativa de transação financeira com token de autenticação inválido ou ausente
    Dado que a conta "12345-6" está registada no sistema
    E o sistema cliente não fornece um token "Bearer" válido no cabeçalho da requisição
    Quando o sistema cliente enviar uma requisição POST para "/api/accounts/12345-6/transaction"
    Então a API deve retornar o status code 401 (Unauthorized)
    E a mensagem de retorno deve ser "Token de autenticação ausente ou inválido."
    E nenhuma mutação de saldo ou registo de auditoria deve ocorrer na base de dados



2. Como criar e vincular as User Stories aos Épicos no Jira

No ecossistema da Atlassian, os Testes moram no Zephyr, mas a ligação entre Story e Épico é feita de forma nativa no próprio Jira.

Passo 2.1: Criar os Épicos

No menu lateral do seu projeto no Jira, vá a Backlog ou Timeline (Cronograma).
Clique no botão de criar um novo item (ícone de + ou "Create").
No campo Issue Type (Tipo de Item), selecione Epic (Épico).
Preencha o nome (ex: Motor de Transações e Saldos) e grave.

Passo 2.2: Vincular a User Story ao Épico

Existem duas formas fáceis de fazer isto:

a. Pelo Backlog (Arrastar e Largar):

Vá ao Backlog.
No painel esquerdo, ative a visualização de Épicos (clique em "Epics" ou "Épicos" para expandir a lista).
Arraste a sua User Story e largue-a em cima do Épico correspondente.

b. Pelo Cartão da User Story:

Abra o cartão da User Story.
Procure o campo chamado Epic Link (Ligação ao Épico) ou Add to Epic (Adicionar ao Épico).
Clique e selecione o Épico correspondente na lista suspensa.

3. O Poder da Rastreabilidade com o Zephyr

Ao montar a estrutura exatamente como descrito acima, você completa a matriz de rastreabilidade. Para o time de QA, o benefício prático é:
No Zephyr (seja na versão Scale ou Squad), você pode gerar relatórios baseados em Épicos.
Se a gestão pergunta: "Qual é a cobertura de testes do nosso Motor de Transações?"
Você gera um relatório filtrando pelo Épico 1. O sistema identificará automaticamente a História de Usuário 1 e cruzará com os resultados dos testes CBANK-T1, CBANK-T3 e CBANK-T4, apresentando métricas precisas sobre a saúde do módulo antes do deploy.
