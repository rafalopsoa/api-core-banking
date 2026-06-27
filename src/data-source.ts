import "reflect-metadata";
import { DataSource } from "typeorm";
import { Account } from "./entity/Account";
import { AuditLog } from "./entity/AuditLog";

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: ":memory:",
    synchronize: true,
    entities: [Account, AuditLog], // Certifique-se de listar todas as entidades aqui!
});
