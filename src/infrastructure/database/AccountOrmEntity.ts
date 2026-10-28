import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
/**
 * Modelo de PERSISTÊNCIA (tabela). Os decorators do TypeORM ficam só aqui.
 * Não confundir com a entidade de domínio em src/domain/entities/Account.ts.
 */

@Entity({ name: 'account' })
export class AccountOrmEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    accountNumber!: string;

      // Inteiro em centavos: sem perda de precisão em nenhum banco.
    @Column({ type: 'integer' })
    balanceInCents!: number;

    @Column({ type: 'varchar' })
    status!: string;

    @Column({ type: 'integer', default: 0 })
    version!: number;

}