// Classe base: permite distinguir erros de regra de negócio de falhas técnicas.
export abstract class DomainError extends Error {  
constructor (message: string) {
    super(message);
    this.name = new.target.name;
// Garante que "instanceof" funcione mesmo se o target do TS for antigo (ES5).
    Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class InvalidAmountError extends DomainError{
    constructor (value: unknown){
        super(`Valor inválido: ${String(value)}`);
    }
}

export class InsufficientFundsError extends DomainError{
    constructor (){
        super("Saldo insuficiente para realizar a operação.");
    }
}

export class AccountBlockedError extends DomainError{
    constructor (){
        super(`Conta ${accountNumber} está bloqueada.`);
    }
}

export class AccountNotFoundError extends DomainError{
    constructor (accountNumber: string){
        super (`Conta ${accountNumber} não encontrada.`);
    }
}

export class ConcurrencyConflictError extends DomainError{
    constructor (accountNumber: string){
        super (`A conta ${accountNumber} foi modificada por outra operação. Tente novamente.`);
    }   
}