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
  avatarUrl: '/icons/surprisedrudo.png',
  bio: 'No me funciona el backend me vuelvo loco casera',
};

// Simulamos una colección de perfiles (como si vinieran de la base de datos)
export const mockProfiles: MockProfile[] = [
  mockProfile,
  { id: 'u2', username: 'rudowolf', displayName: 'DJ Gachi', avatarUrl: '/icons/rudopfp1.png', bio: 'Música, stickers y memes.' },
  { id: 'u3', username: 'meme_lord', displayName: 'Meme Lord', avatarUrl: '/icons/surprisedrudo.png', bio: 'Coleccionista de merch.' },
  { id: 'u4', username: 'sticker_hunter', displayName: 'Sticker Hunter', avatarUrl: '/icons/rudopfp2.png', bio: 'Buscando stickers raros.' },
  { id: 'u5', username: 'jojo_fan', displayName: 'JoJo Fan', avatarUrl: '/icons/josukeicon.png', bio: 'Amante de los stands y teorías.' },
  { id: 'u6', username: 'analyst', displayName: 'Stand Analyst', avatarUrl: '/icons/jolynneicon.png', bio: 'Análisis en profundidad.' },
  { id: 'u7', username: 'theorist', displayName: 'Theorist', avatarUrl: '/icons/johnnyicon.png', bio: 'Teorías locas y debates.' },
  { id: 'u8', username: 'onepiece_crew', displayName: 'OnePiece Crew', avatarUrl: '/icons/luffyicon.png', bio: 'Noticias y guías de One Piece.' },
  { id: 'u9', username: 'navigator', displayName: 'Navigator', avatarUrl: '/icons/namiicon.png', bio: 'Explorador de temas.' },
  { id: 'u10', username: 'rookie_guide', displayName: 'Rookie Guide', avatarUrl: '/icons/luffyicon2.png', bio: 'Guías para nuevos lectores.' },
];

export const mockPosts: MockPost[] = [
  // Gachiakuta posts
  {
    id: 'p1',
    title: 'Teoria Serie del Vigilante',
    content:
      'Se han dado cuenta que de todos los usuarios presentes se relacionan con un sentido?? Olfato, tacto, sabor? cual creen que siga',
    author: mockProfiles.find((u) => u.username === 'rudowolf') || mockProfile,
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
    author: mockProfiles.find((u) => u.username === 'branco_dev') || mockProfile,
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
    author: mockProfiles.find((u) => u.username === 'sticker_hunter') || mockProfile,
    subforum: { id: 'gachi', name: 'gachiakuta', displayName: 'Gachiakuta' },
    voteScore: 31,
    commentCount: 9,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },

  // Nueva publicación de Branquito en Gachiakuta
  {
    id: 'p10',
    title: 'Conchetumanga repone luego',
    content:
      ' 4 tomos ma y full felicida',
    author: { ...mockProfile },
    subforum: { id: 'gachi', name: 'gachiakuta', displayName: 'Gachiakuta' },
    voteScore: 18,
    commentCount: 4,
    createdAt: new Date().toISOString(),
  },

  // JoJo posts
  {
    id: 'p4',
    title: 'Stand users: ¿Cuál es tu favorito?',
    content:
      'Hablemos de los mejores Stands y por qué son tan memorables en cada parte de JoJo. Compartan escenas y gifs.',
    author: mockProfiles.find((u) => u.username === 'jojo_fan') || mockProfile,
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
    author: mockProfiles.find((u) => u.username === 'analyst') || mockProfile,
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
    author: mockProfiles.find((u) => u.username === 'theorist') || mockProfile,
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
    author: mockProfiles.find((u) => u.username === 'onepiece_crew') || mockProfile,
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
    author: mockProfiles.find((u) => u.username === 'navigator') || mockProfile,
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
    author: mockProfiles.find((u) => u.username === 'rookie_guide') || mockProfile,
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

// Helpers para trabajar con los mocks en tiempo de ejecución
const STORAGE_KEY = 'slandit:mockPosts';

function saveMockPosts() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockPosts));
  } catch (e) {
    // ignore
  }
}

function loadMockPostsFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as MockPost[];
    if (!Array.isArray(parsed)) return;
    // replace contents of mockPosts while keeping the reference
    mockPosts.splice(0, mockPosts.length, ...parsed);
  } catch (e) {
    // ignore parse errors
  }
}

export function addMockPost(post: MockPost) {
  mockPosts.unshift(post);
  saveMockPosts();
  try {
    window.dispatchEvent(new CustomEvent('mockPostsChanged'));
  } catch (e) {
    // ignore
  }
}

export function makeId(prefix = 'p') {
  return `${prefix}${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
}

export function removeMockPost(postId: string) {
  const idx = mockPosts.findIndex((p) => p.id === postId);
  if (idx >= 0) {
    mockPosts.splice(idx, 1);
    saveMockPosts();
    try {
      window.dispatchEvent(new CustomEvent('mockPostsChanged'));
    } catch (e) {
      // ignore
    }
    return true;
  }
  return false;
}

// Cargar almacenado en localStorage al inicio (si existe)
loadMockPostsFromStorage();
