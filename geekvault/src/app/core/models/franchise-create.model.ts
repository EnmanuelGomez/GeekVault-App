export interface FranchiseCreateRequest {
  name: string;
  description?: string;
  originCountry?: string;
  foundedOn?: string;
  founders?: string;
  imageUrl?: string;
  categoryId: string;
}
