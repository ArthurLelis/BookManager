export class ValidationConstants {
  static readonly MIN_PUBLICATION_YEAR = 1;
  static readonly MIN_PAGE_COUNT = 1;

  static getMaxPublicationYear(): number {
    return new Date().getFullYear();
  }
}
