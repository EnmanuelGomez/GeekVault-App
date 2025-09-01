export interface Character {
  id: string;
  name: string;
  alias?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  franchiseId: string;
  extraData?: string | null;
}
