export interface Character {
  id: string;
  name: string;
  alias?: string | null;
  description?: string | null;
  createdOn?: number | null;
  createdBy?: string | null;
  imageUrl?: string | null;
  franchiseId: string;
  categories?: { id: string | number; name: string }[];// mapea tus ids -> nombres
  extraData?: string | null;
    // anexos
  firstAppearance?: FirstAppearance;
  powers?: PowerAbility[];
  stats?: StatBlock;
  // …y el resto (teams, allies, rivals, versions, adaptations, weaknesses, equipment, rankings, merchandise, media, publisher)
}

// Tipos base
export type Medium = 'comic' | 'tv' | 'movie' | 'game' | 'anime' | 'novel' | 'other';

export interface FirstAppearance {
  imageUrl?: string | null;
  title: string;
  medium: Medium;
  issueOrEpisode?: string;
  publisherOrStudio?: string;
  date?: string; // ISO yyyy-mm-dd
  notes?: string;
}

export interface StoryLines{
  name: string;
  yearStart?: number;        // Año de inicio de la saga
  yearEnd?: number | null;          // Año de finalización (por si abarca varios años)
  issuesInvolved?: string[] | null;
  description?: string;
  imageUrl?: string | null;
}

export interface PowerAbility {
  name: string;
  description?: string;
}

export interface StatBlock {
  strength: number;      // 1...10
  speed: number;
  skills: number;
  weapons: number;
  intelligence: number;
  durability: number;
  endurance: number;
  experience: number;
  fighting: number;
  power: number;
}

export interface TeamMembership {
  teamName: string;
  description: string;
  date?: string; // fecha de ingreso al equipo
}

export interface Ally {
  imageUrl?: string | null;
  name: string;
  notes?: string;
}

export interface Rival {
  imageUrl?: string | null;
  name: string;
  notes?: string;
}

export interface Version {
  imageUrl?: string | null;
  medium: Medium;
  name: string;
  continuity?: string;
  firstAppearanceRef?: string;
}

export interface Adaptation {
  imageUrl?: string | null;
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
  imageUrl?: string | null;
  name: string;
  type?: string;
  origin?: string;
  description?: string;
}
/*  SERAN FEATURES FUTUROS
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
*/
export interface Publisher {
  name: string;
  country?: string;
  foundedYear?: number;
}


