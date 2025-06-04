import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { TrackingService } from '../../services/tracking.service';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonFooter
} from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-geo-task',
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonFooter,
    NgIf
  ],
  templateUrl: './geolocation.page.html',
  styleUrls: ['./geolocation.page.scss']
})
export class GeolocationPage implements OnInit, OnDestroy {
  private geoWatcherId: string | null = null;
  private taskStartedAt: number | null = null;

  public locationReached: boolean = false;
  public distanceToTarget: number | null = null;
  public alreadyDone: boolean = false;

  private readonly destination = { lat: 47.027596, lng: 8.300954 };
  private readonly allowedRadius = 5000;

  constructor(
    private router: Router,
    private tracker: TrackingService
  ) {}

  ngOnInit(): void {
    this.beginTask();
    this.initLocationWatcher();
  }

  private async initLocationWatcher(): Promise<void> {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.calculateDistance(position.coords.latitude, position.coords.longitude);

      this.geoWatcherId = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (data, error) => {
          if (error) {
            console.error('Fehler bei Positionsdaten:', error);
            return;
          }

          if (data) {
            const { latitude, longitude } = data.coords;
            this.calculateDistance(latitude, longitude);
          }
        }
      );
    } catch (e) {
      console.error('Geolocation konnte nicht gestartet werden:', e);
    }
  }

  private calculateDistance(lat: number, lng: number): void {
    const R = 6371e3; // Erdradius in Metern
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const φ1 = toRad(this.destination.lat);
    const φ2 = toRad(lat);
    const Δφ = toRad(lat - this.destination.lat);
    const Δλ = toRad(lng - this.destination.lng);

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const dist = R * c;
    this.distanceToTarget = Math.round(dist);

    if (dist <= this.allowedRadius && !this.alreadyDone) {
      this.locationReached = true;
      this.completeAutomatically();
    }
  }

  private async completeAutomatically(): Promise<void> {
    this.alreadyDone = true;
    await Haptics.impact({ style: ImpactStyle.Medium });
    console.log('Ziel erreicht – haptisches Feedback ausgeführt');
  }

  private beginTask(): void {
    this.taskStartedAt = Date.now();
  }

  private stopGeoTracking(): void {
    if (this.geoWatcherId) {
      Geolocation.clearWatch({ id: this.geoWatcherId });
      this.geoWatcherId = null;
    }
  }

  onCancel(): void {
    this.stopGeoTracking();
    this.router.navigate(['/tabs/tasks']);
  }

  onSkip(): void {
    this.stopGeoTracking();
    this.router.navigate(['qrcode']);
  }

  onFinish(): void {
    if (this.taskStartedAt) {
      const duration = Date.now() - this.taskStartedAt;
      this.tracker.addTask('Geolocation', duration);
    }

    this.stopGeoTracking();
    this.router.navigate(['qrcode']);
  }

  ngOnDestroy(): void {
    this.stopGeoTracking();
  }
}
