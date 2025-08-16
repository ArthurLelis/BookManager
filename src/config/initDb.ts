import { Database } from './database';

async function initializeDatabase() {
  try {
    const database = Database.getInstance();
    await database.initializeDatabase();
    console.log('Banco de dados inicializado. Você pode iniciar o aplicativo agora.');
    process.exit(0);

  } catch (error) {
    console.error('Falha ao inicializar o banco de dados:', error);
    process.exit(1);
  }
}

initializeDatabase();
