import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  imports: [IonicModule, CommonModule, RouterModule]
})
export class TasksPage {
  tasks = [
    { label: '1. Task: Geolocation', route: '/geolocation', unlocked: true, completed: true },
    { label: '2. Task: Qr-Code', route: '/qrcode', unlocked: true, completed: false },
    { label: '3. Task: Power', route: '/power', unlocked: true, completed: false },
    { label: '4. Task: Distance', route: '/distance', unlocked: true, completed: false }
  ];

  medals = 1;
  potatoes = 0;
}
