import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tasks',
        loadComponent: () => import('../tasks/tasks.page').then(m => m.TasksPage)
      },
      {
        path: 'leaderboard',
        loadComponent: () =>
          import('../../leaderboard/leaderboard').then((m) => m.LeaderboardComponent),
      },
      {
        path: 'end-leaderboard',
        loadComponent: () =>
          import('../end-leaderboard/end-leaderboard.component').then((m) => m.EndLeaderboardComponent),
      },
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full',
      },
    ],
  },
];
