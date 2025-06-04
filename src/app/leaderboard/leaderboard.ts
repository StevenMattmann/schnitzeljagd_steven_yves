import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Player {
  name: string;
  date: string;
  schnitzel: number;
  potatoes: number;
  dauer: number;
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: 'leaderboard.html',
  styleUrls: ['leaderboard.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class Leaderboard implements OnInit {
  players: { name: string; date: string; schnitzel: number; potatoes: number; duration: string }[] = [];

  async ngOnInit() {
    try {
      const res = await fetch('https://opensheet.elk.sh/1XbcuP7BAY4FUUbcoiTps-NcgHju2O4cqUFYgkGlVqq8/Formularantworten%201');
      const data = await res.json();

      console.log('Google Sheet Daten:', data);

      this.players = data
        .map((row: any): Player => ({
          name: row.Name || 'Unbekannt',
          date: row.Zeitstempel || 'n/a',
          schnitzel: parseInt(row.Schnitzel || '0', 10),
          potatoes: parseInt(row.Kartoffeln || '0', 10),
          dauer: parseInt(row.Dauer || "Unbekannt")
        }))
        .filter((player: Player) => player.name !== 'Unbekannt')
        .sort((a: Player, b: Player) => b.schnitzel - a.schnitzel);
    } catch (err) {
      console.error('❌ Fehler beim Laden der Leaderboard-Daten:', err);
    }
  }
}

