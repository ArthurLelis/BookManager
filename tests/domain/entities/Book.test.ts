import { Book } from '../../../src/domain/entities/Book';

describe('Book Entity', () => {
  describe('Constructor', () => {
    test('deve criar um livro válido com todos os campos', () => {
      const bookData = {
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
        updatedAt: null
      };

      const book = new Book(bookData);

      expect(book.id).toBe(bookData.id);
      expect(book.title).toBe(bookData.title);
      expect(book.author).toBe(bookData.author);
      expect(book.publicationYear).toBe(bookData.publicationYear);
      expect(book.publisher).toBe(bookData.publisher);
      expect(book.genre).toBe(bookData.genre);
      expect(book.acquisitionDate).toBe(bookData.acquisitionDate);
      expect(book.pageCount).toBe(bookData.pageCount);
      expect(book.description).toBe(bookData.description);
      expect(book.createdAt).toBe(bookData.createdAt);
      expect(book.updatedAt).toBe(bookData.updatedAt);
    });

    test('deve criar um livro com apenas campos obrigatórios', () => {
      const bookData = {
        title: 'O Hobbit',
        author: 'J.R.R. Tolkien',
        publicationYear: 1937
      };

      const book = new Book(bookData);

      expect(book.id).toBeNull();
      expect(book.title).toBe(bookData.title);
      expect(book.author).toBe(bookData.author);
      expect(book.publicationYear).toBe(bookData.publicationYear);
      expect(book.publisher).toBeNull();
      expect(book.genre).toBeNull();
      expect(book.acquisitionDate).toBeNull();
      expect(book.pageCount).toBeNull();
      expect(book.description).toBeNull();
      expect(book.createdAt).toBeDefined();
      expect(book.updatedAt).toBeNull();
    });

    test('deve definir createdAt automaticamente se não fornecido', () => {
      const book = new Book({
        title: 'O Silmarillion',
        author: 'J.R.R. Tolkien',
        publicationYear: 1977
      });

      expect(book.createdAt).toBeDefined();
      expect(new Date(book.createdAt).getTime()).toBeLessThanOrEqual(new Date().getTime());
    });
  });

  describe('Getters e Setters', () => {
    test('deve permitir atualizar propriedades através de setters', () => {
      const book = new Book({
        title: 'Título Original',
        author: 'Autor Original',
        publicationYear: 2000
      });

      book.title = 'Título Atualizado';
      book.author = 'Autor Atualizado';
      book.publicationYear = 2001;
      book.publisher = 'Nova Editora';
      book.genre = 'Novo Gênero';

      expect(book.title).toBe('Título Atualizado');
      expect(book.author).toBe('Autor Atualizado');
      expect(book.publicationYear).toBe(2001);
      expect(book.publisher).toBe('Nova Editora');
      expect(book.genre).toBe('Novo Gênero');
    });
  });

  describe('updateTimestamp', () => {
    test('deve atualizar o timestamp de atualização', () => {
      jest.useFakeTimers();

      const book = new Book({
        title: 'Livro para Atualizar',
        author: 'Autor Teste',
        publicationYear: 2020
      });

      expect(book.updatedAt).toBeNull();

      const futureDate = new Date();
      futureDate.setSeconds(futureDate.getSeconds() + 10);
      jest.setSystemTime(futureDate);

      book.updateTimestamp();

      expect(book.updatedAt).not.toBeNull();
      expect(new Date(book.updatedAt!).getTime()).toBeLessThanOrEqual(new Date().getTime());

      jest.useRealTimers();
    });
  });

  describe('toJSON', () => {
    test('deve converter o livro para um objeto JSON', () => {
      const bookData = {
        id: 5,
        title: 'Livro Teste',
        author: 'Autor Teste',
        publicationYear: 2022,
        publisher: 'Editora Teste',
        genre: 'Gênero Teste',
        createdAt: '2022-01-01T00:00:00.000Z'
      };

      const book = new Book(bookData);
      const json = book.toJSON();

      expect(json).toEqual({
        id: bookData.id,
        title: bookData.title,
        author: bookData.author,
        publicationYear: bookData.publicationYear,
        publisher: bookData.publisher,
        genre: bookData.genre,
        acquisitionDate: null,
        pageCount: null,
        description: null,
        createdAt: bookData.createdAt,
        updatedAt: null
      });
    });
  });
});
