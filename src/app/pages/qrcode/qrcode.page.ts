import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { TrackingService } from '../../services/tracking.service';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
  imports: [
    IonicModule
  ],
  standalone: true
})
export class QRCodePage implements OnInit {
  scannerResult: string = 'No Data...';
  private startTime: number | null = null;
  private taskCompleted: boolean = false;

  constructor(
    private router: Router,
    private trackingService: TrackingService
  ) {}

  ngOnInit() {
    this.startTask();
  }

  startTask() {
    this.startTime = Date.now();
  }

  async scanBarcode() {
    try {
      await BarcodeScanner.checkPermission({ force: true });
      await BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan();

      this.scannerResult = result?.hasContent ? result.content ?? 'No Data...' : 'Kein Inhalt';
      if (this.scannerResult === 'M335@ICT-BZ' && !this.taskCompleted) {
        this.taskCompleted = true;
        await Haptics.impact({ style: ImpactStyle.Medium });
        console.log('✔️ Richtiger QR-Code gescannt');
      }
    } catch (error) {
      console.error('QR-Code Scan fehlgeschlagen:', error);
      this.scannerResult = 'Fehler beim Scan';
    } finally {
      await BarcodeScanner.showBackground();
      await BarcodeScanner.stopScan();
    }
  }

  skipTask() {
    this.router.navigate(['/power']);
  }

  completeTask() {
    if (this.taskCompleted && this.startTime) {
      const taskDuration = Date.now() - this.startTime;
      this.trackingService.addTask('QRCode', taskDuration);
      this.router.navigate(['/power']);
    }
  }

  cancelTask() {
    this.router.navigate(['/leaderboard']);
    this.scannerResult = '';
  }
}
