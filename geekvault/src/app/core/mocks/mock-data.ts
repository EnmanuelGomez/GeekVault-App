import { CharacterDetail } from '../services/character.service';
import { Franchise } from '../models/franchise.model';
import { CharacterType } from '../models/character-type.model';

export const MOCK_CATEGORIES: CharacterType[] = [
  { id: 'cat-comics', name: 'Cómics' }
];

export const MOCK_FRANCHISES: any[] = [
  {
    id: 1,
    name: 'DC Comics',
    description: 'DC Comics es una editorial estadounidense de historietas y una de las más influyentes del mundo. Surgió en 1934 como National Allied Publications, fundada por Malcolm Wheeler-Nicholson, y luego adoptó el nombre DC derivado de Detective Comics. Ganó notoriedad con Superman (1938), Batman (1939) y Wonder Woman (1941), definiendo el género superheroico moderno. Expandió su universo con Justice League e historias con temas filosóficos, políticos y morales. Actualmente forma parte de Warner Bros. Discovery.',
    foundedOn: '1934-01-01',
    founders: 'Malcolm Wheeler-Nicholson',
    originCountry: 'Estados Unidos',
    imageUrl: 'assets/images/DC-Comics-Logo.avif',
    categoryId: 'cat-comics'
  },
  {
    id: 2,
    name: 'Marvel Comics',
    description: 'Marvel Comics es una editorial estadounidense de historietas y una de las más influyentes del mundo. Surgió en 1939 como Timely Publications, fundada por Martin Goodman, y luego adoptó el nombre Marvel. Ganó notoriedad con Spider-Man (1962), The X-Men (1963) y The Fantastic Four (1961), definiendo el género de los cómics modernos. Expandió su universo con equipos como los Vengadores y las historias con temas sociales y filosóficos. Actualmente forma parte de The Walt Disney Company.',
    foundedOn: '1939-01-01',
    founders: 'Martin Goodman',
    originCountry: 'Estados Unidos',
    imageUrl: 'assets/images/Marvel-Logo.jpg',
    categoryId: 'cat-comics'
  }
];

