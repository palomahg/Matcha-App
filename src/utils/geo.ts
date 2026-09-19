export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

export const SPANISH_CITIES_COORDS: Record<string, { lat: number; lng: number; name: string }> = {
  Madrid: { lat: 40.4168, lng: -3.7038, name: 'Madrid' },
  Barcelona: { lat: 41.3851, lng: 2.1734, name: 'Barcelona' },
  Valencia: { lat: 39.4699, lng: -0.3763, name: 'Valencia' },
  Sevilla: { lat: 37.3891, lng: -5.9845, name: 'Sevilla' },
  Málaga: { lat: 36.7213, lng: -4.4214, name: 'Málaga' },
  Bilbao: { lat: 43.263, lng: -2.935, name: 'Bilbao' },
};
