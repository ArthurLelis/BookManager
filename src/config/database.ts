import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

import { ILogger } from '../domain/interfaces/ILogger';
import { Logger } from '../infrastructure/logging/Logger';

export class Database {
  private static instance: Database;
  private db: sqlite3.Database;
  private logger: ILogger;

  private constructor() {
    this.logger = new Logger();

    const dbDir = path.join(__dirname, '../../data');

    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const dbPath = path.join(dbDir, 'books.db');

    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        this.logger.error(`Erro ao conectar ao banco de dados: ${err.message}`);
        return;
      }

      this.logger.info('Conectado ao banco de dados SQLite');
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }

  public getConnection(): sqlite3.Database {
    return this.db;
  }

  public initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const sqlPath = path.join(__dirname, '../../sql/init.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');

      this.db.exec(sql, (err) => {
        if (err) {
          this.logger.error(`Erro ao inicializar o banco de dados: ${err.message}`);
          reject(err);
          return;
        }

        this.logger.info('Banco de dados inicializado com sucesso');
        resolve();
      });
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          this.logger.error(`Erro ao fechar o banco de dados: ${err.message}`);
          reject(err);
          return;
        }

        this.logger.info('Conexão com o banco de dados fechada');
        resolve();
      });
    });
  }
}
