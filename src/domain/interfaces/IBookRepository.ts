import { Book } from '../entities/Book';

export interface IBookRepository {
  findAll(): Promise<Book[]>;
  findById(id: number): Promise<Book | null>;
  create(book: Book): Promise<Book>;
  update(id: number, book: Book): Promise<Book>;
  delete(id: number): Promise<boolean>;
}
