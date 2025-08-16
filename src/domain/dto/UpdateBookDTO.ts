export class UpdateBookDTO {
  id: number;
  title?: string;
  author?: string;
  publicationYear?: number;
  publisher?: string | null;
  genre?: string | null;
  acquisitionDate?: string | null;
  pageCount?: number | null;
  description?: string | null;

  constructor(data: {
    id: number;
    title?: string;
    author?: string;
    publicationYear?: number;
    publisher?: string | null;
    genre?: string | null;
    acquisitionDate?: string | null;
    pageCount?: number | null;
    description?: string | null;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.author = data.author;
    this.publicationYear = data.publicationYear;
    this.publisher = data.publisher;
    this.genre = data.genre;
    this.acquisitionDate = data.acquisitionDate;
    this.pageCount = data.pageCount;
    this.description = data.description;
  }

  applyToEntity(book: any) {
    if (this.title !== undefined) book.title = this.title;
    if (this.author !== undefined) book.author = this.author;
    if (this.publicationYear !== undefined) book.publicationYear = this.publicationYear;
    if (this.publisher !== undefined) book.publisher = this.publisher;
    if (this.genre !== undefined) book.genre = this.genre;
    if (this.acquisitionDate !== undefined) book.acquisitionDate = this.acquisitionDate;
    if (this.pageCount !== undefined) book.pageCount = this.pageCount;
    if (this.description !== undefined) book.description = this.description;

    book.updateTimestamp();
    return book;
  }
}
