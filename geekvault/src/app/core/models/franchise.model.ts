export interface Franchise {
  id: number;
  name: string;
  imageUrl: string | null;
  categoryId: number;   // clave foránea
  // Campos opcionales según tu backend:
  creator?: string;
  date?: string;        // fecha de creación de la franquicia
  originCountry?: string;
}
