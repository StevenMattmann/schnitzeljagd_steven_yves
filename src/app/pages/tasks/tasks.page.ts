import { Component, OnInit } from '@angular/core';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { TrackingService } from '../../services/tracking.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  imports: [IonicModule, CommonModule, RouterModule]
})
export class TasksPage implements OnInit, ViewWillEnter {
  medaillen$ = this.trackingService.medaillen$;
  kartoffeln$ = this.trackingService.kartoffeln$;

  tasks = [
    { name: 'Geolocation', label: '1. Task: Geolocation', route: '/geolocation', unlocked: true, completed: false },
    { name: 'Qr-Code', label: '2. Task: Qr-Code', route: '/qrcode', unlocked: false, completed: false },
    { name: 'Power', label: '3. Task: Power', route: '/power', unlocked: false, completed: false },
    { name: 'Distance', label: '4. Task: Distance', route: '/distance', unlocked: false, completed: false }
  ];

  constructor(private trackingService: TrackingService, private router: Router) {
    this.router.events.subscribe(() => this.updateTaskStates());
  }

  updateTaskStates() {
    this.tasks.forEach(task => {
      // Geolocation ist immer freigeschaltet
      if (task.name === 'Geolocation') {
        task.unlocked = true;
      } else {
        task.unlocked = !this.trackingService.isTaskCompleted(task.name) &&
          this.trackingService.isTaskStarted(task.name);
      }
      task.completed = this.trackingService.isTaskCompleted(task.name);
    });
  }

  ngOnInit() {
    this.updateTaskStates();
    this.trackingService.startOverallTimer()
  }

  ionViewWillEnter() {
    this.updateTaskStates();
  }
}
