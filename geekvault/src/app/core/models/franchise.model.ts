export interface Franchise {
  id: number;
  name: string;
  imageUrl: string | null;
  categoryId: number;
  founder?: string;
  date?: string;        // fecha de creación de la franquicia
  originCountry?: string;
}
