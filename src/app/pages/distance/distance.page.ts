import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { TrackingService } from '../../services/tracking.service';
import { Subscription } from 'rxjs';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-distance',
  templateUrl: './distance.page.html',
  styleUrls: ['./distance.page.scss'],
  imports: [
    IonicModule
  ],
  standalone: true
})
export class DistancePage implements OnInit, OnDestroy {
  distanceTravelled = 0;
  requiredDistance = 10;
  taskCompleted = false;
  private sub!: Subscription;
  private startTime: number | null = null;

  constructor(
    private trackingService: TrackingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.startTime = Date.now(); // ⏱️ Startzeit setzen
    this.trackingService.startTracking();
    this.trackingService.markTaskStarted('Distance');

    this.sub = this.trackingService.distance$.subscribe(async (distance) => {
      this.distanceTravelled = distance;

      if (distance >= this.requiredDistance && !this.taskCompleted) {
        this.taskCompleted = true;
        await Haptics.impact({ style: ImpactStyle.Medium });
        console.log('🎉 Ziel erreicht!');
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.trackingService.stopTracking();
  }

  completeTask() {
    if (this.taskCompleted && this.startTime) {
      const duration = Date.now() - this.startTime; // ⏱️ Dauer berechnen
      this.trackingService.addTask('Distance', duration); // 📝 Speichern
      this.router.navigate(['/end']);

      this.trackingService.markTaskCompleted('Distance');
    }
  }

  skipTask() {
    this.trackingService.stopTracking();
    this.router.navigate(['/end']);
  }

  cancelTask() {
    this.trackingService.stopTracking();
    this.router.navigate(['/tabs/tasks']);
  }
}
