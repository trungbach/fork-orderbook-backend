export class IPagination {
    offset?: number;
    limit?: number;
    sort?: { field: string; order: 'ASC' | 'DESC' };
  }
