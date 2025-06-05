import { Component, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFooter,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { TrackingService } from '../../services/tracking.service';
import { haversineDistance } from '../../utils/haversine';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-distance',
  templateUrl: './distance.page.html',
  styleUrls: ['./distance.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonFooter,
  ],
})
export class DistancePage implements OnInit, OnDestroy {
  requiredDistance = 10;
  readonly distance = signal(0);
  taskCompleted = false;

  private startCoords: { latitude: number; longitude: number } | null = null;
  private watchId: string | null = null;
  private startTime: number | null = null;

  constructor(
    private router: Router,
    private trackingService: TrackingService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.startTask();
    this.startTracking();
  }

  ngOnDestroy() {
    this.stopTracking();
  }

  startTask() {
    this.startTime = Date.now();
  }

  async startTracking() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.startCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      this.watchId = await Geolocation.watchPosition(
        { enableHighAccuracy: true, timeout: 1000, maximumAge: 0 },
        async (position, error) => {
          if (error || !position || !this.startCoords) return;

          const newCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          const delta = haversineDistance(this.startCoords, newCoords);
          const updated = this.distance() + delta;

          // ⬇️ UI-Update in Angular-Zone
          this.zone.run(() => {
            this.distance.set(updated);
          });

          this.startCoords = newCoords;

          if (updated >= this.requiredDistance && !this.taskCompleted) {
            this.taskCompleted = true;
            await Haptics.impact({ style: ImpactStyle.Medium });
            this.stopTracking();
          }
        }
      );
    } catch (error) {
      console.error('Fehler beim Starten des GPS-Trackings:', error);
    }
  }

  stopTracking() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }

  completeTask() {
    if (this.taskCompleted && this.startTime) {
      const endTime = Date.now();
      const taskDuration = endTime - this.startTime;

      this.trackingService.addTask('Distance', taskDuration);
      this.router.navigate(['/end-Leaderboard']);
    }
  }

  skipTask() {
    this.trackingService.resetTracking();
    this.router.navigate(['/end-Leaderboard']);
  }

  cancelTask() {
    this.trackingService.resetTracking();
    this.router.navigate(['/tabs/tasks']);
  }
}
