/**
 * Persistencia de favoritos — futuro: servicio Angular + NgRx/API
 */
const STORAGE_KEY = "kinetic:favoriteServiceIds";
const TEAM_KEY = "kinetic:favoriteTeamIds";

function readIds(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeIds(key, ids) {
  localStorage.setItem(key, JSON.stringify([...new Set(ids)]));
}

export function getFavoriteServiceIds() {
  return readIds(STORAGE_KEY);
}

export function isFavoriteService(id) {
  return getFavoriteServiceIds().includes(id);
}

export function toggleFavoriteService(id) {
  const ids = getFavoriteServiceIds();
  const i = ids.indexOf(id);
  if (i === -1) ids.push(id);
  else ids.splice(i, 1);
  writeIds(STORAGE_KEY, ids);
  return i === -1;
}

export function getFavoriteTeamIds() {
  return readIds(TEAM_KEY);
}

export function toggleFavoriteTeam(id) {
  const ids = getFavoriteTeamIds();
  const i = ids.indexOf(id);
  if (i === -1) ids.push(id);
  else ids.splice(i, 1);
  writeIds(TEAM_KEY, ids);
  return i === -1;
}

export function isFavoriteTeam(id) {
  return getFavoriteTeamIds().includes(id);
}
