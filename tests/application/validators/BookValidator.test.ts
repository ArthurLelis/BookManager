import { BookValidator } from '../../../src/application/validators/BookValidator';
import { Book } from '../../../src/domain/entities/Book';
import { DateUtils } from '../../../src/utils/DateUtils';

jest.mock('../../../src/utils/DateUtils', () => ({
  DateUtils: {
    parseDate: jest.fn(),
    getCurrentDate: jest.fn(),
    isValidPastOrPresentDate: jest.fn().mockReturnValue(true)
  }
}));

describe('BookValidator', () => {
  let validator: BookValidator;

  beforeEach(() => {
    validator = new BookValidator();
    jest.clearAllMocks();

    (DateUtils.parseDate as jest.Mock).mockReturnValue(new Date('2023-08-15T00:00:00.000Z'));
    (DateUtils.getCurrentDate as jest.Mock).mockReturnValue(new Date('2023-08-15T00:00:00.000Z'));
    (DateUtils.isValidPastOrPresentDate as jest.Mock).mockReturnValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('validateRequiredFields', () => {
    test('deve passar quando todos os campos obrigatórios estão presentes', () => {
      const book = new Book({
        title: 'Livro Válido',
        author: 'Autor Válido',
        publicationYear: 2020
      });

      expect(() => validator.validateRequiredFields(book)).not.toThrow();
    });

    test('deve lançar erro quando o título está ausente', () => {
      const book = new Book({
        title: '',
        author: 'Autor Válido',
        publicationYear: 2020
      });

      expect(() => validator.validateRequiredFields(book)).toThrow('O título do livro é obrigatório');
    });

    test('deve lançar erro quando o autor está ausente', () => {
      const book = new Book({
        title: 'Livro Válido',
        author: '',
        publicationYear: 2020
      });

      expect(() => validator.validateRequiredFields(book)).toThrow('O autor do livro é obrigatório');
    });

    test('deve lançar erro quando o ano de publicação está ausente', () => {
      const book = new Book({
        title: 'Livro Válido',
        author: 'Autor Válido',
        publicationYear: 0
      });

      expect(() => validator.validateRequiredFields(book)).toThrow('O ano de publicação é obrigatório');
    });
  });

  describe('validatePublicationYear', () => {
    test('deve passar quando o ano de publicação é válido', () => {
      expect(() => validator.validatePublicationYear(2000)).not.toThrow();
    });

    test('deve lançar erro quando o ano de publicação não é um número', () => {
      expect(() => validator.validatePublicationYear(NaN)).toThrow('O ano de publicação deve ser um número');
    });

    test('deve lançar erro quando o ano de publicação não é um número inteiro', () => {
      expect(() => validator.validatePublicationYear(2000.5)).toThrow('O ano de publicação deve ser um número inteiro');
    });

    test('deve lançar erro quando o ano de publicação é negativo', () => {
      expect(() => validator.validatePublicationYear(-1)).toThrow(`O ano de publicação deve ser maior que 0`);
    });

    test('deve lançar erro quando o ano de publicação é maior que o ano atual', () => {
      const currentYear = new Date().getFullYear();
      const futureYear = currentYear + 1;
      expect(() => validator.validatePublicationYear(futureYear)).toThrow(`O ano de publicação não pode ser maior que ${currentYear}`);
    });
  });

  describe('validatePageCount', () => {
    test('deve passar quando o número de páginas é válido', () => {
      expect(() => validator.validatePageCount(100)).not.toThrow();
    });

    test('deve passar quando o número de páginas é null', () => {
      expect(() => validator.validatePageCount(null)).not.toThrow();
    });

    test('deve lançar erro quando o número de páginas não é um número', () => {
      expect(() => validator.validatePageCount(NaN as any)).toThrow('O número de páginas deve ser um número');
    });

    test('deve lançar erro quando o número de páginas não é um número inteiro', () => {
      expect(() => validator.validatePageCount(100.5)).toThrow('O número de páginas deve ser um número inteiro');
    });

    test('deve lançar erro quando o número de páginas é zero ou negativo', () => {
      expect(() => validator.validatePageCount(0)).toThrow('O número de páginas deve ser pelo menos 1');
      expect(() => validator.validatePageCount(-1)).toThrow('O número de páginas deve ser pelo menos 1');
    });
  });

  describe('validateAcquisitionDate', () => {
    beforeEach(() => {
      const mockDate = new Date('2023-08-15T00:00:00.000Z');
      (DateUtils.parseDate as jest.Mock).mockReturnValue(mockDate);
      (DateUtils.getCurrentDate as jest.Mock).mockReturnValue(mockDate);
      (DateUtils.isValidPastOrPresentDate as jest.Mock).mockReturnValue(true);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('deve passar quando a data de aquisição é válida', () => {
      (DateUtils.parseDate as jest.Mock).mockReturnValue(new Date('2023-08-15T00:00:00.000Z'));
      (DateUtils.isValidPastOrPresentDate as jest.Mock).mockReturnValue(true);

      expect(() => validator.validateAcquisitionDate('15/08/2023')).not.toThrow();
      expect(DateUtils.parseDate).toHaveBeenCalledWith('15/08/2023');
    });

    test('deve passar quando a data de aquisição é null', () => {
      expect(() => validator.validateAcquisitionDate(null)).not.toThrow();
      expect(DateUtils.parseDate).not.toHaveBeenCalled();
    });

    test('deve lançar erro quando a data de aquisição tem formato inválido', () => {
      (DateUtils.parseDate as jest.Mock).mockReturnValueOnce(null);

      expect(() => validator.validateAcquisitionDate('2023-08-15')).toThrow('A data de aquisição deve estar no formato DD/MM/YYYY e ser uma data válida');
      expect(DateUtils.parseDate).toHaveBeenCalledWith('2023-08-15');
    });

    test('deve lançar erro quando a data de aquisição é inválida', () => {
      (DateUtils.parseDate as jest.Mock).mockReturnValueOnce(null);

      expect(() => validator.validateAcquisitionDate('31/02/2023')).toThrow('A data de aquisição deve estar no formato DD/MM/YYYY e ser uma data válida');
      expect(DateUtils.parseDate).toHaveBeenCalledWith('31/02/2023');
    });

    test('deve lançar erro quando a data de aquisição é futura', () => {
      (DateUtils.parseDate as jest.Mock).mockReturnValue(new Date('2023-08-16T00:00:00.000Z'));
      (DateUtils.isValidPastOrPresentDate as jest.Mock).mockReturnValue(false);

      expect(() => validator.validateAcquisitionDate('16/08/2023')).toThrow('A data de aquisição não pode ser uma data futura');
      expect(DateUtils.parseDate).toHaveBeenCalledWith('16/08/2023');
    });
  });

  describe('validateBook', () => {
    beforeEach(() => {
      (DateUtils.isValidPastOrPresentDate as jest.Mock).mockReturnValue(true);
    });

    test('deve validar um livro completamente válido', () => {
      const book = new Book({
        title: 'Livro Válido',
        author: 'Autor Válido',
        publicationYear: 2020,
        publisher: 'Editora Teste',
        genre: 'Gênero Teste',
        acquisitionDate: '10/08/2023',
        pageCount: 200,
        description: 'Descrição teste'
      });

      (DateUtils.isValidPastOrPresentDate as jest.Mock).mockReturnValue(true);

      expect(() => validator.validateBook(book)).not.toThrow();
    });

    test('deve validar um livro com apenas campos obrigatórios', () => {
      const book = new Book({
        title: 'Livro Válido',
        author: 'Autor Válido',
        publicationYear: 2020
      });

      expect(() => validator.validateBook(book)).not.toThrow();
    });

    test('deve lançar erro quando qualquer validação falhar', () => {
      const book = new Book({
        title: 'Livro Válido',
        author: 'Autor Válido',
        publicationYear: 2020,
        pageCount: -1
      });

      expect(() => validator.validateBook(book)).toThrow('O número de páginas deve ser pelo menos 1');
    });
  });
});
