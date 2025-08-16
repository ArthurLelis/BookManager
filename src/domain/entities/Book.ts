export class Book {
  private _id: number | null;
  private _title: string;
  private _author: string;
  private _publicationYear: number;
  private _publisher: string | null;
  private _genre: string | null;
  private _acquisitionDate: string | null;
  private _pageCount: number | null;
  private _description: string | null;
  private _createdAt: string;
  private _updatedAt: string | null;

  constructor({
    id = null,
    title,
    author,
    publicationYear,
    publisher = null,
    genre = null,
    acquisitionDate = null,
    pageCount = null,
    description = null,
    createdAt,
    updatedAt = null
  }: {
    id?: number | null;
    title: string;
    author: string;
    publicationYear: number;
    publisher?: string | null;
    genre?: string | null;
    acquisitionDate?: string | null;
    pageCount?: number | null;
    description?: string | null;
    createdAt?: string;
    updatedAt?: string | null;
  }) {
    this._id = id;
    this._title = title;
    this._author = author;
    this._publicationYear = publicationYear;
    this._publisher = publisher;
    this._genre = genre;
    this._acquisitionDate = acquisitionDate;
    this._pageCount = pageCount;
    this._description = description;
    this._createdAt = createdAt || new Date().toISOString();
    this._updatedAt = updatedAt;
  }

  get id(): number | null {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get author(): string {
    return this._author;
  }

  get publicationYear(): number {
    return this._publicationYear;
  }

  get publisher(): string | null {
    return this._publisher;
  }

  get genre(): string | null {
    return this._genre;
  }

  get acquisitionDate(): string | null {
    return this._acquisitionDate;
  }

  get pageCount(): number | null {
    return this._pageCount;
  }

  get description(): string | null {
    return this._description;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get updatedAt(): string | null {
    return this._updatedAt;
  }

  set id(value: number | null) {
    this._id = value;
  }

  set title(value: string) {
    this._title = value;
  }

  set author(value: string) {
    this._author = value;
  }

  set publicationYear(value: number) {
    this._publicationYear = value;
  }

  set publisher(value: string | null) {
    this._publisher = value;
  }

  set genre(value: string | null) {
    this._genre = value;
  }

  set acquisitionDate(value: string | null) {
    this._acquisitionDate = value;
  }

  set pageCount(value: number | null) {
    this._pageCount = value;
  }

  set description(value: string | null) {
    this._description = value;
  }

  set updatedAt(value: string | null) {
    this._updatedAt = value;
  }

  updateTimestamp(): void {
    this._updatedAt = new Date().toISOString();
  }

  toJSON(): Record<string, any> {
    return {
      id: this._id,
      title: this._title,
      author: this._author,
      publicationYear: this._publicationYear,
      publisher: this._publisher,
      genre: this._genre,
      acquisitionDate: this._acquisitionDate,
      pageCount: this._pageCount,
      description: this._description,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
