import { Book } from '../../domain/entities/Book';
import { DateUtils } from '../../utils/DateUtils';

export class BookValidator {
  validateRequiredFields(book: Book): void {
    if (!book.title || book.title.trim() === '') {
      throw new Error('O título do livro é obrigatório.');
    }

    if (!book.author || book.author.trim() === '') {
      throw new Error('O autor do livro é obrigatório.');
    }

    if (!book.publicationYear) {
      throw new Error('O ano de publicação é obrigatório.');
    }
  }

  validatePublicationYear(year: number): void {
    const currentYear = new Date().getFullYear();

    if (isNaN(year)) {
      throw new Error('O ano de publicação deve ser um número.');
    }

    if (year < 0 || year > currentYear) {
      throw new Error(`O ano de publicação deve estar entre 0 e ${currentYear}.`);
    }
  }

  validatePageCount(pageCount: number | null): void {
    if (pageCount !== null) {
      if (isNaN(Number(pageCount))) {
        throw new Error('O número de páginas deve ser um número.');
      }

      if (Number(pageCount) <= 0) {
        throw new Error('O número de páginas deve ser maior que zero.');
      }
    }
  }

  validateAcquisitionDate(date: string | null): void {
    if (!date) return; // Data opcional

    const parsedDate = DateUtils.parseDate(date);
    if (!parsedDate) {
      throw new Error('A data de aquisição deve estar no formato DD/MM/YYYY e ser uma data válida');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (parsedDate > today) {
      throw new Error('A data de aquisição não pode ser uma data futura');
    }
  }

  validateBook(book: Book): void {
    this.validateRequiredFields(book);
    this.validatePublicationYear(book.publicationYear);
    this.validatePageCount(book.pageCount);
    this.validateAcquisitionDate(book.acquisitionDate);
  }
}
