export type MockProfile = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
};

export type MockPost = {
  id: string;
  title: string;
  content: string;
  author: MockProfile;
  subforum: { id: string; name: string; displayName: string };
  voteScore: number;
  commentCount: number;
  createdAt: string;
};

export const mockProfile: MockProfile = {
  id: 'u1',
  username: 'branco_dev',
  displayName: 'Branquito',
  avatarUrl: '/rudopfp2.png',
  bio: 'No me funciona el backend me vuelvo loco casera',
};

export const mockPosts: MockPost[] = [
  // Gachiakuta posts
  {
    id: 'p1',
    title: 'Teoria Serie del Vigilante',
    content:
      'Se han dado cuenta que de todos los usuarios presentes se relacionan con un sentido?? Olfato, tacto, sabor? cual creen que siga',
    author: { ...mockProfile, username: 'rudowolf', displayName: 'DJ Gachi', id: 'u2', avatarUrl: '/icons/rudopfp1.png' },
    subforum: { id: 'gachi', name: 'gachiakuta', displayName: 'Gachiakuta' },
    voteScore: 78,
    commentCount: 21,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    title: 'Merch',
    content:
      'Alguna tienda que conozcan que venda merch?? llevo meses buscando y no encuentro nada :(((',
    author: { ...mockProfile, username: 'rudowolf', displayName: 'Meme Lord', id: 'u3', avatarUrl: '/icons/surprisedrudo.png' },
    subforum: { id: 'gachi', name: 'gachiakuta', displayName: 'Gachiakuta' },
    voteScore: 52,
    commentCount: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'p3',
    title: 'Donde seguir el anime?',
    content:
      'Teniendo en cuenta como va el anime por estas semanas, cual creen que sea el tomo o cap de manga que se deba seguir para estar al dia?',
    author: { ...mockProfile, username: 'rudowolf', displayName: 'Sticker Hunter', id: 'u4', avatarUrl: '/icons/rudopfp2.png' },
    subforum: { id: 'gachi', name: 'gachiakuta', displayName: 'Gachiakuta' },
    voteScore: 31,
    commentCount: 9,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },

  // JoJo posts
  {
    id: 'p4',
    title: 'Stand users: ¿Cuál es tu favorito?',
    content:
      'Hablemos de los mejores Stands y por qué son tan memorables en cada parte de JoJo. Compartan escenas y gifs.',
    author: { ...mockProfile, username: 'jojo_fan', displayName: 'JoJo Fan', id: 'u5', avatarUrl: '/icons/josukeicon.png' },
    subforum: { id: 'jojos', name: 'jojos', displayName: 'JoJo' },
    voteScore: 134,
    commentCount: 42,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'p5',
    title: 'Análisis: El poder de los Stands en la parte 4',
    content:
      'Desglosamos estadísticas y momentos clave donde los Stands cambiaron el rumbo de la historia. Spoilers de la parte 4.',
    author: { ...mockProfile, username: 'analyst', displayName: 'Stand Analyst', id: 'u6', avatarUrl: '/icons/jolynneicon.png' },
    subforum: { id: 'jojos', name: 'jojos', displayName: 'JoJo' },
    voteScore: 64,
    commentCount: 18,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'p6',
    title: 'Teorías locas sobre el arco actual',
    content:
      'Comparto mis teorías sobre cómo evolucionará el arco actual. Poned las vuestras y debate respetuoso, spoilers avisados.',
    author: { ...mockProfile, username: 'theorist', displayName: 'Theorist', id: 'u7', avatarUrl: '/icons/johnnyicon.png' },
    subforum: { id: 'jojos', name: 'jojos', displayName: 'JoJo' },
    voteScore: 41,
    commentCount: 11,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },

  // One Piece posts
  {
    id: 'p7',
    title: 'Dónde ver One Piece legalmente',
    content:
      'Lista de plataformas y diferencias entre ediciones. También recomendaciones de capítulos para empezar, y qué ver según tu ritmo.',
    author: { ...mockProfile, username: 'onepiece_crew', displayName: 'OnePiece Crew', id: 'u8', avatarUrl: '/icons/luffyicon.png' },
    subforum: { id: 'onepiece', name: 'onepiece', displayName: 'One Piece' },
    voteScore: 97,
    commentCount: 29,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: 'p8',
    title: 'Teorías sobre el tesoro final (One Piece)',
    content:
      '¿Qué opinas sobre el One Piece y su significado real? Comparto argumentos y referencias de teorías populares.',
    author: { ...mockProfile, username: 'navigator', displayName: 'Navigator', id: 'u9', avatarUrl: '/icons/namiicon.png' },
    subforum: { id: 'onepiece', name: 'onepiece', displayName: 'One Piece' },
    voteScore: 74,
    commentCount: 21,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'p9',
    title: 'Guía para nuevos lectores: por dónde empezar',
    content:
      'Si te interesa comenzar One Piece, aquí tienes un mapa con arcos recomendados, fillers opcionales y qué evitar si quieres seguir el canon.',
    author: { ...mockProfile, username: 'rookie_guide', displayName: 'Rookie Guide', id: 'u10', avatarUrl: '/icons/luffyicon2.png' },
    subforum: { id: 'onepiece', name: 'onepiece', displayName: 'One Piece' },
    voteScore: 39,
    commentCount: 10,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

export type MockSubforum = {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  iconUrl?: string;
};

export const mockSubforums: MockSubforum[] = [
  {
    id: 'gachi',
    name: 'gachiakuta',
    displayName: 'Gachiakuta',
    description: 'Charlas y memes del universo Gachiakuta.',
    iconUrl: '/gachiakutareddit.png',
  },
  {
    id: 'jojos',
    name: 'jojos',
    displayName: 'JoJo',
    description: 'Todo sobre JoJo: stands, partes y teorías.',
    iconUrl: '/jojoreddit.png',
  },
  {
    id: 'onepiece',
    name: 'onepiece',
    displayName: 'One Piece',
    description: 'Discusión sobre One Piece, capítulos y teorías.',
    iconUrl: '/onepiecereddit.png',
  },
];
