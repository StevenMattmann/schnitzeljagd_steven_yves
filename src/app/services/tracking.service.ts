import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { BehaviorSubject } from 'rxjs';
import { calculateDistance } from '../utils/geo';

interface TaskEntry {
  name: string;
  duration: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private watchId: string | null = null;
  private readonly kartoffelThreshold = 20000;

  private lastPosition: { lat: number; lng: number } | null = null;

  private readonly medaillenCount$ = new BehaviorSubject<number>(0);
  public readonly medaillen$ = this.medaillenCount$.asObservable();

  private readonly kartoffelnCount$ = new BehaviorSubject<number>(0);
  public readonly kartoffeln$ = this.kartoffelnCount$.asObservable();

  private completedTaskNames = new Set<string>();
  private startedTaskNames = new Set<string>();

  private startTime: number | null = null;

  private readonly _distance$ = new BehaviorSubject<number>(0);
  public readonly distance$ = this._distance$.asObservable();

  private taskLog: TaskEntry[] = [];

  constructor() {}

  async startTracking(): Promise<void> {
    try {
      await Geolocation.requestPermissions();

      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      if (!position?.coords) return;

      this.lastPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      this._distance$.next(0);

      this.watchId = await Geolocation.watchPosition(
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
        (position) => {
          if (!position?.coords || !this.lastPosition) return;

          const currentPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          const delta = calculateDistance(this.lastPosition, currentPos);
          const total = this._distance$.value + delta;

          this._distance$.next(total);
          this.lastPosition = currentPos;
        }
      );
    } catch (err) {
      console.error('📍 Tracking-Fehler:', err);
    }
  }

  public resetTracking(): void {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
    }
    this.watchId = null;
    this.lastPosition = null;
    this._distance$.next(0);
  }

  addTask(taskName: string, duration: number): void {
    const timestamp = new Date().toISOString();
    this.taskLog.push({ name: taskName, duration, timestamp });

    this.medaillenCount$.next(this.medaillenCount$.value + 1);

    if (duration > this.kartoffelThreshold) {
      this.kartoffelnCount$.next(this.kartoffelnCount$.value + 1);
    }

    this.markTaskCompleted(taskName);
  }

  isTaskCompleted(taskName: string): boolean {
    return this.completedTaskNames.has(taskName);
  }

  markTaskCompleted(taskName: string): void {
    this.completedTaskNames.add(taskName);
  }

  markTaskStarted(taskName: string): void {
    this.startedTaskNames.add(taskName);
  }

  isTaskStarted(taskName: string): boolean {
    return this.startedTaskNames.has(taskName);
  }

  startOverallTimer(): void {
    if (!this.startTime) {
      this.startTime = Date.now();
    }
  }

  getTotalTime(): number {
    return this.startTime ? Date.now() - this.startTime : 0;
  }

  reset(): void {
    this.resetTracking();
    this.medaillenCount$.next(0);
    this.kartoffelnCount$.next(0);
    this.completedTaskNames.clear();
    this.startedTaskNames.clear();
    this.taskLog = [];
    this.startTime = null;
  }
}
