import { Component, ViewChild, ElementRef } from '@angular/core';
import { BrowserQRCodeReader } from '@zxing/browser';
import { Router } from '@angular/router';
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
export class QRCodePage {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  scannerResult = 'Noch nichts erkannt...';
  private taskCompleted = false;
  private startTime: number = Date.now();

  constructor(private router: Router, private trackingService: TrackingService) {}

  async startScanner() {
    const codeReader = new BrowserQRCodeReader();
    try {
      const result = await codeReader.decodeOnceFromVideoDevice(undefined, this.videoElement.nativeElement);
      this.scannerResult = result.getText();

      if (this.scannerResult === 'M335@ICT-BZ' && !this.taskCompleted) {
        this.taskCompleted = true;
        alert('✔️ Richtiger QR-Code!');
      }
    } catch (err) {
      console.error('Scan-Fehler:', err);
      this.scannerResult = 'Fehler beim Scannen';
    }
  }

  completeTask() {
    if (this.taskCompleted) {
      const duration = Date.now() - this.startTime;
      this.trackingService.addTask('QRCode', duration);
      this.router.navigate(['/power']);
    }
  }

  skipTask() {
    this.router.navigate(['/power']);
  }

  cancelTask() {
    this.router.navigate(['/tabs']);
  }
}
