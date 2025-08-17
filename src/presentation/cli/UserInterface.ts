import inquirer from 'inquirer';
import chalk from 'chalk';

import { ILogger } from '../../domain/interfaces/ILogger';
import { DateUtils } from '../../utils/DateUtils';
import { IBookInput } from '../../domain/interfaces/IBookInput';
import { Book } from '../../domain/entities/Book';
import { ValidationConstants } from '../../utils/ValidationConstants';

export class UserInterface {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  async showMenu(choices: any[]): Promise<string> {
    console.clear();
    console.log(chalk.blue.bold('SISTEMA DE GERENCIAMENTO DE LIVROS'));
    console.log('');

    const { option } = await inquirer.prompt([
      {
        type: 'list',
        name: 'option',
        message: 'Escolha uma opção:',
        choices
      }
    ]);

    return option;
  }

  async promptForId(message: string = 'Digite o ID do livro:'): Promise<number> {
    const { id } = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message,
        validate: (value: string) => {
          const valid = !isNaN(parseInt(value));
          return valid || 'Por favor, digite um número válido';
        }
      }
    ]);

    return parseInt(id);
  }

  async promptForBookData(existingBook?: Book): Promise<IBookInput> {
    const isUpdate = !!existingBook;

    const questions = [
      {
        type: 'input',
        name: 'title',
        message: isUpdate ? `Título (atual: ${existingBook.title}):` : 'Título do livro*:',
        default: isUpdate ? existingBook.title : undefined,
        validate: (value: string) => value.trim() !== '' || 'O título é obrigatório'
      },
      {
        type: 'input',
        name: 'author',
        message: isUpdate ? `Autor (atual: ${existingBook.author}):` : 'Autor do livro*:',
        default: isUpdate ? existingBook.author : undefined,
        validate: (value: string) => value.trim() !== '' || 'O autor é obrigatório'
      },
      {
        type: 'input',
        name: 'publicationYear',
        message: isUpdate
          ? `Ano de publicação (atual: ${existingBook.publicationYear}):`
          : 'Ano de publicação*:',
        default: isUpdate ? existingBook.publicationYear.toString() : undefined,
        validate: (value: string) => {
          if (!/^\d+$/.test(value)) {
            return 'Por favor, digite um número inteiro positivo';
          }

          const year = parseInt(value);
          const currentYear = ValidationConstants.getMaxPublicationYear();
          const minYear = ValidationConstants.MIN_PUBLICATION_YEAR;

          if (year < minYear) {
            return `O ano deve ser maior que ${minYear - 1}`;
          }

          if (year > currentYear) {
            return `O ano não pode ser maior que ${currentYear}`;
          }

          return true;
        },
      },
      {
        type: 'input',
        name: 'publisher',
        message: isUpdate
          ? `Editora (atual: ${existingBook.publisher || 'Não informada'}):`
          : 'Editora:',
        default: isUpdate ? existingBook.publisher || '' : undefined
      },
      {
        type: 'input',
        name: 'genre',
        message: isUpdate
          ? `Gênero (atual: ${existingBook.genre || 'Não informado'}):`
          : 'Gênero:',
        default: isUpdate ? existingBook.genre || '' : undefined
      },
      {
        type: 'input',
        name: 'acquisitionDate',
        message: isUpdate
          ? `Data de aquisição (atual: ${existingBook.acquisitionDate ? existingBook.acquisitionDate : 'Não informada'}, formato DD/MM/YYYY):`
          : 'Data de aquisição (formato DD/MM/YYYY):',
        default: isUpdate ? (existingBook.acquisitionDate ? existingBook.acquisitionDate : '') : undefined,
        validate: (value: string) => {
          if (!value) return true;

          const parsedDate = DateUtils.parseDate(value);
          if (!parsedDate) {
            return 'Por favor, digite uma data válida no formato DD/MM/YYYY';
          }

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (parsedDate > today) {
            return 'A data de aquisição não pode ser uma data futura';
          }

          return true;
        },
      },
      {
        type: 'input',
        name: 'pageCount',
        message: isUpdate
          ? `Número de páginas (atual: ${existingBook.pageCount || 'Não informado'}):`
          : 'Número de páginas:',
        default: isUpdate ? (existingBook.pageCount ? existingBook.pageCount.toString() : '') : undefined,
        validate: (value: string) => {
          if (!value) return true;

          if (!/^\d+$/.test(value)) {
            return 'Por favor, digite um número inteiro positivo';
          }

          const num = parseInt(value);
          const minPages = ValidationConstants.MIN_PAGE_COUNT;

          if (num < minPages) {
            return `O número de páginas deve ser pelo menos ${minPages}`;
          }

          return true;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: isUpdate
          ? `Descrição (atual: ${existingBook.description || 'Não informada'}):`
          : 'Descrição:',
        default: isUpdate ? existingBook.description || '' : undefined
      }
    ];

    return await inquirer.prompt(questions);
  }

  async confirmDeletion(bookTitle: string, bookAuthor: string): Promise<boolean> {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Tem certeza que deseja deletar o livro "${bookTitle}" de ${bookAuthor}?`,
        default: false
      }
    ]);

    return confirm;
  }

  async waitForEnter(): Promise<void> {
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: 'Pressione ENTER para voltar ao menu principal...'
      }
    ]);
  }

  displayBookDetails(book: Book): void {
    const lastUpdate = book.updatedAt ? new Date(book.updatedAt).toLocaleString() : 'Sem atualização';

    console.log(chalk.green(`Livro encontrado:`));
    console.log('');
    console.log(chalk.cyan(`ID: ${book.id}`));
    console.log(`Título: ${book.title}`);
    console.log(`Autor: ${book.author}`);
    console.log(`Ano de Publicação: ${book.publicationYear}`);
    console.log(`Editora: ${book.publisher || 'Não informada'}`);
    console.log(`Gênero: ${book.genre || 'Não informado'}`);
    console.log(`Data de Aquisição: ${book.acquisitionDate || 'Não informada'}`);
    console.log(`Número de Páginas: ${book.pageCount || 'Não informado'}`);
    console.log(`Descrição: ${book.description || 'Não informada'}`);
    console.log(`Data de Criação: ${new Date(book.createdAt).toLocaleString()}`);
    console.log(`Última Atualização: ${lastUpdate}`);
  }

  displayBookList(books: Book[]): void {
    if (books.length === 0) {
      console.log(chalk.yellow('Nenhum livro cadastrado.'));
      return;
    }

    console.log(chalk.green(`Total de livros: ${books.length}`));

    books.forEach(book => {
      console.log(chalk.cyan(`ID: ${book.id}`));
      console.log(`Título: ${book.title}`);
      console.log(`Autor: ${book.author}`);
      console.log(`Ano: ${book.publicationYear}`);
      console.log(`Editora: ${book.publisher || 'Não informada'}`);
      console.log(`Gênero: ${book.genre || 'Não informado'}`);
      console.log(chalk.gray('------------------------'));
    });
  }

  displaySuccess(message: string): void {
    console.log(chalk.green(message));
  }

  displayError(message: string): void {
    console.log(chalk.red(`Erro: ${message}`));
    this.logger.error(message);
  }

  displayWarning(message: string): void {
    console.log(chalk.yellow(message));
  }

  displayGoodbye(): void {
    console.log(chalk.green('Obrigado por usar o sistema!'));
  }
}
