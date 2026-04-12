/**
 * Carga de datos — futuro: HttpClient + servicios Angular
 */
let cache = null;

export async function loadAppData() {
  if (cache) return cache;
  const res = await fetch("data/services.json");
  if (!res.ok) throw new Error(`No se pudo cargar datos: ${res.status}`);
  cache = await res.json();
  return cache;
}

export function getServiceById(data, id) {
  return data.services.find((s) => s.id === id) || null;
}
