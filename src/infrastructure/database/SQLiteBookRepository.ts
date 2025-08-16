import { IBookRepository } from '../../domain/interfaces/IBookRepository';
import { Book } from '../../domain/entities/Book';
import { Database } from '../../config/database';
import { ILogger } from '../../domain/interfaces/ILogger';
import { BookDTO } from '../../domain/dto/BookDTO';

export class SQLiteBookRepository implements IBookRepository {
  private db: Database;
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.db = Database.getInstance();
    this.logger = logger;
  }

  async findAll(): Promise<Book[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM books ORDER BY id DESC`;

      this.db.getConnection().all(sql, [], (err, rows: any[]) => {
        if (err) {
          this.logger.error(`Erro ao listar livros: ${err.message}`);
          reject(err);
          return;
        }

        const books = rows.map(row => BookDTO.fromDatabaseResult(row).toEntity());

        this.logger.info(`${books.length} livros encontrados`);
        resolve(books);
      });
    });
  }

  async findById(id: number): Promise<Book | null> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM books WHERE id = ?`;

      this.db.getConnection().get(sql, [id], (err, row: any) => {
        if (err) {
          this.logger.error(`Erro ao encontrar livro com ID ${id}: ${err.message}`);
          reject(err);
          return;
        }

        if (!row) {
          this.logger.warn(`Livro com ID ${id} não encontrado`);
          resolve(null);
          return;
        }

        const book = BookDTO.fromDatabaseResult(row).toEntity();

        this.logger.info(`Livro com ID ${id} encontrado`);
        resolve(book);
      });
    });
  }

  async create(book: Book): Promise<Book> {
    const logger = this.logger;

    return new Promise((resolve, reject) => {
      const sql = `
            INSERT INTO books (
                title, author, publicationYear, publisher, genre,
                acquisitionDate, pageCount, description, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

      const params = [
        book.title,
        book.author,
        book.publicationYear,
        book.publisher,
        book.genre,
        book.acquisitionDate,
        book.pageCount,
        book.description,
        book.createdAt,
        book.updatedAt
      ];

      this.db.getConnection().run(sql, params, function (err) {
        if (err) {
          logger.error(`Erro ao criar livro: ${err.message}`);
          reject(err);
          return;
        }

        book.id = this.lastID;
        logger.info(`Livro criado com ID ${book.id}`);
        resolve(book);
      });
    });
  }

  async update(id: number, book: Book): Promise<Book> {
    const logger = this.logger;

    return new Promise((resolve, reject) => {
      this.findById(id).then(existingBook => {
        if (!existingBook) {
          logger.warn(`Nenhum livro encontrado com ID ${id} para atualização`);
          reject(new Error(`Livro com ID ${id} não encontrado`));
          return;
        }

        const createdAt = existingBook.createdAt;

        book.updateTimestamp();

        const sql = `
            UPDATE books SET
            title = ?,
            author = ?,
            publicationYear = ?,
            publisher = ?,
            genre = ?,
            acquisitionDate = ?,
            pageCount = ?,
            description = ?,
            updatedAt = ?
            WHERE id = ?
        `;

        const params = [
          book.title,
          book.author,
          book.publicationYear,
          book.publisher,
          book.genre,
          book.acquisitionDate,
          book.pageCount,
          book.description,
          book.updatedAt,
          id
        ];

        this.db.getConnection().run(sql, params, function (err) {
          if (err) {
            logger.error(`Erro ao atualizar livro com ID ${id}: ${err.message}`);
            reject(err);
            return;
          }

          if (this.changes === 0) {
            logger.warn(`Nenhum livro encontrado com ID ${id} para atualização`);
            reject(new Error(`Livro com ID ${id} não encontrado`));
            return;
          }

          logger.info(`Livro com ID ${id} atualizado com sucesso`);

          const updatedBook = new Book({
            id,
            title: book.title,
            author: book.author,
            publicationYear: book.publicationYear,
            publisher: book.publisher,
            genre: book.genre,
            acquisitionDate: book.acquisitionDate,
            pageCount: book.pageCount,
            description: book.description,
            createdAt: createdAt,
            updatedAt: book.updatedAt
          });

          resolve(updatedBook);
        });
      }).catch(err => {
        logger.error(`Erro ao encontrar livro para atualização: ${err.message}`);
        reject(err);
      });
    });
  }

  async delete(id: number): Promise<boolean> {
    const logger = this.logger;

    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM books WHERE id = ?`;

      this.db.getConnection().run(sql, [id], function (err) {
        if (err) {
          logger.error(`Erro ao deletar livro com ID ${id}: ${err.message}`);
          reject(err);
          return;
        }

        if (this.changes === 0) {
          logger.warn(`Nenhum livro encontrado com ID ${id} para exclusão`);
          resolve(false);
          return;
        }

        logger.info(`Livro com ID ${id} deletado com sucesso`);
        resolve(true);
      });
    });
  }
}
