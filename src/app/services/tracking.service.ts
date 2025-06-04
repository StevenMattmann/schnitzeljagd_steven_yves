import {Injectable} from '@angular/core';
import {Preferences} from '@capacitor/preferences';
import { Geolocation } from '@capacitor/geolocation';


@Injectable({ providedIn: 'root' })
export class TrackingService {
  private startPosition: { lat: number, lng: number } | null = null;
  private watchId: string | null = null;
  distanceTravelled = 0;


  async startTracking(onDistanceReached: () => void) {
    const pos = await Geolocation.getCurrentPosition();
    this.startPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude };

    this.watchId = await Geolocation.watchPosition(
      { enableHighAccuracy: true },
      (pos) => {
        if (pos && this.startPosition) {
          const current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          this.distanceTravelled += this.calculateDistance(this.startPosition, current);
          this.startPosition = current;

          if (this.distanceTravelled >= 10) {
            onDistanceReached();
            this.stopTracking();
          }
        }
      }
    );
  }

  stopTracking() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }
  calculateDistance(start: { lat: number, lng: number }, end: { lat: number, lng: number }): number {
    const R = 6371e3; // Erdradius in m
    const φ1 = start.lat * Math.PI / 180;
    const φ2 = end.lat * Math.PI / 180;
    const Δφ = (end.lat - start.lat) * Math.PI / 180;
    const Δλ = (end.lng - start.lng) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Ergebnis in Meter
  }
}
