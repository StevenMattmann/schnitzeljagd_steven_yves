import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  templateUrl: 'leaderboard.html',
  styleUrls: ['leaderboard.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class Leaderboard {
  players = [
    { name: 'Max Mustermann', date: '2025-06-01', schnitzel: 12, potatoes: 4 },
    { name: 'Lisa Musterfrau', date: '2025-06-02', schnitzel: 9, potatoes: 5 },
    { name: 'John Doe', date: '2025-06-03', schnitzel: 8, potatoes: 3 },
    { name: 'Jane Smith', date: '2025-06-04', schnitzel: 7, potatoes: 2 }
  ];

  constructor() {}
}
