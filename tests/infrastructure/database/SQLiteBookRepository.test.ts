import { SQLiteBookRepository } from '../../../src/infrastructure/database/SQLiteBookRepository';
import { Database } from '../../../src/config/database';
import { Book } from '../../../src/domain/entities/Book';
import { ILogger } from '../../../src/domain/interfaces/ILogger';

type SQLiteCallback = (err: Error | null, result?: any) => void;
type SQLiteRunCallback = (this: { lastID?: number; changes?: number }, err: Error | null) => void;

jest.mock('../../../src/config/database', () => {
  const mockDb = {
    getConnection: jest.fn().mockReturnValue({
      all: jest.fn(),
      get: jest.fn(),
      run: jest.fn()
    }),
    initializeDatabase: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined)
  };

  return {
    Database: {
      getInstance: jest.fn().mockReturnValue(mockDb)
    }
  };
});

const createMockLogger = (): jest.Mocked<ILogger> => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
});

describe('SQLiteBookRepository', () => {
  let repository: SQLiteBookRepository;
  let mockLogger: jest.Mocked<ILogger>;
  let mockDb: any;
  let mockConnection: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLogger = createMockLogger();
    mockDb = Database.getInstance();
    mockConnection = mockDb.getConnection();
    repository = new SQLiteBookRepository(mockLogger);
  });

  describe('findAll', () => {
    test('deve retornar uma lista de livros quando a consulta for bem-sucedida', async () => {
      const mockRows = [
        {
          id: 1,
          title: 'Livro 1',
          author: 'Autor 1',
          publicationYear: 2021,
          publisher: 'Editora 1',
          genre: 'Gênero 1',
          acquisitionDate: null,
          pageCount: 200,
          description: 'Descrição 1',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: null
        },
        {
          id: 2,
          title: 'Livro 2',
          author: 'Autor 2',
          publicationYear: 2022,
          publisher: 'Editora 2',
          genre: 'Gênero 2',
          acquisitionDate: '2023-02-15',
          pageCount: 300,
          description: 'Descrição 2',
          createdAt: '2023-02-01T00:00:00.000Z',
          updatedAt: '2023-02-10T00:00:00.000Z'
        }
      ];

      mockConnection.all.mockImplementation((sql: string, params: any[], callback: SQLiteCallback) => {
        callback(null, mockRows);
      });

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Book);
      expect(result[0].id).toBe(1);
      expect(result[0].title).toBe('Livro 1');
      expect(result[1].id).toBe(2);
      expect(result[1].title).toBe('Livro 2');
      expect(mockConnection.all).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM books'),
        [],
        expect.any(Function)
      );
      expect(mockLogger.info).toHaveBeenCalledWith('2 livros encontrados');
    });

    test('deve rejeitar com erro quando a consulta falhar', async () => {
      const mockError = new Error('Erro de banco de dados');
      mockConnection.all.mockImplementation((sql: string, params: any[], callback: SQLiteCallback) => {
        callback(mockError, null);
      });

      await expect(repository.findAll()).rejects.toThrow(mockError);
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Erro ao listar livros'));
    });
  });

  describe('findById', () => {
    test('deve retornar um livro quando encontrado pelo ID', async () => {
      const mockRow = {
        id: 1,
        title: 'Livro Encontrado',
        author: 'Autor Teste',
        publicationYear: 2020,
        publisher: 'Editora Teste',
        genre: 'Gênero Teste',
        acquisitionDate: null,
        pageCount: 200,
        description: 'Descrição teste',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: null
      };

      mockConnection.get.mockImplementation((sql: string, params: any[], callback: SQLiteCallback) => {
        callback(null, mockRow);
      });

      const result = await repository.findById(1);

      expect(result).toBeInstanceOf(Book);
      expect(result!.id).toBe(1);
      expect(result!.title).toBe('Livro Encontrado');
      expect(mockConnection.get).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM books WHERE id = ?'),
        [1],
        expect.any(Function)
      );
      expect(mockLogger.info).toHaveBeenCalledWith('Livro com ID 1 encontrado');
    });

    test('deve retornar null quando o livro não for encontrado', async () => {
      mockConnection.get.mockImplementation((sql: string, params: any[], callback: SQLiteCallback) => {
        callback(null, undefined);
      });

      const result = await repository.findById(999);

      expect(result).toBeNull();
      expect(mockLogger.warn).toHaveBeenCalledWith('Livro com ID 999 não encontrado');
    });

    test('deve rejeitar com erro quando a consulta falhar', async () => {
      const mockError = new Error('Erro de banco de dados');
      mockConnection.get.mockImplementation((sql: string, params: any[], callback: SQLiteCallback) => {
        callback(mockError, null);
      });

      await expect(repository.findById(1)).rejects.toThrow(mockError);
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Erro ao encontrar livro com ID 1'));
    });
  });

  describe('create', () => {
    test('deve criar um novo livro e retorná-lo com ID', async () => {
      const newBook = new Book({
        title: 'Novo Livro',
        author: 'Novo Autor',
        publicationYear: 2023,
        publisher: 'Nova Editora',
        genre: 'Novo Gênero',
        pageCount: 250,
        description: 'Nova descrição'
      });

      mockConnection.run.mockImplementation(function (this: any, sql: string, params: any[], callback: SQLiteRunCallback) {
        callback.call({ lastID: 5 }, null);
      });

      const result = await repository.create(newBook);

      expect(result).toBeInstanceOf(Book);
      expect(result.id).toBe(5);
      expect(result.title).toBe('Novo Livro');
      expect(mockConnection.run).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO books'),
        expect.arrayContaining([
          'Novo Livro',
          'Novo Autor',
          2023,
          'Nova Editora',
          'Novo Gênero',
          null,
          250,
          'Nova descrição'
        ]),
        expect.any(Function)
      );
      expect(mockLogger.info).toHaveBeenCalledWith('Livro criado com ID 5');
    });

    test('deve rejeitar com erro quando a inserção falhar', async () => {
      const newBook = new Book({
        title: 'Livro com Erro',
        author: 'Autor Teste',
        publicationYear: 2023
      });

      const mockError = new Error('Erro ao inserir no banco de dados');
      mockConnection.run.mockImplementation((sql: string, params: any[], callback: SQLiteRunCallback) => {
        callback.call({}, mockError);
      });

      await expect(repository.create(newBook)).rejects.toThrow(mockError);
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Erro ao criar livro'));
    });
  });

  describe('update', () => {
    test('deve atualizar um livro existente e retorná-lo', async () => {
      jest.clearAllMocks();

      const bookToUpdate = new Book({
        id: 3,
        title: 'Livro Atualizado',
        author: 'Autor Atualizado',
        publicationYear: 2022,
        publisher: 'Editora Atualizada',
        genre: 'Gênero Atualizado',
        pageCount: 350,
        description: 'Descrição atualizada',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-08-15T10:00:00.000Z'
      });

      mockConnection.get.mockImplementation((sql: string, params: any[], callback: SQLiteCallback) => {
        if (sql.includes('SELECT * FROM books WHERE id = ?') && params[0] === 3) {
          callback(null, {
            id: 3,
            title: 'Livro Original',
            author: 'Autor Original',
            publicationYear: 2020,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: null
          });
        }
      });

      mockConnection.run.mockImplementation(function (this: any, sql: string, params: any[], callback: SQLiteRunCallback) {
        if (sql.includes('UPDATE books SET')) {
          callback.call({ changes: 1 }, null);
        }
      });

      const result = await repository.update(3, bookToUpdate);

      expect(result).toBeInstanceOf(Book);
      expect(result.id).toBe(3);
      expect(result.title).toBe('Livro Atualizado');
      expect(mockConnection.run).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE books SET'),
        expect.arrayContaining([
          'Livro Atualizado',
          'Autor Atualizado',
          2022,
          'Editora Atualizada',
          'Gênero Atualizado',
          null,
          350,
          'Descrição atualizada',
          expect.any(String),
          3
        ]),
        expect.any(Function)
      );
      expect(mockLogger.info).toHaveBeenCalledWith('Livro com ID 3 atualizado com sucesso');
    });

    test('deve rejeitar quando o livro não for encontrado para atualização', async () => {
      jest.clearAllMocks();

      const bookToUpdate = new Book({
        id: 999,
        title: 'Livro Inexistente',
        author: 'Autor Teste',
        publicationYear: 2022
      });

      mockConnection.get.mockImplementation((sql: string, params: any[], callback: SQLiteCallback) => {
        if (sql.includes('SELECT * FROM books WHERE id = ?') && params[0] === 999) {
          callback(null, undefined);
        }
      });

      mockConnection.run.mockImplementation(function (this: any, sql: string, params: any[], callback: SQLiteRunCallback) {
        if (sql.includes('UPDATE books SET')) {
          callback.call({ changes: 0 }, null);
        }
      });

      await expect(repository.update(999, bookToUpdate)).rejects.toThrow('Livro com ID 999 não encontrado');
      expect(mockLogger.warn).toHaveBeenCalledWith('Nenhum livro encontrado com ID 999 para atualização');
    });

    test('deve rejeitar com erro quando a atualização falhar', async () => {
      jest.clearAllMocks();

      const bookToUpdate = new Book({
        id: 3,
        title: 'Livro com Erro',
        author: 'Autor Teste',
        publicationYear: 2022
      });

      mockConnection.get.mockImplementation((sql: string, params: any[], callback: SQLiteCallback) => {
        if (sql.includes('SELECT * FROM books WHERE id = ?') && params[0] === 3) {
          callback(null, {
            id: 3,
            title: 'Livro Original',
            author: 'Autor Original',
            publicationYear: 2020,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: null
          });
        }
      });

      const updateError = new Error('Erro ao atualizar no banco de dados');
      mockConnection.run.mockImplementation((sql: string, params: any[], callback: SQLiteRunCallback) => {
        if (sql.includes('UPDATE books SET')) {
          callback.call({}, updateError);
        }
      });

      await expect(repository.update(3, bookToUpdate)).rejects.toThrow(updateError);
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Erro ao atualizar livro com ID 3'));
    });
  });

  describe('delete', () => {
    test('deve deletar um livro existente e retornar true', async () => {
      jest.clearAllMocks();

      mockConnection.get.mockImplementation((sql: string, params: any[], callback: SQLiteCallback) => {
        if (sql.includes('SELECT * FROM books WHERE id = ?') && params[0] === 4) {
          callback(null, {
            id: 4,
            title: 'Livro para Deletar',
            author: 'Autor Teste',
            publicationYear: 2020
          });
        }
      });

      mockConnection.run.mockImplementation(function (this: any, sql: string, params: any[], callback: SQLiteRunCallback) {
        if (sql.includes('DELETE FROM books WHERE id = ?')) {
          callback.call({ changes: 1 }, null);
        }
      });

      const result = await repository.delete(4);

      expect(result).toBe(true);
      expect(mockConnection.run).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM books WHERE id = ?'),
        [4],
        expect.any(Function)
      );
      expect(mockLogger.info).toHaveBeenCalledWith('Livro com ID 4 deletado com sucesso');
    });

    test('deve retornar false quando o livro não for encontrado para exclusão', async () => {
      jest.clearAllMocks();

      mockConnection.get.mockImplementation((sql: string, params: any[], callback: SQLiteCallback) => {
        if (sql.includes('SELECT * FROM books WHERE id = ?') && params[0] === 999) {
          callback(null, undefined);
        }
      });

      mockConnection.run.mockImplementation(function (this: any, sql: string, params: any[], callback: SQLiteRunCallback) {
        if (sql.includes('DELETE FROM books WHERE id = ?')) {
          callback.call({ changes: 0 }, null);
        }
      });

      const result = await repository.delete(999);

      expect(result).toBe(false);
      expect(mockLogger.warn).toHaveBeenCalledWith('Nenhum livro encontrado com ID 999 para exclusão');
    });

    test('deve rejeitar com erro quando a exclusão falhar', async () => {
      jest.clearAllMocks();

      mockConnection.get.mockImplementation((sql: string, params: any[], callback: SQLiteCallback) => {
        if (sql.includes('SELECT * FROM books WHERE id = ?') && params[0] === 4) {
          callback(null, {
            id: 4,
            title: 'Livro para Deletar',
            author: 'Autor Teste',
            publicationYear: 2020
          });
        }
      });

      const deleteError = new Error('Erro ao excluir do banco de dados');
      mockConnection.run.mockImplementation((sql: string, params: any[], callback: SQLiteRunCallback) => {
        if (sql.includes('DELETE FROM books WHERE id = ?')) {
          callback.call({}, deleteError);
        }
      });

      await expect(repository.delete(4)).rejects.toThrow(deleteError);
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Erro ao deletar livro com ID 4'));
    });
  });
});
