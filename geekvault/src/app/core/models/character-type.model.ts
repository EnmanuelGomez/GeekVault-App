export interface CharacterType {
  id: string | number;
  name: string;
  description?: string | null;
}

export interface CharacterTypeCreateRequest {
  name: string;
  description?: string | null;
}

export interface CharacterTypeUpdateRequest {
  name: string;
  description?: string | null;
}

export interface CharacterTypeUpdateRequestWithId extends CharacterTypeUpdateRequest {
  id: string | number;
}

