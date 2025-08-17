import { BookService } from '../../../src/application/services/BookService';
import { Book } from '../../../src/domain/entities/Book';
import { IBookRepository } from '../../../src/domain/interfaces/IBookRepository';
import { ILogger } from '../../../src/domain/interfaces/ILogger';
import { BookValidator } from '../../../src/application/validators/BookValidator';
import { CreateBookDTO } from '../../../src/domain/dto/CreateBookDTO';
import { UpdateBookDTO } from '../../../src/domain/dto/UpdateBookDTO';

jest.mock('../../../src/application/validators/BookValidator', () => {
  return {
    BookValidator: jest.fn().mockImplementation(() => {
      return {
        validateBook: jest.fn()
      };
    })
  };
});

jest.mock('../../../src/domain/dto/CreateBookDTO', () => {
  return {
    CreateBookDTO: jest.fn().mockImplementation((data) => {
      return {
        ...data,
        toEntity: jest.fn().mockImplementation(() => {
          const { Book } = require('../../../src/domain/entities/Book');
          return new Book({
            title: data.title || '',
            author: data.author || '',
            publicationYear: parseInt(data.publicationYear) || 0,
            publisher: data.publisher,
            genre: data.genre,
            acquisitionDate: data.acquisitionDate,
            pageCount: data.pageCount ? parseInt(data.pageCount) : null,
            description: data.description
          });
        })
      };
    })
  };
});

jest.mock('../../../src/domain/dto/UpdateBookDTO', () => {
  return {
    UpdateBookDTO: jest.fn().mockImplementation((data) => {
      return {
        ...data,
        applyToEntity: jest.fn().mockImplementation((book) => {
          if (data.title) book.title = data.title;
          if (data.author) book.author = data.author;
          if (data.publicationYear) book.publicationYear = data.publicationYear;
          if (data.publisher !== undefined) book.publisher = data.publisher;
          if (data.genre !== undefined) book.genre = data.genre;
          if (data.acquisitionDate !== undefined) book.acquisitionDate = data.acquisitionDate;
          if (data.pageCount !== undefined) book.pageCount = data.pageCount;
          if (data.description !== undefined) book.description = data.description;
          book.updateTimestamp();
          return book;
        })
      };
    })
  };
});

