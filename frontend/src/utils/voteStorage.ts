export type Vote = 'up' | 'down' | null;

const STORAGE_KEY = 'slandit:votes';

// Storage shape: { [postId]: { [username]: 'up'|'down' } }
type StorageShape = Record<string, Record<string, 'up' | 'down'>>;

function readAll(): StorageShape {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StorageShape;
  } catch (e) {
    return {};
  }
}

function writeAll(map: StorageShape) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    // ignore
  }
}

export function getVote(postId: string, username: string): Vote {
  const map = readAll();
  const postMap = map[postId] || {};
  const v = postMap[username];
  if (v === 'up' || v === 'down') return v;
  return null;
}

export function setVote(postId: string, username: string, vote: Vote) {
  const map = readAll();
  const postMap = map[postId] || {};
  if (!vote) {
    delete postMap[username];
  } else {
    postMap[username] = vote;
  }
  // if postMap empty, delete the post key
  if (Object.keys(postMap).length === 0) {
    delete map[postId];
  } else {
    map[postId] = postMap;
  }
  writeAll(map);
}

export function getVoters(postId: string): Record<string, 'up' | 'down'> {
  const map = readAll();
  return map[postId] || {};
}

export function getScoreAdjustmentFor(vote: Vote) {
  if (vote === 'up') return 1;
  if (vote === 'down') return -1;
  return 0;
}
