import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-leaderboard',
  templateUrl: 'leaderboard.html',
  styleUrls: ['leaderboard.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
  standalone: true
})
export class Leaderboard {
  constructor() {}
}
