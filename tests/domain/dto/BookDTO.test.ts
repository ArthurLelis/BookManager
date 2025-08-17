import { BookDTO } from '../../../src/domain/dto/BookDTO';
import { Book } from '../../../src/domain/entities/Book';

describe('BookDTO', () => {
  const sampleData = {
    id: 1,
    title: 'O Senhor dos Anéis',
    author: 'J.R.R. Tolkien',
    publicationYear: 1954,
    publisher: 'Allen & Unwin',
    genre: 'Fantasia',
    acquisitionDate: '2023-01-15',
    pageCount: 423,
    description: 'Uma história épica de fantasia',
    createdAt: '2023-01-10T10:00:00.000Z',
    updatedAt: '2023-01-20T15:30:00.000Z'
  };

  describe('Constructor', () => {
    test('deve criar um DTO com todos os campos', () => {
      const dto = new BookDTO(sampleData);

      expect(dto.id).toBe(sampleData.id);
      expect(dto.title).toBe(sampleData.title);
      expect(dto.author).toBe(sampleData.author);
      expect(dto.publicationYear).toBe(sampleData.publicationYear);
      expect(dto.publisher).toBe(sampleData.publisher);
      expect(dto.genre).toBe(sampleData.genre);
      expect(dto.acquisitionDate).toBe(sampleData.acquisitionDate);
      expect(dto.pageCount).toBe(sampleData.pageCount);
      expect(dto.description).toBe(sampleData.description);
      expect(dto.createdAt).toBe(sampleData.createdAt);
      expect(dto.updatedAt).toBe(sampleData.updatedAt);
    });
  });

  describe('toEntity', () => {
    test('deve converter DTO para entidade Book', () => {
      const dto = new BookDTO(sampleData);
      const book = dto.toEntity();

      expect(book).toBeInstanceOf(Book);
      expect(book.id).toBe(sampleData.id);
      expect(book.title).toBe(sampleData.title);
      expect(book.author).toBe(sampleData.author);
      expect(book.publicationYear).toBe(sampleData.publicationYear);
      expect(book.publisher).toBe(sampleData.publisher);
      expect(book.genre).toBe(sampleData.genre);
      expect(book.acquisitionDate).toBe(sampleData.acquisitionDate);
      expect(book.pageCount).toBe(sampleData.pageCount);
      expect(book.description).toBe(sampleData.description);
    });
  });

  describe('fromDatabaseResult', () => {
    test('deve criar um DTO a partir de um resultado do banco de dados', () => {
      const dbResult = {
        id: 2,
        title: 'O Hobbit',
        author: 'J.R.R. Tolkien',
        publicationYear: 1937,
        publisher: 'Allen & Unwin',
        genre: 'Fantasia',
        acquisitionDate: null,
        pageCount: 310,
        description: 'A história de Bilbo Bolseiro',
        createdAt: '2023-02-10T10:00:00.000Z',
        updatedAt: null
      };

      const dto = BookDTO.fromDatabaseResult(dbResult);

      expect(dto).toBeInstanceOf(BookDTO);
      expect(dto.id).toBe(dbResult.id);
      expect(dto.title).toBe(dbResult.title);
      expect(dto.author).toBe(dbResult.author);
      expect(dto.publicationYear).toBe(dbResult.publicationYear);
      expect(dto.publisher).toBe(dbResult.publisher);
      expect(dto.genre).toBe(dbResult.genre);
      expect(dto.acquisitionDate).toBe(dbResult.acquisitionDate);
      expect(dto.pageCount).toBe(dbResult.pageCount);
      expect(dto.description).toBe(dbResult.description);
      expect(dto.createdAt).toBe(dbResult.createdAt);
      expect(dto.updatedAt).toBe(dbResult.updatedAt);
    });

    test('deve lidar com valores nulos ou indefinidos', () => {
      const dbResult = {
        id: 3,
        title: 'O Silmarillion',
        author: 'J.R.R. Tolkien',
        publicationYear: 1977,
        publisher: null,
        genre: undefined,
        acquisitionDate: null,
        pageCount: null,
        description: '',
        createdAt: '2023-03-10T10:00:00.000Z',
        updatedAt: null
      };

      const dto = BookDTO.fromDatabaseResult(dbResult);

      expect(dto.publisher).toBeNull();
      expect(dto.genre).toBeUndefined();
      expect(dto.acquisitionDate).toBeNull();
      expect(dto.pageCount).toBeNull();
      expect(dto.description).toBe('');
    });
  });
});
