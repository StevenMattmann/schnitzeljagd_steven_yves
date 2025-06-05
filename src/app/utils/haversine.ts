export function haversineDistance(
  coords1: { latitude: number; longitude: number },
  coords2: { latitude: number; longitude: number },
): number {
  const R = 6371e3; // Erdradius in Metern
  const lat1Rad = coords1.latitude * (Math.PI / 180);
  const lat2Rad = coords2.latitude * (Math.PI / 180);
  const deltaLat = (coords2.latitude - coords1.latitude) * (Math.PI / 180);
  const deltaLon = (coords2.longitude - coords1.longitude) * (Math.PI / 180);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
