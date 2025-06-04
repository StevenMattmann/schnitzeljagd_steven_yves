import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
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
import {Router} from "@angular/router";
import {Geolocation} from '@capacitor/geolocation';
import {TrackingService} from '../../services/tracking.service';
import {Haptics, ImpactStyle} from '@capacitor/haptics';

@Component({
  selector: 'app-distance',
  templateUrl: './distance.page.html',
  styleUrls: ['./distance.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFooter]
})
export class DistancePage implements OnInit, OnDestroy {
  distanceTravelled = 0;
  requiredDistance = 10; // Mindestdistanz in Metern
  private startPosition: { lat: number, lng: number } | null = null;
  private watchId: string | null = null;
  private startTime: number | null = null;
  private taskCompleted: boolean = false;

  constructor(private router: Router, private trackingService: TrackingService) {}

  ngOnInit() {
    this.startTask();
    this.startTracking();
  }

  ngOnDestroy() {
    this.stopTracking();
  }

  async startTracking() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.startPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      this.watchId = await Geolocation.watchPosition({}, async (position) => {
        if (position && this.startPosition) {
          const currentPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          this.distanceTravelled += this.calculateDistance(this.startPosition, currentPos);

          this.startPosition = currentPos;

          if (this.distanceTravelled >= this.requiredDistance && !this.taskCompleted) {
            this.taskCompleted = true; // Aufgabe als abgeschlossen markieren
            await Haptics.impact({ style: ImpactStyle.Medium });
            console.log('Haptisches Feedback ausgelöst: Erforderliche Distanz erreicht');
          }
        }
      });
    } catch (error) {
      console.error('Fehler beim Starten des Tracking:', error);
    }
  }

  stopTracking() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }

  calculateDistance(start: { lat: number, lng: number }, end: { lat: number, lng: number }): number {
    const R = 6371e3; // Erdradius in metern
    const φ1 = start.lat * (Math.PI / 180);
    const φ2 = end.lat * (Math.PI / 180);
    const Δφ = (end.lat - start.lat) * (Math.PI / 180);
    const Δλ = (end.lng - start.lng) * (Math.PI / 180);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  }

  startTask() {
    this.startTime = Date.now();
  }

  completeTask() {
    if (this.distanceTravelled >= this.requiredDistance) {
      if (this.startTime) {
        const endTime = Date.now();
        const taskDuration = endTime - this.startTime;

        this.trackingService.addTask('Distance', taskDuration);

        this.router.navigate(['/end']);
      }
    }
  }

  skipTask() {
    this.router.navigate(['/end']);
  }

  cancelTask() {
    this.router.navigate(['/leaderboard']);
  }
}
