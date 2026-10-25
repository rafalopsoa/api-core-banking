import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class AuditLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    accountNumber: string;

    @Column()
    operation: string;

    @Column("decimal", { precision: 10, scale: 2 })
    amount: number;

    @CreateDateColumn()
    createdAt: Date;
}