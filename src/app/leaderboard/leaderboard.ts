import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {RouterModule, ActivatedRoute, Router} from '@angular/router';
import {addIcons} from "ionicons";
import {arrowBack} from "ionicons/icons";

interface Player {
  name: string;
  date: string;
  medaillen: number;
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
export class LeaderboardComponent implements OnInit {
  players: Player[] = [];
  cameFromEnd = false;

  constructor(private route: ActivatedRoute, private router: Router) {
    //Pfeil Icon hinzugefügt
    addIcons({ arrowBack });
  }

  async ngOnInit() {
    // Prüfen, ob der View von einer "Endseite" kommt
    this.route.queryParams.subscribe(params => {
      this.cameFromEnd = params['fromEnd'] === 'true';
    });

    try {
      // Daten aus Google Sheet via OpenSheet API laden
      const res = await fetch('https://opensheet.elk.sh/1XbcuP7BAY4FUUbcoiTps-NcgHju2O4cqUFYgkGlVqq8/Formularantworten%201');
      const data = await res.json();

      //Daten werden hier aufbereited
      this.players = data
        .map((row: any): Player => ({
          name: row.Name || 'Unbekannt',
          date: row.Zeitstempel || 'n/a',
          medaillen: parseInt(row.Schnitzel || '0', 10),
          potatoes: parseInt(row.Kartoffeln || '0', 10),
          dauer: parseInt(row.Dauer || '0', 10)
        }))
        .filter((player: Player) => player.name !== 'Unbekannt')
        .sort((a: Player, b: Player) => b.medaillen - a.potatoes);
    } catch (err) {
      console.error('❌ Fehler beim Laden der Leaderboard-Daten:', err);
    }
  }

  goBack() {
    if (this.cameFromEnd) {
      this.router.navigate(['/end-Leaderboard']);
    } else {
      this.router.navigate(['/tabs/tasks']);
    }
  }
}