export const MOCK_CHARACTERS: any[] = [
  {
    id: 'char-batman',
    name: 'Batman',
    alias: 'Bruce Wayne',
    description: 'Billionaire playboy, philanthropist, and industrialist who operates as the vigilante Batman.',
    createdOn: 1939,
    createdBy: 'Bob Kane, Bill Finger',
    imageUrl: '/assets/images/characters/batman.jpg',
    franchiseId: '1',
    categories: [{ id: 'cat-comics', name: 'Cómics' }],
    firstAppearance: {
      medium: 'comic',
      title: 'Detective Comics',
      issueOrEpisode: '#27',
      publisherOrStudio: 'DC Comics',
      date: '1939-05-01',
      notes: 'First appearance of Batman'
    },
    powers: [
      { name: 'Genius-level intellect', description: 'Exceptional intellectual abilities.' },
      { name: 'Master detective', description: 'World\'s greatest detective.' },
      { name: 'Master martial artist', description: 'Expert in multiple forms of hand-to-hand combat.' },
      { name: 'Peak human physical condition', description: 'Incredible strength, speed, and stamina.' }
    ],
    stats: {
      strength: 7, speed: 7, skills: 10, weapons: 10,
      intelligence: 10, durability: 6, endurance: 8,
      experience: 10, fighting: 10, power: 3
    },
    teams: [
      { teamName: 'Justice League', description: 'Founding member' },
      { teamName: 'Bat-Family', description: 'Leader and mentor' }
    ],
    allies: [
      { name: 'Robin', notes: 'Partner' },
      { name: 'Alfred Pennyworth', notes: 'Butler and father figure' },
      { name: 'James Gordon', notes: 'Police Commissioner' }
    ],
    rivals: [
      { name: 'Joker', notes: 'Arch-nemesis' },
      { name: "Ra's al Ghul", notes: 'Adversary' }
    ],
    equipment: [
      { name: 'Batsuit', type: 'Armor', description: 'Kevlar-lined armor.' },
      { name: 'Batarangs', type: 'Weapon', description: 'Throwing weapons.' },
      { name: 'Batmobile', type: 'Vehicle', description: 'Advanced tactical vehicle.' }
    ],
    weaknesses: [
      { name: 'No superhuman powers', severity: 'high', description: 'Relies purely on intellect and training.' },
      { name: 'Psychological trauma', severity: 'mid', description: 'Driven by the death of his parents.' }
    ],
    versions: [
      { medium: 'comics', name: 'Absolute Batman', continuity: 'DC Absolute' }
    ],
    adaptations: [
      { medium: 'movie', title: 'The Dark Knight', year: 2008, studio: 'Warner Bros.', actorOrVoice: 'Christian Bale' }
    ],
    publisher: { name: 'DC Comics', country: 'Estados Unidos', foundedYear: 1934 }
  },
  {
    id: 'char-joker',
    name: 'Joker',
    alias: 'Unknown',
    description: 'A highly intelligent psychopath with a warped, sadistic sense of humor.',
    createdOn: 1940,
    createdBy: 'Bill Finger, Bob Kane, Jerry Robinson',
    imageUrl: '/assets/images/characters/joker.jpg',
    franchiseId: '1',
    categories: [{ id: 'cat-comics', name: 'Cómics' }],
    firstAppearance: {
      medium: 'comic',
      title: 'Batman',
      issueOrEpisode: '#1',
      publisherOrStudio: 'DC Comics',
      date: '1940-04-25',
      notes: 'First appearance of Joker'
    },
    powers: [
      { name: 'Genius-level intellect', description: 'Mastermind criminal strategies.' },
      { name: 'Expert chemist', description: 'Creator of Joker Venom.' },
      { name: 'High pain tolerance', description: 'Seems unfazed by severe injuries.' }
    ],
    stats: {
      strength: 4, speed: 5, skills: 8, weapons: 7,
      intelligence: 9, durability: 7, endurance: 8,
      experience: 9, fighting: 6, power: 4
    },
    teams: [
      { teamName: 'Injustice Gang', description: 'Leader' },
      { teamName: 'Injustice League', description: 'Core member' }
    ],
    allies: [
      { name: 'Harley Quinn', notes: 'Accomplice and former lover' },
      { name: 'Punchline', notes: 'New accomplice' }
    ],
    rivals: [
      { name: 'Batman', notes: 'Arch-nemesis' },
      { name: 'Lex Luthor', notes: 'Occasional rival/ally' }
    ],
    equipment: [
      { name: 'Joker Venom', type: 'Chemical', description: 'Lethal toxin causing uncontrollable laughter.' },
      { name: 'Joy Buzzer', type: 'Weapon', description: 'Lethal electrical device.' },
      { name: 'Razor-sharp playing cards', type: 'Weapon', description: 'Lethal projectiles.' }
    ],
    weaknesses: [
      { name: 'Obsession with Batman', severity: 'high', description: 'Often foils his own plans to play with Batman.' },
      { name: 'Mental instability', severity: 'high', description: 'Highly unpredictable.' }
    ],
    versions: [
      { medium: 'movie', name: 'The Dark Knight', continuity: 'Nolanverse' }
    ],
    adaptations: [
      { medium: 'movie', title: 'The Dark Knight', year: 2008, studio: 'Warner Bros.', actorOrVoice: 'Heath Ledger' },
      { medium: 'movie', title: 'Joker', year: 2019, studio: 'Warner Bros.', actorOrVoice: 'Joaquin Phoenix' }
    ],
    publisher: { name: 'DC Comics', country: 'Estados Unidos', foundedYear: 1934 }
  },

  // Personajes de Marvel Comics
  {
  id: 'char-spiderman',
  name: 'Spider-Man',
  alias: 'Peter Parker',
  description: 'Superhéroe neoyorquino que obtuvo habilidades arácnidas tras la mordida de una araña radiactiva.',
  createdOn: 1962,
  createdBy: 'Stan Lee, Steve Ditko',
  imageUrl: '/assets/images/characters/spiderman.jpg',

  franchiseId: '2', 

  categories: [
    { id: 'cat-comics', name: 'Cómics' }
  ],

  firstAppearance: {
    medium: 'comic',
    title: 'Amazing Fantasy',
    issueOrEpisode: '#15',
    publisherOrStudio: 'Marvel Comics',
    date: '1962-08-01',
    notes: 'Primera aparición de Spider-Man'
  },

  powers: [
    {
      name:'Fuerza sobrehumana',
      description:'Puede levantar varias toneladas.'
    },
    {
      name:'Sentido arácnido',
      description:'Detecta peligros antes de que ocurran.'
    },
    {
      name:'Agilidad y reflejos mejorados',
      description:'Reflejos muy superiores a los humanos.'
    },
    {
      name:'Trepar muros',
      description:'Adherencia bioeléctrica a superficies.'
    },
    {
      name:'Intelecto científico',
      description:'Genio en química e ingeniería.'
    }
  ],

  stats:{
    strength:8,
    speed:9,
    skills:9,
    weapons:7,
    intelligence:9,
    durability:8,
    endurance:9,
    experience:9,
    fighting:8,
    power:8
  },

  teams:[
    {
      teamName:'Avengers',
      description:'Miembro recurrente'
    },
    {
      teamName:'Fantastic Four',
      description:'Aliado frecuente'
    }
  ],

  allies:[
    {
      name:'Mary Jane Watson',
      notes:'Principal interés amoroso'
    },
    {
      name:'Black Cat',
      notes:'Aliada ocasional'
    },
    {
      name:'Human Torch',
      notes:'Gran amigo'
    }
  ],

  rivals:[
    {
      name:'Green Goblin',
      notes:'Archienemigo'
    },
    {
      name:'Doctor Octopus',
      notes:'Rival clásico'
    },
    {
      name:'Venom',
      notes:'Enemigo simbiótico'
    }
  ],

  equipment:[
    {
      name:'Lanzaredes',
      type:'Gadget',
      description:'Dispositivo creado por Peter Parker.'
    },
    {
      name:'Traje clásico',
      type:'Armor',
      description:'Traje original de Spider-Man.'
    },
    {
      name:'Iron Spider Suit',
      type:'Armor',
      description:'Traje avanzado creado por Tony Stark.'
    }
  ],

  weaknesses:[
    {
      name:'Responsabilidad emocional',
      severity:'mid',
      description:'Su moralidad puede jugar en su contra.'
    },
    {
      name:'Ser humano bajo la máscara',
      severity:'mid',
      description:'Puede ser herido como cualquier humano.'
    }
  ],

  versions:[
    {
      medium:'comic',
      name:'Ultimate Spider-Man',
      continuity:'Earth-1610'
    },
    {
      medium:'comic',
      name:'Spider-Man 2099',
      continuity:'Earth-928'
    },
    {
      medium:'comic',
      name:'Symbiote Spider-Man',
      continuity:'Earth-616'
    }
  ],

  adaptations:[
    {
      medium:'movie',
      title:'Spider-Man',
      year:2002,
      studio:'Sony Pictures',
      actorOrVoice:'Tobey Maguire'
    },
    {
      medium:'movie',
      title:'The Amazing Spider-Man',
      year:2012,
      studio:'Sony Pictures',
      actorOrVoice:'Andrew Garfield'
    },
    {
      medium:'movie',
      title:'Spider-Man: No Way Home',
      year:2021,
      studio:'Marvel Studios',
      actorOrVoice:'Tom Holland'
    }
  ],

  publisher:{
    name:'Marvel Comics',
    country:'Estados Unidos',
    foundedYear:1939
  }
}

];
