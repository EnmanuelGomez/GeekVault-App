export interface Franchise {
  id: number;
  name: string;
  imageUrl: string | null;
  categoryId: number;
  founders?: string | null;
  foundedOn?: string | Date | null;
  originCountry?: string;
}
