export class BookDTO {
  id: number;
  title: string;
  author: string;
  publicationYear: number;
  publisher: string | null;
  genre: string | null;
  acquisitionDate: string | null;
  pageCount: number | null;
  description: string | null;
  createdAt: string;
  updatedAt: string | null;

  constructor(data: {
    id: number;
    title: string;
    author: string;
    publicationYear: number;
    publisher: string | null;
    genre: string | null;
    acquisitionDate: string | null;
    pageCount: number | null;
    description: string | null;
    createdAt: string;
    updatedAt: string | null;
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
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  toEntity() {
    const { Book } = require('../entities/Book');
    return new Book({
      id: this.id,
      title: this.title,
      author: this.author,
      publicationYear: this.publicationYear,
      publisher: this.publisher,
      genre: this.genre,
      acquisitionDate: this.acquisitionDate,
      pageCount: this.pageCount,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    });
  }

  static fromDatabaseResult(data: any): BookDTO {
    return new BookDTO({
      id: data.id,
      title: data.title,
      author: data.author,
      publicationYear: data.publicationYear,
      publisher: data.publisher,
      genre: data.genre,
      acquisitionDate: data.acquisitionDate,
      pageCount: data.pageCount,
      description: data.description,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}
