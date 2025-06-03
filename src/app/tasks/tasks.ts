
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: 'tasks.html',
  styleUrls: ['tasks.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class TasksPage {
  tasks = [
    { label: '1. Task', route: '/task1', unlocked: true, completed: true },
    { label: '2. Task', route: '/task2', unlocked: true, completed: false },
    { label: '3. Task', route: '/task3', unlocked: false, completed: false },
    { label: '4. Task', route: '/task4', unlocked: false, completed: false }
  ];

  medals = 1;
  potatoes = 0;
}
