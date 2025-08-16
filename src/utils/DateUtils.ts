export class DateUtils {
  /**
   * Converte uma string de data no formato DD/MM/YYYY para um objeto Date
   * @param dateString String de data no formato DD/MM/YYYY
   * @returns Objeto Date ou null se a data for inválida
   */
  static parseDate(dateString: string): Date | null {
    if (!dateString) return null;

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return null;
    }

    const dateParts = dateString.split('/');
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);

    const date = new Date(year, month, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }

  /**
   * Formata um objeto Date para uma string no formato DD/MM/YYYY
   * @param date Objeto Date
   * @returns String formatada ou string vazia se date for null/undefined
   */
  static formatDate(date: Date | null | undefined): string {
    if (!date) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  /**
   * Converte uma string de data no formato DD/MM/YYYY para o formato ISO (YYYY-MM-DD)
   * @param dateString String de data no formato DD/MM/YYYY
   * @returns String no formato ISO ou null se a data for inválida
   */
  static toISOString(dateString: string): string | null {
    const date = this.parseDate(dateString);
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Converte uma string de data no formato ISO (YYYY-MM-DD) para o formato DD/MM/YYYY
   * @param isoString String de data no formato ISO
   * @returns String no formato DD/MM/YYYY ou string vazia se a data for inválida
   */
  static fromISOString(isoString: string | null | undefined): string {
    if (!isoString) return '';

    try {
      const date = new Date(isoString);
      return this.formatDate(date);
    } catch (e) {
      return '';
    }
  }

  /**
   * Verifica se uma data é válida e não é futura
   * @param dateString String de data no formato DD/MM/YYYY
   * @returns true se a data for válida e não for futura, false caso contrário
   */
  static isValidPastOrPresentDate(dateString: string): boolean {
    if (!dateString) return true;

    const date = this.parseDate(dateString);
    if (!date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date <= today;
  }
}
