import { IBookInput } from '../interfaces/IBookInput';
import { Book } from '../entities/Book';

export class CreateBookDTO {
  title: string;
  author: string;
  publicationYear: number;
  publisher?: string | null;
  genre?: string | null;
  acquisitionDate?: string | null;
  pageCount?: number | null;
  description?: string | null;

  constructor(data: IBookInput) {
    this.title = this.validateAndSanitizeString(data.title, 'título');
    this.author = this.validateAndSanitizeString(data.author, 'autor');
    this.publicationYear = this.parseAndValidateYear(data.publicationYear);
    this.publisher = this.sanitizeOptionalString(data.publisher);
    this.genre = this.sanitizeOptionalString(data.genre);
    this.acquisitionDate = this.sanitizeOptionalString(data.acquisitionDate);
    this.pageCount = this.parseAndValidatePageCount(data.pageCount);
    this.description = this.sanitizeOptionalString(data.description);
  }

  private validateAndSanitizeString(value: string, fieldName: string): string {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error(`O campo ${fieldName} é obrigatório e deve ser uma string válida`);
    }

    return value.trim();
  }

  private sanitizeOptionalString(value?: string): string | null {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      return null;
    }
    return value.trim();
  }

  private parseAndValidateYear(yearString: string): number {
    if (yearString === undefined || yearString === null || typeof yearString !== 'string') {
      throw new Error('O ano de publicação é obrigatório');
    }

    const yearValue = yearString.trim();

    if (yearValue === '') {
      throw new Error('O ano de publicação é obrigatório');
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

  private parseAndValidatePageCount(pageCountString?: string): number | null {
    if (!pageCountString || typeof pageCountString !== 'string' || pageCountString.trim() === '') {
      return null;
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

  toEntity() {
    return new Book({
      title: this.title,
      author: this.author,
      publicationYear: this.publicationYear,
      publisher: this.publisher,
      genre: this.genre,
      acquisitionDate: this.acquisitionDate,
      pageCount: this.pageCount,
      description: this.description
    });
  }
}
