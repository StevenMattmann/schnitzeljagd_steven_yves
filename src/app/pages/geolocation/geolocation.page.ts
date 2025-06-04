import { Component } from '@angular/core';
import {IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonFooter} from "@ionic/angular/standalone";

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.page.html',
  styleUrls: ['./geolocation.page.scss'],
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonFooter,
    IonButton
  ]
})
export class GeolocationPage {

  constructor() { }

}
