import { Book } from '../../domain/entities/Book';
import { DateUtils } from '../../utils/DateUtils';
import { ValidationConstants } from '../../utils/ValidationConstants';

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
    const currentYear = ValidationConstants.getMaxPublicationYear();
    const minYear = ValidationConstants.MIN_PUBLICATION_YEAR;

    if (isNaN(Number(year))) {
      throw new Error('O ano de publicação deve ser um número');
    }

    if (!Number.isInteger(year)) {
      throw new Error('O ano de publicação deve ser um número inteiro');
    }

    if (year < minYear) {
      throw new Error(`O ano de publicação deve ser maior que ${minYear - 1}`);
    }

    if (year > currentYear) {
      throw new Error(`O ano de publicação não pode ser maior que ${currentYear}`);
    }
  }

  validatePageCount(pageCount: number | null): void {
    if (pageCount !== null) {
      const minPages = ValidationConstants.MIN_PAGE_COUNT;

      if (isNaN(Number(pageCount))) {
        throw new Error('O número de páginas deve ser um número');
      }

      if (!Number.isInteger(pageCount)) {
        throw new Error('O número de páginas deve ser um número inteiro');
      }

      if (pageCount < minPages) {
        throw new Error(`O número de páginas deve ser pelo menos ${minPages}`);
      }
    }
  }

  validateAcquisitionDate(dateString: string | null): void {
    if (!dateString) {
      return;
    }

    const parsedDate = DateUtils.parseDate(dateString);
    if (!parsedDate) {
      throw new Error('A data de aquisição deve estar no formato DD/MM/YYYY e ser uma data válida');
    }

    if (!DateUtils.isValidPastOrPresentDate(dateString)) {
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
