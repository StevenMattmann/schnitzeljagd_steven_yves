import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { Device } from '@capacitor/device';
import { TrackingService } from '../../services/tracking.service';

@Component({
  selector: 'app-power',
  templateUrl: './power.page.html',
  styleUrls: ['./power.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    CommonModule,
    FormsModule,
    IonFooter
  ]
})
export class PowerPage implements OnInit, OnDestroy {
  isCharging: boolean | null = null;
  private batteryCheckInterval: any;
  private startTime: number | null = null;

  constructor(
    private router: Router,
    private trackingService: TrackingService
  ) {}

  ngOnInit() {
    this.startTask();
    this.startBatteryMonitoring();
  }

  ngOnDestroy() {
    this.stopBatteryMonitoring();
  }

  startTask() {
    this.startTime = Date.now();
  }

  async getBatteryInfo() {
    try {
      const result = await Device.getBatteryInfo();
      this.isCharging = result.isCharging ?? null;
    } catch (error) {
      console.error('Abrufen der Batterieinformationen fehlgeschlagen:', error);
      this.isCharging = null;
    }
  }

  startBatteryMonitoring() {
    this.getBatteryInfo(); // Direkt beim Start abrufen
    this.batteryCheckInterval = setInterval(() => {
      this.getBatteryInfo();
    }, 2000);
  }

  stopBatteryMonitoring() {
    if (this.batteryCheckInterval) {
      clearInterval(this.batteryCheckInterval);
      this.batteryCheckInterval = null;
    }
  }

  skipTask() {
    this.stopBatteryMonitoring();
    this.router.navigate(['distance']);
  }

  completeTask() {
    if (this.isCharging === true && this.startTime) {
      const taskDuration = Date.now() - this.startTime;
      this.trackingService.addTask('Power', taskDuration);

      this.stopBatteryMonitoring();
      this.router.navigate(['distance']);
    } else {
      alert('⚠️ Bitte schliesse dein Gerät an ein Ladekabel an, um fortzufahren.');
    }
  }

  cancelTask() {
    this.stopBatteryMonitoring();
    this.router.navigate(['/tabs/tasks']);
  }
}
