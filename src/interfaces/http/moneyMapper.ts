import { HttpValidationError } from './HttpValidationError';

// Até 2 casas decimais, sem sinal, sem notação científica (ex.: 100, 100.5, 100.55)
const REAIS_PATTERN = /^(\d+)(?:\.(\d{1,2}))?$/;

/**
 * Converte o valor recebido no JSON (em reais) para centavos inteiros.
 * Usa a representação em texto para não depender de aritmética de ponto flutuante.
 */

export function reaisToCents(value: unknown): number {
    if (typeof value !== 'number' || !Number.isFinite(value)){
        throw new HttpValidationError('amount deve ser um número');
    }
    const match = REAIS_PATTERN.exec(String(value));
    if (!match){
        throw new HttpValidationError('amount deve ser positivo e ter no máximo 2 casas decimais');
    }
    const inteiro = match[1] ?? '0';
    const decimal = (match[2] ?? '').padEnd(2,'0');
    return Number(inteiro) * 100 + Number(decimal);
}

/** Converte centavos para reais apenas na saída (resposta HTTP). */
export function centsToReais(cents: number): number{
    return cents / 100;
}