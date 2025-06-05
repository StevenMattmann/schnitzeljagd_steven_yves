import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { TrackingService } from '../../services/tracking.service';
import {calculateDistance} from '../../utils/geo';

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
import {DecimalPipe, NgClass, NgIf} from '@angular/common';

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
    NgIf,
    NgClass,
    DecimalPipe
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
  private readonly allowedRadius = 30;

  constructor(
    private router: Router,
    private tracker: TrackingService
  ) {}

  ngOnInit(): void {
    this.tracker.markTaskStarted('Geolocation');
    this.beginTask();
    this.initLocationWatcher();
  }

  private async initLocationWatcher(): Promise<void> {
    try {
      const position = await Geolocation.getCurrentPosition();

      this.geoWatcherId = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (data, error) => {
          if (error) {
            console.error('Fehler bei Positionsdaten:', error);
            return;
          }

          if (data) {
            const { latitude, longitude } = data.coords;
            this.calculateDistance(latitude, longitude); // ✅ HIER
          }
        }
      );

    } catch (e) {
      console.error('Geolocation konnte nicht gestartet werden:', e);
    }
  }

  private calculateDistance(currentLat: number, currentLng: number): void {
    const currentPos = { lat: currentLat, lng: currentLng };
    const distance = calculateDistance(currentPos, this.destination);

    this.distanceToTarget = distance;

    if (distance <= this.allowedRadius && !this.locationReached) {
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

      this.tracker.markTaskCompleted('Geolocation');
    }

    this.stopGeoTracking();
    this.router.navigate(['qrcode']);
  }

  ngOnDestroy(): void {
    this.stopGeoTracking();
  }
}
