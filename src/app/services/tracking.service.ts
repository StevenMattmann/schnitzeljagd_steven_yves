import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private watchId: string | null = null;
  private lastPosition: { lat: number; lng: number } | null = null;
  private schnitzelCount$ = new BehaviorSubject<number>(0);
  private kartoffelCount$ = new BehaviorSubject<number>(0);

  private _distance$ = new BehaviorSubject<number>(0);
  public distance$ = this._distance$.asObservable();

  private tasks: { name: string; duration: number; timestamp: string }[] = [];

  constructor() {}

  async startTracking() {
    try {
      await Geolocation.requestPermissions();

      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      if (!position?.coords) return;

      this.lastPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      this._distance$.next(0); // Reset

      this.watchId = await Geolocation.watchPosition(
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
        (position) => {
          if (!position?.coords || !this.lastPosition) return;

          const currentPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          const delta = this.calculateDistance(this.lastPosition, currentPos);
          const total = this._distance$.value + delta;

          this._distance$.next(total); // Live-Wert aktualisieren
          this.lastPosition = currentPos;
        }
      );
    } catch (err) {
      console.error('Tracking-Fehler:', err);
    }
  }

  stopTracking() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
      this.lastPosition = null;
      this._distance$.next(0);
    }
  }

  addTask(taskName: string, duration: number) {
    const entry = {
      name: taskName,
      duration,
      timestamp: new Date().toISOString()
    };
    this.tasks.push(entry);
    console.log('📝 Aufgabe gespeichert:', entry);

    const schnitzel = 1;
    this.schnitzelCount$.next(this.schnitzelCount$.value + schnitzel);

    if (duration > 20000) {
      this.kartoffelCount$.next(this.kartoffelCount$.value + 1);
    }

    console.log(
      `🏁 Punkte: +${schnitzel} 🥇, +${duration > 20000 ? 1 : 0} 🥔 (Zeit: ${duration} ms)`
    );
  }

  getCompletedTasks() {
    return this.tasks;
  }

  getTotalTaskCount(): number {
    return this.tasks.length;
  }

  private calculateDistance(start: { lat: number; lng: number }, end: { lat: number; lng: number }): number {
    const R = 6371e3;
    const φ1 = start.lat * Math.PI / 180;
    const φ2 = end.lat * Math.PI / 180;
    const Δφ = (end.lat - start.lat) * Math.PI / 180;
    const Δλ = (end.lng - start.lng) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Meter
  }

  get schnitzel$() {
    return this.schnitzelCount$.asObservable();
  }

  get kartoffeln$() {
    return this.kartoffelCount$.asObservable();
  }
}
