import { InvalidAmountError, InsufficientFundsError } from '../errors/DomainErrors';
/**
 * Value Object monetário.
 * - Armazena SEMPRE em centavos (inteiro) para eliminar erros de ponto flutuante.
 * - Imutável: toda operação devolve uma nova instância.
 * - Nunca negativo: a regra "não existe saldo negativo" vive aqui.
 */

export class Money {
    private readonly cents: number;

    private constructor (cents:number) {
       this.cents = cents;
    }

    static fromCents(cents: number): Money {
        if(!Number.isSafeInteger(cents) || cents < 0){
            throw new InvalidAmountError(cents);
        }
        return new Money(cents);
    }
    minus(other: Money): Money{
    
        if(other.cents > this.cents){
        throw new InsufficientFundsError();
    }
    return Money.fromCents(this.cents - other.cents);
    }

    isZero(): boolean {
        return this.cents === 0;
    }

    toCents(): number {
        return this.cents;
}
}
