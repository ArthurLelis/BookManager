export class CreateBookDTO {
  title: string;
  author: string;
  publicationYear: number;
  publisher?: string | null;
  genre?: string | null;
  acquisitionDate?: string | null;
  pageCount?: number | null;
  description?: string | null;

  constructor(data: {
    title: string;
    author: string;
    publicationYear: number;
    publisher?: string | null;
    genre?: string | null;
    acquisitionDate?: string | null;
    pageCount?: number | null;
    description?: string | null;
  }) {
    this.title = data.title;
    this.author = data.author;
    this.publicationYear = data.publicationYear;
    this.publisher = data.publisher || null;
    this.genre = data.genre || null;
    this.acquisitionDate = data.acquisitionDate || null;
    this.pageCount = data.pageCount || null;
    this.description = data.description || null;
  }

  toEntity() {
    const { Book } = require('../entities/Book');
    return new Book({
      title: this.title,
      author: this.author,
      publicationYear: this.publicationYear,
      publisher: this.publisher,
      genre: this.genre,
      acquisitionDate: this.acquisitionDate,
      pageCount: this.pageCount,
      description: this.description
    });
  }
}
