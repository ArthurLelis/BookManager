export interface IBookInput {
  title: string;
  author: string;
  publicationYear: string;
  publisher?: string;
  genre?: string;
  acquisitionDate?: string;
  pageCount?: string;
  description?: string;
}

export interface IBookUpdateInput extends Partial<IBookInput> {
  id?: number;
}
