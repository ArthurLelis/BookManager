import { IBookUpdateInput } from '../interfaces/IBookInput';
import { Book } from '../entities/Book';

export class UpdateBookDTO {
  id: number;
  title?: string;
  author?: string;
  publicationYear?: number;
  publisher?: string | null;
  genre?: string | null;
  acquisitionDate?: string | null;
  pageCount?: number | null;
  description?: string | null;

  constructor(data: IBookUpdateInput) {
    if (!data.id) {
      throw new Error('ID é obrigatório para atualização');
    }

    this.id = data.id;
    this.title = this.sanitizeOptionalString(data.title);
    this.author = this.sanitizeOptionalString(data.author);
    this.publicationYear = this.parseOptionalYear(data.publicationYear);
    this.publisher = this.sanitizeOptionalString(data.publisher);
    this.genre = this.sanitizeOptionalString(data.genre);
    this.acquisitionDate = this.sanitizeOptionalString(data.acquisitionDate);
    this.pageCount = this.parseOptionalPageCount(data.pageCount);
    this.description = this.sanitizeOptionalString(data.description);
  }

  private sanitizeOptionalString(value?: string): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (typeof value !== 'string') {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  }

  private parseOptionalYear(yearString?: string): number | undefined {
    if (yearString === undefined || yearString === null || typeof yearString !== 'string') {
      return undefined;
    }

    const yearValue = yearString.trim();

    if (yearValue === '') {
      return undefined;
    }

    if (!/^\d+$/.test(yearValue)) {
      throw new Error('O ano de publicação deve conter apenas números');
    }

    const year = parseInt(yearValue, 10);

    if (isNaN(year)) {
      throw new Error('O ano de publicação deve ser um número válido');
    }

    return year;
  }

  private parseOptionalPageCount(pageCountString?: string): number | undefined {
    if (!pageCountString || typeof pageCountString !== 'string' || pageCountString.trim() === '') {
      return undefined;
    }

    const pageCountValue = pageCountString.trim();

    if (!/^\d+$/.test(pageCountValue)) {
      throw new Error('O número de páginas deve conter apenas números');
    }

    const pageCount = parseInt(pageCountValue, 10);

    if (isNaN(pageCount)) {
      throw new Error('O número de páginas deve ser um número válido');
    }

    return pageCount;
  }

  applyToEntity(book: Book): Book {
    if (this.title !== undefined) book.title = this.title;
    if (this.author !== undefined) book.author = this.author;
    if (this.publicationYear !== undefined) book.publicationYear = this.publicationYear;
    if (this.publisher !== undefined) book.publisher = this.publisher;
    if (this.genre !== undefined) book.genre = this.genre;
    if (this.acquisitionDate !== undefined) book.acquisitionDate = this.acquisitionDate;
    if (this.pageCount !== undefined) book.pageCount = this.pageCount;
    if (this.description !== undefined) book.description = this.description;

    book.updateTimestamp();
    return book;
  }
}
