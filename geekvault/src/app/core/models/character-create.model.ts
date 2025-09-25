export interface CreateCharacterRequest {
  name: string;
  alias?: string | null;
  description?: string | null;      // <- summary del form
  createdOn?: number | null;        // <- yearCreated
  createdBy?: string | null;        // <- creator
  franchiseId: string;              // GUID como string
  imageUrl?: string | null;         // usamos la URL (si subes archivo, ver nota)
  extraData?: any | null;           // objeto (NO string)
  characterTypeIds?: string[];      // IDs GUID de categorías
}
