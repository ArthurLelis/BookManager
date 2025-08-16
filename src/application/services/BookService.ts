import { Book } from '../../domain/entities/Book';
import { IBookRepository } from '../../domain/interfaces/IBookRepository';
import { ILogger } from '../../domain/interfaces/ILogger';
import { BookValidator } from '../validators/BookValidator';
import { CreateBookDTO } from '../../domain/dto/CreateBookDTO';
import { UpdateBookDTO } from '../../domain/dto/UpdateBookDTO';

export class BookService {
  private repository: IBookRepository;
  private validator: BookValidator;
  private logger: ILogger;

  constructor(repository: IBookRepository, logger: ILogger) {
    this.repository = repository;
    this.validator = new BookValidator();
    this.logger = logger;
  }

  async getAllBooks(): Promise<Book[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      this.logger.error(`Erro ao obter todos os livros: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async getBookById(id: number): Promise<Book | null> {
    try {
      return await this.repository.findById(id);
    } catch (error) {
      this.logger.error(`Erro ao obter livro por ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async createBook(bookData: any): Promise<Book> {
    try {
      const createBookDTO = new CreateBookDTO(bookData);
      const book = createBookDTO.toEntity();
      this.validator.validateBook(book);
      return await this.repository.create(book);
    } catch (error) {
      this.logger.error(`Erro ao criar livro: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async updateBook(id: number, bookData: any): Promise<Book> {
    try {
      const existingBook = await this.repository.findById(id);

      if (!existingBook) {
        throw new Error(`Livro com ID ${id} não encontrado`);
      }

      const updateBookDTO = new UpdateBookDTO({ id, ...bookData });
      const updatedBook = updateBookDTO.applyToEntity(existingBook);

      this.validator.validateBook(updatedBook);
      return await this.repository.update(id, updatedBook);
    } catch (error) {
      this.logger.error(`Erro ao atualizar livro com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async deleteBook(id: number): Promise<boolean> {
    try {
      const book = await this.repository.findById(id);

      if (!book) {
        throw new Error(`Livro com ID ${id} não encontrado`);
      }

      return await this.repository.delete(id);
    } catch (error) {
      this.logger.error(`Erro ao deletar livro com ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }
}
