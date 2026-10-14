import { Money } from '../../../domain/value-objects/Money';
import { InvalidAmountError, InsufficientFundsError } from '../../../domain/errors/DomainErrors';

describe('Money', () => {
    it ('cria valor a partir de centavos inteiros', () => {
        expect(Money.fromCents(50_000).toCents()).toBe(50_000);
    });

    it('aceita zero', () => {
        expect(Money.fromCents(0).isZero()).toBe(true);
    });

    it.each([-1, 10.5, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1])('rejeita valores inválidos: %p',
        (valor) => {
            expect(() => Money.fromCents(valor)).toThrow(InvalidAmountError);
        },
    );

    it('subtrai valores sem erro de ponto flutuante(500,00 - 499,90 = 0,10)', () => {
    //Em ponto flutuante, 500,00 - 499,90 = 0,09999999999999432
        expect(Money.fromCents(50_000).minus(Money.fromCents(49_990)).toCents()).toBe(10);
});
    
    it('permite subtrair até zerar o valor', () =>{
        expect(Money.fromCents(500).minus(Money.fromCents(500)).isZero()).toBe(true);
    });

    it('lança InsufficentFundsError ao tentar subtrair valor maior que o saldo', () => {
        expect(() => Money.fromCents(500).minus(Money.fromCents(501))).toThrow(InsufficientFundsError);
});

    it('é imutável: minus() devolve nova instância', () => {
        const original = Money.fromCents(500);
        original.minus(Money.fromCents(100));
        expect(original.toCents()).toBe(500);
    });
});