import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TrackingService } from '../../services/tracking.service';

@Component({
  selector: 'app-privacy-dialog',
  standalone: true,
  templateUrl: './privacy-dialog.component.html',
  styleUrls: ['./privacy-dialog.component.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
  ]
})
export class PrivacyDialogComponent implements OnInit {
  @Output() approve = new EventEmitter<void>();
  @Output() cancelDialog = new EventEmitter<void>();
  @Output() permissionsApproved = new EventEmitter<void>();

  cameraGranted = false;
  geoGranted = false;

  constructor(private router: Router, private trackingService: TrackingService) {}

  async ngOnInit() {
    try {
      const cameraStatus = await Camera.checkPermissions();
      this.cameraGranted = cameraStatus.camera === 'granted';

      const geoStatus = await Geolocation.checkPermissions();
      this.geoGranted = geoStatus.location === 'granted';
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  }

  async requestCameraPermission() {
    try {
      const cameraResult = await Camera.requestPermissions();
      this.cameraGranted = cameraResult.camera === 'granted';
      console.log('Camera permission status:', this.cameraGranted);
    } catch (error) {
      console.error('Error requesting camera permission:', error);
    }
  }

  async requestGeolocationPermission() {
    try {
      const result = await Geolocation.requestPermissions();
      this.geoGranted = result.location === 'granted';
      console.log('Geolocation permission status:', this.geoGranted);
    } catch (error) {
      console.error('Error requesting geolocation permission: ', error);
    }
  }

  completeTask() {
    if (this.geoGranted && this.cameraGranted) {
      this.permissionsApproved.emit();
      this.approve.emit(); // oder eigene Logik
    }
  }

  cancelTask() {
    this.cancelDialog.emit();
  }
}
