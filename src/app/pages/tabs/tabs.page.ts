import { Component, EnvironmentInjector, inject } from '@angular/core';
import {IonTabs, IonTabBar, IonTabButton, IonButton} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square } from 'ionicons/icons';
import {AlertController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonButton],
  standalone: true
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(private alertController: AlertController, private router: Router) {
    addIcons({ triangle, ellipse, square });
  }

  async presentGiveUpAlert() {
    const alert = await this.alertController.create({
      header: 'Spiel aufgeben?',
      message: 'Willst du das Spiel wirklich aufgeben?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
        },
        {
          text: 'Ja, aufgeben',
          handler: () => {
            this.router.navigateByUrl('/end-Leaderboard');
          },
        },
      ],
    });

    await alert.present();
  }
}
