export enum MenuOption {
  LIST_BOOKS = '1',
  FIND_BOOK = '2',
  CREATE_BOOK = '3',
  UPDATE_BOOK = '4',
  DELETE_BOOK = '5',
  EXIT = '0',
}

export const menuChoices = [
  { name: '1. Listar todos os livros', value: MenuOption.LIST_BOOKS },
  { name: '2. Buscar livro por ID', value: MenuOption.FIND_BOOK },
  { name: '3. Cadastrar novo livro', value: MenuOption.CREATE_BOOK },
  { name: '4. Atualizar livro', value: MenuOption.UPDATE_BOOK },
  { name: '5. Deletar livro', value: MenuOption.DELETE_BOOK },
  { name: '0. Sair', value: MenuOption.EXIT },
];
