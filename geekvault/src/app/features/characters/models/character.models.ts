// Tipos base
export type Medium = 'comic' | 'tv' | 'movie' | 'game' | 'anime' | 'novel' | 'other';

export interface FirstAppearance {
  medium: Medium;
  title: string;
  issueOrEpisode?: string;
  publisherOrStudio?: string;
  date?: string; // ISO yyyy-mm-dd
  notes?: string;
}

export interface PowerAbility {
  name: string;
  type: 'innate' | 'tech' | 'magic' | 'training';
  description?: string;
  level?: number; // 1..10
}

export interface StatBlock {
  strength: number;      // 1..7
  speed: number;         // 1..7
  intelligence: number;  // 1..7
  durability: number;    // 1..7
  energy: number;        // 1..7
  fighting: number;      // 1..7
}

export interface TeamMembership {
  teamName: string;
  role?: string;
  fromYear?: number;
  toYear?: number;
}

export interface Ally {
  name: string;
  relation?: string;
  notes?: string;
}

export interface Rival {
  name: string;
  hostility?: 'low'|'mid'|'high';
  notes?: string;
}

export interface Version {
  name: string;
  continuity?: string;
  actorOrVoice?: string;
  firstAppearanceRef?: string;
}

export interface Adaptation {
  medium: Medium;
  title: string;
  year?: number;
  studio?: string;
  actorOrVoice?: string;
}

export interface Weakness {
  name: string;
  severity?: 'low'|'mid'|'high';
  description?: string;
}

export interface Equipment {
  name: string;
  type?: string;
  origin?: string;
  description?: string;
}

export interface Ranking {
  source: string;
  category: string;
  rank: number;
  year?: number;
  link?: string;
}

export interface Merchandise {
  brand: string;
  line?: string;
  itemName: string;
  scale?: string;
  year?: number;
  sku?: string;
  notes?: string;
}

export interface Publisher {
  name: string;
  country?: string;
  foundedYear?: number;
}

// Personaje
export interface Character {
  name: string;
  universe: string;
  creator: string;
  yearCreated: number;
  summary?: string;
  // anexos
  firstAppearance?: FirstAppearance;
  powers?: PowerAbility[];
  stats?: StatBlock;
  // …y el resto (teams, allies, rivals, versions, adaptations, weaknesses, equipment, rankings, merchandise, media, publisher)
}
