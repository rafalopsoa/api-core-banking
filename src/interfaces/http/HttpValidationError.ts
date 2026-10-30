/** Erro de formato da requisição da borda HTTP, não da regra de negócio */

export class HttpValidationError extends Error{
    constructor(message: string){
        super(message);
        this.name = 'HttpValidationError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}