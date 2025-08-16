import { BookService } from '../../application/services/BookService';
import { ILogger } from '../../domain/interfaces/ILogger';
import { UserInterface } from './UserInterface';
import { MenuOption, menuChoices } from './MenuOptions';

export class BookCLI {
  private bookService: BookService;
  private ui: UserInterface;
  private logger: ILogger;

  constructor(bookService: BookService, logger: ILogger) {
    this.bookService = bookService;
    this.logger = logger;
    this.ui = new UserInterface(logger);
  }

  async start(): Promise<void> {
    console.log('\nIniciando o Sistema de Gerenciamento de Livros...');

    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.showMainMenu();
  }

  private async showMainMenu(): Promise<void> {
    try {
      const option = await this.ui.showMenu(menuChoices);

      switch (option) {
        case MenuOption.LIST_BOOKS:
          await this.listBooks();
          break;
        case MenuOption.FIND_BOOK:
          await this.findBookById();
          break;
        case MenuOption.CREATE_BOOK:
          await this.createBook();
          break;
        case MenuOption.UPDATE_BOOK:
          await this.updateBook();
          break;
        case MenuOption.DELETE_BOOK:
          await this.deleteBook();
          break;
        case MenuOption.EXIT:
          this.ui.displayGoodbye();
          process.exit(0);
      }

    } catch (error) {
      this.logger.error(`Erro no menu principal: ${error instanceof Error ? error.message : String(error)}`);
      this.ui.displayError(`Erro no menu principal: ${error instanceof Error ? error.message : String(error)}`);
      await this.returnToMainMenu();
    }
  }

  private async listBooks(): Promise<void> {
    console.clear();
    console.log('LISTA DE LIVROS \n');

    try {
      const books = await this.bookService.getAllBooks();
      this.ui.displayBookList(books);
    } catch (error) {
      this.ui.displayError(`Erro ao listar livros: ${error instanceof Error ? error.message : String(error)}`);
    }

    await this.returnToMainMenu();
  }

  private async findBookById(): Promise<void> {
    console.clear();
    console.log('BUSCAR LIVRO POR ID \n');

    try {
      const id = await this.ui.promptForId();
      const book = await this.bookService.getBookById(id);

      if (!book) {
        this.ui.displayWarning(`Livro com ID ${id} não encontrado.`);
      } else {
        this.ui.displayBookDetails(book);
      }
    } catch (error) {
      this.ui.displayError(`Erro ao buscar livro: ${error instanceof Error ? error.message : String(error)}`);
    }

    await this.returnToMainMenu();
  }

  private async createBook(): Promise<void> {
    console.clear();
    console.log('CADASTRAR NOVO LIVRO \n');

    try {
      const bookData = await this.ui.promptForBookData();
      const book = await this.bookService.createBook(bookData);
      this.ui.displaySuccess(`Livro cadastrado com sucesso! ID: ${book.id}`);
    } catch (error) {
      this.ui.displayError(`Erro ao cadastrar livro: ${error instanceof Error ? error.message : String(error)}`);
    }

    await this.returnToMainMenu();
  }

  private async updateBook(): Promise<void> {
    console.clear();
    console.log('ATUALIZAR LIVRO \n');

    try {
      const id = await this.ui.promptForId('Digite o ID do livro que deseja atualizar:');
      const existingBook = await this.bookService.getBookById(id);

      if (!existingBook) {
        this.ui.displayWarning(`Livro com ID ${id} não encontrado.`);
        await this.returnToMainMenu();
        return;
      }

      this.ui.displaySuccess(`Livro encontrado: "${existingBook.title}" de ${existingBook.author}`);
      this.ui.displayWarning('Preencha os novos dados do livro (deixe em branco para manter o valor atual):');

      const bookData = await this.ui.promptForBookData(existingBook);
      await this.bookService.updateBook(id, bookData);
      this.ui.displaySuccess(`Livro com ID ${id} atualizado com sucesso!`);
    } catch (error) {
      this.ui.displayError(`Erro ao atualizar livro: ${error instanceof Error ? error.message : String(error)}`);
    }

    await this.returnToMainMenu();
  }

  private async deleteBook(): Promise<void> {
    console.clear();
    console.log('DELETAR LIVRO \n');

    try {
      const id = await this.ui.promptForId('Digite o ID do livro que deseja deletar:');
      const book = await this.bookService.getBookById(id);

      if (!book) {
        this.ui.displayWarning(`Livro com ID ${id} não encontrado.`);
        await this.returnToMainMenu();
        return;
      }

      const confirmed = await this.ui.confirmDeletion(book.title, book.author);

      if (confirmed) {
        await this.bookService.deleteBook(id);
        this.ui.displaySuccess(`Livro com ID ${id} deletado com sucesso!`);
      } else {
        this.ui.displayWarning('Operação cancelada pelo usuário.');
      }
    } catch (error) {
      this.ui.displayError(`Erro ao deletar livro: ${error instanceof Error ? error.message : String(error)}`);
    }

    await this.returnToMainMenu();
  }

  private async returnToMainMenu(): Promise<void> {
    await this.ui.waitForEnter();
    await this.showMainMenu();
  }
}