describe('BookService', () => {
  let mockRepository: jest.Mocked<IBookRepository>;
  let mockLogger: jest.Mocked<ILogger>;
  let bookService: BookService;

  const sampleBook = new Book({
    id: 1,
    title: 'O Senhor dos Anéis',
    author: 'J.R.R. Tolkien',
    publicationYear: 1954,
    publisher: 'Allen & Unwin',
    genre: 'Fantasia',
    pageCount: 423,
    createdAt: '2023-08-15T10:00:00.000Z'
  });

  const sampleBookData = {
    title: 'O Hobbit',
    author: 'J.R.R. Tolkien',
    publicationYear: '1937',
    publisher: 'Allen & Unwin',
    genre: 'Fantasia',
    pageCount: '310'
  };

  const updatedBookData = {
    title: 'O Hobbit: Uma Jornada Inesperada',
    genre: 'Fantasia/Aventura'
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn()
    };

    (BookValidator as jest.Mock).mockImplementation(() => ({
      validateBook: jest.fn()
    }));

    bookService = new BookService(mockRepository, mockLogger);
  });

  describe('getAllBooks', () => {
    test('deve retornar todos os livros quando a busca for bem-sucedida', async () => {
      const books = [sampleBook];
      mockRepository.findAll.mockResolvedValue(books);

      const result = await bookService.getAllBooks();

      expect(result).toEqual(books);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    test('deve lançar e registrar erro quando a busca falhar', async () => {
      const error = new Error('Erro de conexão com o banco de dados');
      mockRepository.findAll.mockRejectedValue(error);

      await expect(bookService.getAllBooks()).rejects.toThrow(error);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Erro ao obter todos os livros'));
    });
  });

  describe('getBookById', () => {
    test('deve retornar um livro quando encontrado pelo ID', async () => {
      mockRepository.findById.mockResolvedValue(sampleBook);

      const result = await bookService.getBookById(1);

      expect(result).toEqual(sampleBook);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    test('deve retornar null quando o livro não for encontrado', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await bookService.getBookById(999);

      expect(result).toBeNull();
      expect(mockRepository.findById).toHaveBeenCalledWith(999);
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    test('deve lançar e registrar erro quando a busca falhar', async () => {
      const error = new Error('Erro de conexão com o banco de dados');
      mockRepository.findById.mockRejectedValue(error);

      await expect(bookService.getBookById(1)).rejects.toThrow(error);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Erro ao obter livro por ID 1'));
    });
  });

  describe('createBook', () => {
    test('deve criar e retornar um novo livro quando os dados forem válidos', async () => {
      const createdBook = new Book({
        id: 1,
        title: sampleBookData.title,
        author: sampleBookData.author,
        publicationYear: parseInt(sampleBookData.publicationYear),
        publisher: sampleBookData.publisher,
        genre: sampleBookData.genre,
        pageCount: parseInt(sampleBookData.pageCount),
        createdAt: expect.any(String)
      });

      mockRepository.create.mockResolvedValue(createdBook);

      const result = await bookService.createBook(sampleBookData);

      expect(result).toEqual(createdBook);
      expect(CreateBookDTO).toHaveBeenCalledWith(sampleBookData);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    test('deve lançar e registrar erro quando a validação falhar', async () => {
      const validationError = new Error('O título do livro é obrigatório');

      const mockValidateBook = jest.fn().mockImplementation(() => {
        throw validationError;
      });

      (BookValidator as jest.Mock).mockImplementation(() => ({
        validateBook: mockValidateBook
      }));

      bookService = new BookService(mockRepository, mockLogger);

      await expect(bookService.createBook({ title: '', author: 'Autor sem título', publicationYear: '2023' })).rejects.toThrow(validationError);
      expect(mockValidateBook).toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Erro ao criar livro'));
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    test('deve lançar e registrar erro quando a criação no repositório falhar', async () => {
      const error = new Error('Erro ao inserir no banco de dados');
      mockRepository.create.mockRejectedValueOnce(error);

      await expect(bookService.createBook(sampleBookData)).rejects.toThrow(error);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Erro ao criar livro'));
    });
  });

  describe('updateBook', () => {
    test('deve atualizar e retornar o livro quando os dados forem válidos', async () => {
      const updatedBook = new Book({
        id: sampleBook.id,
        title: updatedBookData.title,
        author: sampleBook.author,
        publicationYear: sampleBook.publicationYear,
        publisher: sampleBook.publisher,
        genre: updatedBookData.genre,
        acquisitionDate: sampleBook.acquisitionDate,
        pageCount: sampleBook.pageCount,
        description: sampleBook.description,
        createdAt: sampleBook.createdAt,
        updatedAt: expect.any(String)
      });

      mockRepository.findById.mockResolvedValue(sampleBook);
      mockRepository.update.mockResolvedValue(updatedBook);

      const result = await bookService.updateBook(1, updatedBookData);

      expect(result).toEqual(updatedBook);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(UpdateBookDTO).toHaveBeenCalledWith({ id: 1, ...updatedBookData });
      expect(mockRepository.update).toHaveBeenCalledWith(1, expect.any(Book));
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    test('deve lançar erro quando o livro não for encontrado', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(bookService.updateBook(999, updatedBookData)).rejects.toThrow('Livro com ID 999 não encontrado');
      expect(mockRepository.findById).toHaveBeenCalledWith(999);
      expect(mockRepository.update).not.toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Erro ao atualizar livro com ID 999'));
    });

    test('deve lançar e registrar erro quando a validação falhar', async () => {
      const validationError = new Error('O título do livro é obrigatório');

      const mockValidateBook = jest.fn().mockImplementation(() => {
        throw validationError;
      });

      (BookValidator as jest.Mock).mockImplementation(() => ({
        validateBook: mockValidateBook
      }));

      bookService = new BookService(mockRepository, mockLogger);

      await expect(bookService.createBook({ title: '', author: 'Autor sem título', publicationYear: '2023' })).rejects.toThrow(validationError);
      expect(mockValidateBook).toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Erro ao criar livro'));
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    test('deve lançar e registrar erro quando a atualização no repositório falhar', async () => {
      mockRepository.findById.mockResolvedValue(sampleBook);

      const error = new Error('Erro ao atualizar no banco de dados');
      mockRepository.update.mockRejectedValueOnce(error);

      await expect(bookService.updateBook(1, updatedBookData)).rejects.toThrow(error);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.update).toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Erro ao atualizar livro com ID 1'));
    });
  });

  describe('deleteBook', () => {
    test('deve deletar e retornar true quando o livro existir', async () => {
      mockRepository.findById.mockResolvedValue(sampleBook);
      mockRepository.delete.mockResolvedValue(true);

      const result = await bookService.deleteBook(1);

      expect(result).toBe(true);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    test('deve lançar erro quando o livro não for encontrado', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(bookService.deleteBook(999)).rejects.toThrow('Livro com ID 999 não encontrado');
      expect(mockRepository.findById).toHaveBeenCalledWith(999);
      expect(mockRepository.delete).not.toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Erro ao deletar livro com ID 999'));
    });

    test('deve lançar e registrar erro quando a exclusão no repositório falhar', async () => {
      mockRepository.findById.mockResolvedValue(sampleBook);

      const error = new Error('Erro ao excluir do banco de dados');
      mockRepository.delete.mockRejectedValue(error);

      await expect(bookService.deleteBook(1)).rejects.toThrow(error);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Erro ao deletar livro com ID 1'));
    });
  });
});
