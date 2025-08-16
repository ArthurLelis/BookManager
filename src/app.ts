import { Logger } from './infrastructure/logging/Logger';
import { SQLiteBookRepository } from './infrastructure/database/SQLiteBookRepository';
import { BookService } from './application/services/BookService';
import { BookCLI } from './presentation/cli/BookCLI';
import { Database } from './config/database';

async function startApplication() {
  try {
    const logger = new Logger();
    logger.info('Iniciando sistema de gerenciamento de livros');

    const database = Database.getInstance();
    await database.initializeDatabase();

    const bookRepository = new SQLiteBookRepository(logger);

    const bookService = new BookService(bookRepository, logger);

    const bookCLI = new BookCLI(bookService, logger);

    await bookCLI.start();

  } catch (error) {
    console.error('Falha ao iniciar o aplicativo:', error);
    process.exit(1);
  }
}

startApplication();
