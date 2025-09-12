export interface FranchiseCreateRequest {
  name: string;
  description?: string;
  originCountry?: string;
  foundedOn?: string;   // ISO yyyy-MM-dd (desde <input type="date">)
  founders?: string;
  imageUrl?: string;
  categoryId: string;   // <- la categoría seleccionada
}
