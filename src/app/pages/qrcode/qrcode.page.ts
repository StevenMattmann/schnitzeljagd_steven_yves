import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BrowserQRCodeReader} from '@zxing/browser';
import {Router} from '@angular/router';
import {TrackingService} from '../../services/tracking.service';
import {IonicModule} from "@ionic/angular";
import {Haptics, ImpactStyle} from "@capacitor/haptics";

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
  imports: [
    IonicModule
  ],
  standalone: true
})
export class QRCodePage implements  OnInit {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  scannerResult = 'Noch nichts erkannt...';
  private taskCompleted = false;
  private startTime: number = Date.now();

  constructor(private router: Router, private trackingService: TrackingService) {}

  ngOnInit() {
    this.trackingService.markTaskStarted('Qr-Code'); // ❗ exakt gleich schreiben wie im TasksPage-Array
    this.startTime = Date.now();
  }
  async startScanner() {
    const codeReader = new BrowserQRCodeReader();
    try {
      const result = await codeReader.decodeOnceFromVideoDevice(undefined, this.videoElement.nativeElement);
      this.scannerResult = result.getText();

      if (this.scannerResult === 'M335@ICT-BZ' && !this.taskCompleted) {
        this.taskCompleted = true;
        await Haptics.impact({style: ImpactStyle.Medium})
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
      this.trackingService.addTask('Qr-Code', duration);

      this.trackingService.markTaskCompleted('Qr-Code'); // ✅ hinzufügen

      this.router.navigateByUrl('/tabs/tasks', { replaceUrl: true }); // damit Tasks-Status aktualisiert wird
    } else {
      alert('❌ Bitte scanne zuerst den QR-Code.');
    }
  }

  skipTask() {
    this.trackingService.markTaskStarted('Qr-Code');
    this.router.navigate(['/power']);
  }

  cancelTask() {
    this.router.navigate(['/tabs']);
  }
}
