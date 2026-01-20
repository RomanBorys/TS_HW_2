export const PER_PAGE = 15;

export default class Pagination {
  private readonly perPage: number;
  private page: number;

  constructor(perPage: number = PER_PAGE) {
    this.perPage = perPage;
    this.page = 1;
  }

  get current(): number {
    return this.page;
  }

  reset(): void {
    this.page = 1;
  }

  next(): number {
    this.page += 1;
    return this.page;
  }

  isEnd(totalHits: number): boolean {
    return this.page * this.perPage >= totalHits;
  }
}
