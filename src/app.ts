import "reflect-metadata";
import express from 'express';
import accountRoutes from './routes/account.routes';

const app = express();
app.use(express.json());

// CORREÇÃO À PROVA DE BALAS: Desembrulhamos a rota caso o compilador a tenha colocado num objeto "default"
const rotasParaUsar = (accountRoutes as any).default || accountRoutes;
app.use(rotasParaUsar);

export default app;