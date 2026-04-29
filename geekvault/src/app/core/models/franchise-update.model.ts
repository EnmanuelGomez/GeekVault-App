export interface FranchiseUpdateRequest {
  name: string;
  description?: string;
  originCountry?: string;
  foundedOn?: string;   // "yyyy-MM-dd"
  founders?: string;
  imageUrl?: string;
  categoryId: string;
}
