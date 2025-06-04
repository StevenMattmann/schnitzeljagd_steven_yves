import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFooter
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { TrackingService } from '../../services/tracking.service';

@Component({
  selector: 'app-distance',
  templateUrl: './distance.page.html',
  styleUrls: ['./distance.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonFooter
  ]
})
export class DistancePage implements OnInit, OnDestroy {
  distanceTravelled = 0;
  taskCompleted = false;

  constructor(
    private router: Router,
    private trackingService: TrackingService
  ) {}

  ngOnInit() {
    this.trackingService.distanceTravelled = 0;
    this.trackingService.startTracking(async () => {
      this.taskCompleted = true;
      this.distanceTravelled = this.trackingService.distanceTravelled;

      await Haptics.impact({ style: ImpactStyle.Medium });
      console.log('🎉 Aufgabe abgeschlossen: 10 Meter erreicht');
    });
  }

  ngOnDestroy() {
    this.trackingService.stopTracking();
  }

  completeTask() {
    if (this.taskCompleted) {
      // Navigiere zur nächsten Seite, z. B. „/end“ oder zurück zur Aufgabenliste
      this.router.navigate(['/end']);
    }
  }

  skipTask() {
    this.trackingService.stopTracking();
    this.router.navigate(['/tabs/tasks']);
  }

  cancelTask() {
    this.trackingService.stopTracking();
    this.router.navigate(['/leaderboard']);
  }
}
