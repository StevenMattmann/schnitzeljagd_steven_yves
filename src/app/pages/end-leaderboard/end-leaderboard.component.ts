import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TrackingService} from '../../services/tracking.service';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonFooter,
} from "@ionic/angular/standalone";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-end',
  templateUrl: './end-leaderboard.component.html',
  styleUrls: ['./end-leaderboard.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonFooter,
    IonButton,
    AsyncPipe
  ]
})
export class EndLeaderboardComponent implements OnInit {
  elapsedTime: string = '';
  totalMedaillen!: Observable<number>;
  totalKartoffeln!: Observable<number>;

  constructor(private router: Router, private trackingService: TrackingService) {}

  ngOnInit() {
    const totalMilliseconds = this.trackingService.getTotalTime();
    const minutes = Math.floor(totalMilliseconds / 60000);
    const seconds = Math.floor((totalMilliseconds % 60000) / 1000);

    this.elapsedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    this.totalMedaillen = this.trackingService.medaillen$;
    this.totalKartoffeln = this.trackingService.kartoffeln$;
  }

  goToLeaderboard() {
    this.router.navigate(['/leaderboard'], { queryParams: { fromEnd: true } });
    this.trackingService.reset();
  }
}

