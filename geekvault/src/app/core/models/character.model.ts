export interface Character {
  id: string;
  name: string;
  alias?: string | null;
  description?: string | null;
  createdOn?: number | null;
  createdBy?: string | null;
  imageUrl?: string | null;
  franchiseId: string;
  categories: { id: string | number; name: string }[]; // mapea tus ids -> nombres
  extraData?: string | null;
}
