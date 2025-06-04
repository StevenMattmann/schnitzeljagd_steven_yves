import { Component, EventEmitter, Output } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';
import {IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle} from "@ionic/angular/standalone";

@Component({
  selector: 'app-privacy-dialog',
  templateUrl: './privacy-dialog.component.html',
  styleUrls: ['./privacy-dialog.component.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton
  ]
})
export class PrivacyDialogComponent {
  @Output() approve = new EventEmitter<void>();
  @Output() cancelDialog = new EventEmitter<void>();
  @Output() permissionsApproved = new EventEmitter<unknown>();

  async requestPermissions() {
    // try {
    //   await Geolocation.requestPermissions();
    //   await Camera.requestPermissions();
    //   this.approve.emit();
    // } catch (error) {
    //   console.error('Permission error', error);
    // }
    this.permissionsApproved.emit()
  }
}
