import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  templateUrl: 'leaderboard.html',
  styleUrls: ['leaderboard.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class Leaderboard {
  players = [
    { name: 'Max Mustermann', points: 1500 },
    { name: 'Lisa Musterfrau', points: 1300 },
    { name: 'John Doe', points: 1200 },
    { name: 'Jane Smith', points: 1100 }
  ];

  constructor() {}
}
